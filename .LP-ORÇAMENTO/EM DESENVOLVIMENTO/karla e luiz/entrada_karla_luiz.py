# -*- coding: utf-8 -*-
"""
TM-Testes — Orçamento real: Karla e Luiz (v2)
Porta FIXA 8181 para localStorage persistir entre runs.
Uso: python entrada_karla_luiz.py
"""
import os, sys, time, threading, http.server, socketserver, json
from pathlib import Path
sys.stdout.reconfigure(encoding='utf-8') if hasattr(sys.stdout, 'reconfigure') else None

from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

BASE_DIR  = Path(r"C:\Users\thiag\Desktop\Explan\.LP-ORÇAMENTO\EM DESENVOLVIMENTO")
SERVE_DIR = BASE_DIR.parent   # serve a partir de .LP-ORÇAMENTO/ para ../imagens-ambientes/ funcionar
IMG_DIR   = BASE_DIR / "karla e luiz"
PORT      = 8181           # FIXO — não mudar para localStorage persistir
BASE_URL  = f"http://localhost:{PORT}/EM DESENVOLVIMENTO"
SHOTS     = BASE_DIR / "test_screenshots_karla"
SHOTS.mkdir(exist_ok=True)

# ─── HTTP SERVER ────────────────────────────────────────────────────
class SilentHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

def start_server():
    os.chdir(SERVE_DIR)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SilentHandler) as httpd:
        httpd.serve_forever()

threading.Thread(target=start_server, daemon=True).start()
time.sleep(1.2)
print(f"[SERVER] {BASE_URL}  (porta fixa — localStorage persiste entre runs)")

# ─── HELPERS ────────────────────────────────────────────────────────
results = []
def ok(m):   results.append(True);  print(f"  [OK]   {m}")
def fail(m): results.append(False); print(f"  [FAIL] {m}")

def shot(page, name):
    try: page.screenshot(path=str(SHOTS / f"{name}.png"), full_page=True)
    except: pass

def catalog(env_card, value, qty):
    """Seleciona item do catálogo e adiciona."""
    env_card.locator(".item-sel").select_option(value=value)
    env_card.locator(".item-qty-new").fill(str(qty))
    env_card.locator("button:has-text('+ Catálogo')").click()

def manual(page, env_card, nome, unidade, preco, qtd):
    """Adiciona item manualmente."""
    env_card.locator("button:has-text('+ Manual')").click()
    page.wait_for_timeout(150)
    f = env_card.locator(".manual-form")
    f.locator(".manual-nome").fill(nome)
    f.locator(".manual-unidade").select_option(unidade)
    f.locator(".manual-preco").fill(str(preco))
    f.locator(".manual-qtd").fill(str(qtd))
    f.locator("button:has-text('Adicionar')").click()
    page.wait_for_timeout(200)

def add_env(page, nome_sel=None, custom=None):
    """Abre modal, cria ambiente, retorna o card."""
    page.locator(".add-env-btn").click()
    page.wait_for_selector("#modal.open", timeout=5000)
    if custom:
        page.locator("#env-sel").select_option(value="custom")
        page.locator("#env-custom").fill(custom)
    else:
        page.locator("#env-sel").select_option(label=nome_sel)
    page.locator("#modal button.btn-primary").click()
    page.wait_for_timeout(500)
    return page.locator(".env-card").last

def set_materiais(page, env_card):
    """
    Ativa: Chapa 15 (-10%), Cor Branco (-5%).
    Blum já é padrão — não precisa clicar.
    """
    # Abre painel de materiais
    env_card.locator("button[onclick*='toggleMaterials']").click()
    page.wait_for_timeout(300)
    env_id = env_card.get_attribute("data-env-id")
    mat = page.locator(f"#envmat-{env_id}")
    # Chapa 15
    mat.locator(".chip:has-text('Chapa 15')").click()
    page.wait_for_timeout(150)
    # Cor Branco
    mat.locator(".chip:has-text('Branco')").click()
    page.wait_for_timeout(150)
    # Fecha painel
    env_card.locator("button[onclick*='toggleMaterials']").click()
    page.wait_for_timeout(200)

# ─── MAIN ───────────────────────────────────────────────────────────
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=False, slow_mo=200)
    ctx     = browser.new_context(viewport={"width": 1440, "height": 900})
    page    = ctx.new_page()

    # ── 1. ABRIR APP ────────────────────────────────────────────────
    print("\n[1] Abrindo app...")
    page.goto(f"{BASE_URL}/login.html", wait_until="domcontentloaded")
    page.wait_for_timeout(600)
    page.evaluate("""() => {
        localStorage.setItem('explan_auth', JSON.stringify({email:'vendedor@explan.com', nome:'Vendedor'}));
        localStorage.setItem('explan_perfil', JSON.stringify({nome:'Vendedor Explan', cargo:'Consultor', email:'vendedor@explan.com'}));
    }""")
    page.goto(f"{BASE_URL}/sprint-09.html", wait_until="domcontentloaded")
    page.wait_for_timeout(1200)
    shot(page, "01_app")
    ok("App aberto")

    # ── 2. CLIENTE ──────────────────────────────────────────────────
    print("\n[2] Dados do cliente...")
    page.wait_for_selector("#nome-cliente")
    page.locator("#nome-cliente").fill("Karla e Luiz")
    page.wait_for_timeout(200)
    shot(page, "02_cliente")
    ok("Cliente: Karla e Luiz")

    # ── 3. COZINHA ──────────────────────────────────────────────────
    print("\n[3] Cozinha...")
    env_coz = add_env(page, "Cozinha")
    set_materiais(page, env_coz)
    # Armário bancada
    manual(page, env_coz, "Caixote c/ porta MDF lisa — Bancada",    "m²", 3450, 4.6)
    catalog(env_coz, "Dobradiça|200|un",          10)
    catalog(env_coz, "Corrediça Oculta|320|un",   3)
    # Armário superior em vidro
    catalog(env_coz, "Caixote c/ porta de vidro|3600|m²", 4.9)
    catalog(env_coz, "Dobradiça|200|un",          14)
    catalog(env_coz, "LED|250|ml",                5)
    # Armário inferior e torre
    manual(page, env_coz, "Caixote c/ porta MDF lisa — Inferior/Torre", "m²", 3450, 7)
    catalog(env_coz, "Dobradiça|200|un",          8)
    catalog(env_coz, "Corrediça Oculta|320|un",   6)
    # Painel liso
    catalog(env_coz, "Painel Liso|2100|m²",       6)
    shot(page, "03_cozinha")
    ok("Cozinha: 10 itens")

    # ── 4. SALA / HALL ──────────────────────────────────────────────
    print("\n[4] Sala / Hall de Entrada...")
    env_sala = add_env(page, "Sala de Estar")
    set_materiais(page, env_sala)
    catalog(env_sala, "Painel Liso|2100|m²",       26)   # painel TV/porta mimetizada/Hall
    manual(page, env_sala, "Porta Pivotante",       "un", 1600, 2)
    manual(page, env_sala, "Caixote c/ porta MDF lisa", "m²", 3450, 5)
    catalog(env_sala, "Corrediça Oculta|320|un",   4)
    # Aparador
    manual(page, env_sala, "Caixote c/ porta MDF lisa — Aparador", "m²", 3450, 3)
    catalog(env_sala, "Dobradiça|200|un",           8)
    shot(page, "04_sala")
    ok("Sala/Hall: 6 itens")

    # ── 5. ESCRITÓRIO ───────────────────────────────────────────────
    print("\n[5] Escritório...")
    env_escr = add_env(page, "Escritório / Home Office")
    set_materiais(page, env_escr)
    catalog(env_escr, "Prateleira até 60cm|600|ml", 10)
    manual(page, env_escr, "Caixote c/ porta MDF lisa", "m²", 3450, 9)
    catalog(env_escr, "Corrediça Oculta|320|un",   3)
    catalog(env_escr, "Dobradiça|200|un",          12)
    shot(page, "05_escritorio")
    ok("Escritório: 4 itens")

    # ── 6. CLOSET ───────────────────────────────────────────────────
    print("\n[6] Closet...")
    env_closet = add_env(page, "Closet")
    set_materiais(page, env_closet)
    manual(page, env_closet, "Caixaria Closet c/ porta MDF lisa", "m²", 3450, 14)
    manual(page, env_closet, "Kit Dominus — Porta de Correr",     "un", 1800, 3)
    catalog(env_closet, "Corrediça Oculta|320|un",  20)
    catalog(env_closet, "Caixote c/ porta de vidro|3600|m²", 9)
    shot(page, "06_closet")
    ok("Closet: 4 itens")

    # ── 7. SUÍTE 1 ──────────────────────────────────────────────────
    print("\n[7] Suite 1...")
    env_suite = add_env(page, custom="Suíte 1")
    set_materiais(page, env_suite)
    manual(page, env_suite, "Caixaria c/ porta MDF lisa", "m²", 3450, 8)
    catalog(env_suite, "Espelho|1300|m²",           3)
    manual(page, env_suite, "Kit Dominus",           "un", 1800, 1)
    catalog(env_suite, "Corrediça Oculta|320|un",   8)
    shot(page, "07_suite")
    ok("Suite 1: 4 itens")

    # ── 8. BANHEIRO ─────────────────────────────────────────────────
    print("\n[8] Banheiro...")
    env_ban = add_env(page, "Banheiro")
    set_materiais(page, env_ban)
    catalog(env_ban, "Caixote c/ porta de vidro|3600|m²", 1.8)
    catalog(env_ban, "Dobradiça|200|un",            8)
    shot(page, "08_banheiro")
    ok("Banheiro: 2 itens")

    # ── 9. SALVAR PROJETO ───────────────────────────────────────────
    print("\n[9] Salvando projeto...")
    page.locator("button.nav-btn[onclick*='panel-projetos']").click()
    page.wait_for_timeout(400)
    page.locator("button:has-text('Salvar Projeto Atual')").click()
    page.wait_for_timeout(800)
    # Verificar que salvou
    saved = page.evaluate("() => JSON.parse(localStorage.getItem('explan_projetos') || '[]')")
    if saved:
        ok(f"Projeto salvo — {len(saved)} projeto(s) em explan_projetos")
        # Backup em JSON para não perder
        (BASE_DIR / "karla_luiz_backup.json").write_text(
            json.dumps(saved, ensure_ascii=False, indent=2), encoding="utf-8"
        )
        ok("Backup salvo em karla_luiz_backup.json")
    else:
        fail("Projeto nao encontrado no localStorage")
    shot(page, "09_projeto_salvo")

    # Fecha TODOS os painéis antes de continuar
    page.evaluate("() => { if(typeof closeAllPanels === 'function') closeAllPanels(); }")
    page.wait_for_timeout(500)

    # ── 10. GERAR APRESENTAÇÃO + UPLOAD DE IMAGENS ──────────────────
    print("\n[10] Gerando Apresentacao...")
    with ctx.expect_page() as new_page_info:
        page.locator("button.btn-olive").click()
    apresent_page = new_page_info.value
    apresent_page.wait_for_load_state("domcontentloaded")
    apresent_page.wait_for_timeout(1500)
    shot(apresent_page, "10_apresentacao_vazia")
    ok("Editor de apresentacao aberto")

    # Mapeamento: índice do ambiente → pasta de imagens (1 foto apenas para apresentação)
    IMG_MAP = {
        0: IMG_DIR / "Cozinha",
        1: IMG_DIR / "Hall de entrada",
        2: IMG_DIR / "Escritório",
        3: IMG_DIR / "Closet",
        4: IMG_DIR / "Suíte",
        5: IMG_DIR / "Banheiro",
    }

    for idx, img_folder in IMG_MAP.items():
        imgs = sorted(img_folder.glob("*.jpg")) + sorted(img_folder.glob("*.png"))
        if not imgs:
            print(f"  [WARN] Sem imagens em {img_folder}")
            continue
        file_input_id = f"file-amb-{idx}"
        try:
            fi = apresent_page.locator(f"#{file_input_id}")
            fi.set_input_files([str(p) for p in imgs])   # todas as fotos
            apresent_page.wait_for_timeout(600)
            ok(f"Apresentacao img {idx} ({img_folder.name}): {len(imgs)} foto(s)")
        except Exception as e:
            fail(f"Apresentacao img {idx} ({img_folder.name}): {str(e)[:80]}")

    shot(apresent_page, "11_apresentacao_com_imagens")
    ok("Apresentacao com imagens concluida")

    # ── 11. GERAR PDF (orçamento) ────────────────────────────────────
    print("\n[11] Gerando PDF do orcamento...")
    page.bring_to_front()
    try:
        with ctx.expect_page() as orc_info:
            page.locator("button:has-text('Gerar PDF')").click()
        orcamento_page = orc_info.value
        orcamento_page.wait_for_load_state("domcontentloaded")
        orcamento_page.wait_for_timeout(2000)
        shot(orcamento_page, "12_orcamento_sem_foto")
        ok("Orcamento PDF aberto")

        # Upload de 1 foto por ambiente no orçamento
        print("\n[12] Inserindo fotos no orcamento...")
        for idx, img_folder in IMG_MAP.items():
            imgs = sorted(img_folder.glob("*.jpg")) + sorted(img_folder.glob("*.png"))
            if not imgs:
                continue
            try:
                fi = orcamento_page.locator(f"#file-orc-{idx}")
                fi.set_input_files([str(imgs[0])])
                orcamento_page.wait_for_timeout(500)
                ok(f"Orcamento foto {idx} ({img_folder.name}): {imgs[0].name}")
            except Exception as e:
                fail(f"Orcamento foto {idx}: {str(e)[:80]}")

        orcamento_page.wait_for_timeout(600)
        shot(orcamento_page, "13_orcamento_com_fotos")
        ok("Orcamento com fotos concluido")
    except Exception as e:
        fail(f"PDF: {str(e)[:80]}")

    shot(page, "99_final")

    # ── RESULTADO ───────────────────────────────────────────────────
    total = len(results)
    passou = sum(results)
    print("\n" + "="*62)
    print(f"  TM-TESTES — Karla e Luiz: {passou}/{total} etapas OK")
    print(f"  App: {BASE_URL}/sprint-09.html  (porta fixa — abrir sempre aqui)")
    print(f"  Backup: {BASE_DIR / 'karla_luiz_backup.json'}")
    print(f"  Screenshots: {SHOTS}/")
    print("="*62)

    print("\n[Browser aberto — feche esta janela quando terminar de visualizar]")
    print(f"  Apresentacao: {BASE_URL}/apresentacao-editor.html")
    print(f"  Orcamento:    {BASE_URL}/orcamento-editor.html")
    try:
        input("\nPressione ENTER para fechar o browser... ")
    except (EOFError, KeyboardInterrupt):
        time.sleep(7200)   # mantém aberto por 2h se rodar sem terminal interativo
    browser.close()
