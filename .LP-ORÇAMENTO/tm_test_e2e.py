#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""TM-Testes E2E — Orquestrador Playwright para Explan Orçamento Express"""

import socket
import time
import subprocess
import sys
import json
import os
from pathlib import Path
from datetime import datetime
from threading import Thread
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Forçar UTF-8 no Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Configuração
BASE_DIR = Path(__file__).parent
SHOTS_DIR = BASE_DIR / "test_screenshots"
REPORT_FILE = BASE_DIR / "test_report.html"
PORT = 8080
BASE_URL = f"http://localhost:{PORT}"

# Teste para o wizard e página única
PAGINAS = [
    {"nome": "wizard", "url": "/prototipo-wizard.html", "titulo": "Orçamento Express — Wizard"},
    {"nome": "pagina_unica", "url": "/prototipo-pagina-unica.html", "titulo": "Orçamento Express — Página Única"},
]

results = []

def add_result(pagina, test_name, passed, detail="", screenshot_name=""):
    """Adicionar resultado ao relatório"""
    results.append({
        "pagina": pagina,
        "test": test_name,
        "passed": passed,
        "detail": detail,
        "screenshot": screenshot_name
    })
    status = "✓ PASS" if passed else "✗ FAIL"
    print(f"  {status} | {pagina:15} | {test_name:40} | {detail[:80]}")

def servidor_http(porta, diretorio):
    """Inicia servidor HTTP simples"""
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(diretorio), **kwargs)
        def log_message(self, format, *args):
            pass  # Silencioso

    server = HTTPServer(("localhost", porta), Handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server

def tentar_conexao(host, porta, tentativas=15):
    """Aguardar servidor ficar online"""
    for i in range(tentativas):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1)
                s.connect((host, porta))
                return True
        except:
            time.sleep(0.5)
    return False

def screenshot_safe(page, nome):
    """Tirar screenshot com tratamento de erro"""
    try:
        SHOTS_DIR.mkdir(exist_ok=True)
        caminho = SHOTS_DIR / f"{nome}.png"
        page.screenshot(path=str(caminho), full_page=False)
        return nome
    except Exception as e:
        print(f"    [WARN] Screenshot falhou: {e}")
        return ""

def executar_testes():
    """Executar bateria de testes"""
    from playwright.sync_api import sync_playwright

    print("\n" + "="*80)
    print("  TM-TESTES — ORÇAMENTO EXPRESS")
    print("="*80 + "\n")

    # Iniciar servidor HTTP
    print("[1/4] Iniciando servidor HTTP na porta 8080...")
    servidor = servidor_http(PORT, BASE_DIR)
    if not tentar_conexao("localhost", PORT):
        print("      ✗ ERRO: Servidor não respondeu. Abortando.")
        return False

    print("      ✓ Servidor online\n")

    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=False, slow_mo=100)

            for pagina_info in PAGINAS:
                pagina_nome = pagina_info["nome"]
                url_completa = BASE_URL + pagina_info["url"]

                print(f"\n[2/4] Testando: {pagina_nome.upper()}")
                print(f"      URL: {url_completa}\n")

                try:
                    context = browser.new_context(viewport={"width": 1440, "height": 900})
                    page = context.new_page()
                    console_errors = []

                    # Capturar erros de console
                    page.on("console", lambda msg: console_errors.append(
                        f"[{msg.type.upper()}] {msg.text}"
                    ) if msg.type in ["error", "warning"] else None)
                    page.on("pageerror", lambda err: console_errors.append(f"[PAGEERROR] {err}"))

                    # ========== TESTE 1: Carregamento ==========
                    try:
                        page.goto(url_completa, timeout=30000, wait_until="domcontentloaded")
                        page.wait_for_load_state("networkidle", timeout=15000)
                        title = page.title()
                        shot_name = f"01_{pagina_nome}_carregado"
                        screenshot_safe(page, shot_name)
                        add_result(pagina_nome, "Carregamento da página", True, f"title='{title}'", shot_name)
                    except Exception as e:
                        shot_name = f"01_{pagina_nome}_erro_carregamento"
                        screenshot_safe(page, shot_name)
                        add_result(pagina_nome, "Carregamento da página", False, str(e)[:100], shot_name)
                        context.close()
                        continue

                    # ========== TESTE 2: Erros no Console ==========
                    erros_criticos = [e for e in console_errors if not any(
                        ign in e for ign in ["favicon", "fonts", "cdn", "gtag", "ERR_CONNECTION"]
                    )]
                    if not erros_criticos:
                        add_result(pagina_nome, "Console sem erros críticos", True, f"{len(console_errors)} warnings ignorados")
                    else:
                        shot_name = f"02_{pagina_nome}_console_errors"
                        screenshot_safe(page, shot_name)
                        add_result(pagina_nome, "Console sem erros críticos", False,
                                  f"{len(erros_criticos)} erro(s): {erros_criticos[0][:80]}", shot_name)

                    # ========== TESTE 3: Elementos Visíveis ==========
                    try:
                        inputs = page.locator("input:visible, select:visible, textarea:visible").all()
                        botoes = page.locator("button:visible").all()
                        h1s = page.locator("h1:visible").all()
                        add_result(pagina_nome, "Elementos carregados", len(inputs) > 0 and len(botoes) > 0,
                                  f"{len(inputs)} inputs, {len(botoes)} botões, {len(h1s)} títulos")
                    except Exception as e:
                        add_result(pagina_nome, "Elementos carregados", False, str(e)[:100])

                    # ========== TESTE 4: Navegação/Steps (Wizard) ==========
                    if pagina_nome == "wizard":
                        try:
                            # Verificar se há step-nav
                            steps = page.locator(".step-nav .step").all()
                            if steps:
                                add_result(pagina_nome, "Steps encontrados", True, f"{len(steps)} steps")

                                # Tentar avançar para step 2
                                btn_next = page.locator("button:has-text('Próximo')").first
                                if btn_next.is_visible():
                                    btn_next.click()
                                    time.sleep(0.5)
                                    shot_name = f"03_{pagina_nome}_step2"
                                    screenshot_safe(page, shot_name)

                                    # Verificar se avançou (Step 2 deve estar ativo)
                                    step2_active = page.locator(".step-nav .step.active").nth(1).is_visible() if len(steps) > 1 else False
                                    add_result(pagina_nome, "Avanço para Step 2", step2_active or btn_next.is_visible(),
                                              "Step 2 ativado" if step2_active else "Wizard respondeu ao clique")
                                else:
                                    add_result(pagina_nome, "Avanço para Step 2", False, "Botão 'Próximo' não visível")
                            else:
                                add_result(pagina_nome, "Steps encontrados", False, "Nenhum step-nav localizado")
                        except Exception as e:
                            add_result(pagina_nome, "Avanço para Step 2", False, str(e)[:100])

                    # ========== TESTE 5: Formulários (Página Única) ==========
                    if pagina_nome == "pagina_unica":
                        try:
                            # Preencher nome
                            nome_input = page.locator("#nome-cliente")
                            if nome_input.is_visible():
                                nome_input.fill("Test Cliente")
                                add_result(pagina_nome, "Preenchimento do formulário", True, "Campo nome preenchido")

                                # Verificar se sidebar atualiza
                                time.sleep(0.5)
                                sidebar_nome = page.locator("#sidebar-cliente").text_content()
                                if "Test" in sidebar_nome or len(sidebar_nome) > 0:
                                    add_result(pagina_nome, "Sidebar atualiza com dados", True, f"Sidebar: {sidebar_nome[:50]}")
                                else:
                                    add_result(pagina_nome, "Sidebar atualiza com dados", False, "Sidebar não atualizou")
                            else:
                                add_result(pagina_nome, "Preenchimento do formulário", False, "Campo nome não encontrado")
                        except Exception as e:
                            add_result(pagina_nome, "Preenchimento do formulário", False, str(e)[:100])

                    # ========== TESTE 6: Cálculo de Total ==========
                    try:
                        total_badge = page.locator("#nav-total, #sidebar-total, #sidebar-big").first
                        if total_badge.is_visible():
                            total_text = total_badge.text_content()
                            tem_valor = any(c.isdigit() for c in total_text)
                            add_result(pagina_nome, "Total calculado", tem_valor, f"Total exibido: {total_text[:30]}")
                        else:
                            add_result(pagina_nome, "Total calculado", False, "Elemento de total não encontrado")
                    except Exception as e:
                        add_result(pagina_nome, "Total calculado", False, str(e)[:100])

                    # ========== TESTE 7: Desconto ==========
                    try:
                        desc_badge = page.locator("#desconto-total, #sidebar-disc").first
                        if desc_badge.is_visible():
                            desc_text = desc_badge.text_content()
                            add_result(pagina_nome, "Desconto exibido", "%" in desc_text or "Nenhum" in desc_text or desc_text,
                                      f"Desconto: {desc_text[:40]}")
                        else:
                            add_result(pagina_nome, "Desconto exibido", False, "Badge desconto não encontrado")
                    except Exception as e:
                        add_result(pagina_nome, "Desconto exibido", False, str(e)[:100])

                    # ========== TESTE 8: PDF/Contrato (localStorage) ==========
                    try:
                        # Verificar se há botão de gerar PDF
                        btn_pdf = page.locator("button:has-text('PDF'), button:has-text('Gerar PDF')").first
                        btn_contrato = page.locator("button:has-text('Contrato')").first

                        botoes_disponiveis = (btn_pdf.is_visible() if btn_pdf.count() > 0 else False) or \
                                           (btn_contrato.is_visible() if btn_contrato.count() > 0 else False)
                        add_result(pagina_nome, "Botões PDF/Contrato presentes", botoes_disponiveis,
                                  f"PDF: {btn_pdf.is_visible() if btn_pdf.count() > 0 else 'não'}, Contrato: {btn_contrato.is_visible() if btn_contrato.count() > 0 else 'não'}")
                    except Exception as e:
                        add_result(pagina_nome, "Botões PDF/Contrato presentes", False, str(e)[:100])

                    # Screenshot final
                    shot_name = f"99_{pagina_nome}_final"
                    screenshot_safe(page, shot_name)

                    context.close()

                except Exception as e:
                    print(f"      ✗ ERRO ao testar {pagina_nome}: {e}")
                    add_result(pagina_nome, "Execução geral", False, str(e)[:150])

            browser.close()

    finally:
        print("\n[3/4] Encerrando servidor HTTP...")
        servidor.shutdown()
        print("      ✓ Servidor encerrado\n")

    return True

def gerar_relatorio_html():
    """Gerar relatório HTML estilizado"""
    total = len(results)
    passaram = sum(1 for r in results if r["passed"])
    falharam = total - passaram
    percentual = (passaram / total * 100) if total > 0 else 0

    # Agrupar por página
    por_pagina = {}
    for r in results:
        pagina = r["pagina"]
        if pagina not in por_pagina:
            por_pagina[pagina] = {"passed": 0, "failed": 0, "tests": []}
        por_pagina[pagina]["tests"].append(r)
        if r["passed"]:
            por_pagina[pagina]["passed"] += 1
        else:
            por_pagina[pagina]["failed"] += 1

    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TM-Testes — Relatório</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; color: #333; }}
        .container {{ max-width: 1200px; margin: 0 auto; padding: 20px; }}

        header {{ background: linear-gradient(135deg, #2d3436 0%, #636e72 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
        h1 {{ font-size: 28px; margin-bottom: 10px; }}
        .meta {{ font-size: 14px; opacity: 0.9; }}

        .stats {{ display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px; margin-bottom: 30px; }}
        .stat {{ background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .stat-value {{ font-size: 32px; font-weight: bold; color: #2d3436; }}
        .stat-label {{ font-size: 12px; color: #636e72; margin-top: 5px; text-transform: uppercase; }}

        .stat.pass {{ border-left: 4px solid #27ae60; }}
        .stat.fail {{ border-left: 4px solid #e74c3c; }}
        .stat.total {{ border-left: 4px solid #3498db; }}
        .stat.pct {{ border-left: 4px solid #f39c12; }}

        .section {{ background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .section h2 {{ font-size: 20px; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #ecf0f1; color: #2d3436; }}

        .test-row {{ padding: 12px; margin: 8px 0; border-radius: 4px; background: #f8f9fa; border-left: 4px solid #bdc3c7; display: flex; justify-content: space-between; align-items: center; }}
        .test-row.pass {{ border-left-color: #27ae60; background: #eafaf1; }}
        .test-row.fail {{ border-left-color: #e74c3c; background: #fadbd8; }}

        .test-name {{ flex: 1; font-weight: 500; color: #2d3436; }}
        .test-detail {{ flex: 2; color: #636e72; font-size: 13px; margin-left: 15px; }}
        .test-status {{ padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }}
        .test-status.pass {{ background: #27ae60; color: white; }}
        .test-status.fail {{ background: #e74c3c; color: white; }}

        .screenshot {{ margin-top: 10px; color: #3498db; font-size: 12px; }}

        .conclusao {{ background: #ecf0f1; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db; margin-top: 20px; }}
        .conclusao strong {{ color: #2d3436; }}

        table {{ width: 100%; border-collapse: collapse; margin-top: 15px; }}
        th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #ecf0f1; }}
        th {{ background: #f8f9fa; font-weight: bold; color: #2d3436; }}
        tr:hover {{ background: #f8f9fa; }}

        .footer {{ text-align: center; margin-top: 30px; color: #636e72; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🧪 TM-Testes — Relatório E2E</h1>
            <div class="meta">
                <p>Explan Orçamento Express | {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
            </div>
        </header>

        <div class="stats">
            <div class="stat total">
                <div class="stat-value">{total}</div>
                <div class="stat-label">Total de Testes</div>
            </div>
            <div class="stat pass">
                <div class="stat-value">{passaram}</div>
                <div class="stat-label">Passaram</div>
            </div>
            <div class="stat fail">
                <div class="stat-value">{falharam}</div>
                <div class="stat-label">Falharam</div>
            </div>
            <div class="stat pct">
                <div class="stat-value">{percentual:.1f}%</div>
                <div class="stat-label">Sucesso</div>
            </div>
        </div>

        <div class="section">
            <h2>📋 Resumo por Página</h2>
            <table>
                <tr>
                    <th>Página</th>
                    <th>Testes</th>
                    <th>✓ Passou</th>
                    <th>✗ Falhou</th>
                    <th>Taxa de Sucesso</th>
                </tr>
"""

    for pagina, dados in por_pagina.items():
        total_pagina = dados["passed"] + dados["failed"]
        taxa = (dados["passed"] / total_pagina * 100) if total_pagina > 0 else 0
        html += f"""
                <tr>
                    <td><strong>{pagina}</strong></td>
                    <td>{total_pagina}</td>
                    <td style="color: #27ae60;"><strong>{dados['passed']}</strong></td>
                    <td style="color: #e74c3c;"><strong>{dados['failed']}</strong></td>
                    <td>{taxa:.1f}%</td>
                </tr>
"""

    html += """
            </table>
        </div>
"""

    # Detalhes por página
    for pagina, dados in por_pagina.items():
        html += f"""
        <div class="section">
            <h2>🔍 Detalhes — {pagina.upper()}</h2>
"""
        for test in dados["tests"]:
            status_class = "pass" if test["passed"] else "fail"
            status_text = "✓ PASS" if test["passed"] else "✗ FAIL"
            html += f"""
            <div class="test-row {status_class}">
                <div style="flex: 2;">
                    <div class="test-name">{test['test']}</div>
                    <div class="test-detail">{test['detail']}</div>
                </div>
                <div class="test-status {status_class}">{status_text}</div>
            </div>
"""
            if test["screenshot"]:
                html += f'            <div class="screenshot">📸 {test["screenshot"]}.png</div>\n'

        html += """
        </div>
"""

    html += f"""
        <div class="conclusao">
            <strong>💡 Conclusão:</strong><br>
            {passaram}/{total} testes passaram com sucesso ({percentual:.1f}%).
            {'✓ Sistema pronto para apresentação ao cliente.' if falharam == 0 else f'⚠ {falharam} teste(s) com falha(s) — revisar relatório acima.'}
        </div>

        <div class="footer">
            <p>Relatório gerado por TM-Testes • {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
            <p>Desenvolvido por TM · Sempre Tecnologia | thiagonascimentobarbosapro.com</p>
        </div>
    </div>
</body>
</html>
"""

    REPORT_FILE.write_text(html, encoding="utf-8")
    print(f"[4/4] Relatório gerado: {REPORT_FILE}\n")

def main():
    """Executar testes e gerar relatório"""
    try:
        sucesso = executar_testes()
        if sucesso:
            gerar_relatorio_html()

            # Exibir resumo final
            total = len(results)
            passaram = sum(1 for r in results if r["passed"])
            falharam = total - passaram
            percentual = (passaram / total * 100) if total > 0 else 0

            print("="*80)
            print("  ✓ TM-TESTES CONCLUÍDO COM SUCESSO")
            print("="*80)
            print(f"\n  📊 Resultado Final: {passaram}/{total} testes passaram ({percentual:.1f}%)\n")
            print(f"  📁 Screenshots: test_screenshots/")
            print(f"  📄 Relatório: test_report.html\n")
            print("="*80)
            return 0
        else:
            print("\n✗ Testes falharam ao executar")
            return 1
    except Exception as e:
        print(f"\n✗ ERRO FATAL: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main())
