"use client";

import { useEffect } from "react";
import { useOrcamento, calcularTotal, calcularPagamento, calcularDescontoMateriais } from "@/lib/store";

// ── FOTOS padrão por tipo de ambiente ──
const FOTOS: Record<string, string> = {
  cozinha: "/images-orçamento/opt-cozinha.png",
  sala: "/images-orçamento/opt-sala-estar.png",
  quarto: "/images-orçamento/opt-dormitorio-master.png",
  "dormitório": "/images-orçamento/opt-dormitorio-master.png",
  closet: "/images-orçamento/opt-closet.png",
  "escritório": "/images-orçamento/opt-home-office.png",
  "home office": "/images-orçamento/opt-home-office.png",
  banheiro: "/images-orçamento/opt-banheiro.png",
  lavanderia: "/images-orçamento/opt-lavanderia.png",
  gourmet: "/images-orçamento/opt-gourmet-vignette.png",
  jantar: "/images-orçamento/opt-sala-jantar.png",
  casal: "/images-orçamento/opt-dormitorio-casal.png",
  filho: "/images-orçamento/opt-dormitorio-filho.png",
  lavabo: "/images-orçamento/opt-lavabo.png",
  despensa: "/images-orçamento/opt-despensa.png",
  corredor: "/images-orçamento/opt-corredor.png",
  "suite master": "/images-orçamento/opt-suite-master-alt.png",
  "suíte master": "/images-orçamento/opt-suite-master-alt.png",
  "suíte": "/images-orçamento/opt-suite-master-alt.png",
  "suite": "/images-orçamento/opt-suite-master-alt.png",
};

function fotoParaAmbiente(nome: string): string {
  const n = nome.toLowerCase();
  for (const [key, url] of Object.entries(FOTOS)) {
    if (n.includes(key)) return url;
  }
  return "/images-orçamento/opt-ambiente-variacao.png";
}

// ── Formata nome do ambiente: remove emoji, sufixos "Planejada/o/os" ──
function formatarNomeAmbiente(nome: string): { primeiraLinha: string; restante: string } {
  const nomeFormatado = nome.replace(/^[\p{Emoji}\s]+/u, "").trim();
  const nomeSemSufixo = nomeFormatado.replace(/\s+(Planejad[ao]s?)$/i, "");
  const palavras = nomeSemSufixo.split(" ");
  const primeiraLinha = palavras[0] || nomeSemSufixo;
  const restante = palavras.slice(1).join(" ");
  return { primeiraLinha, restante };
}

// ── Gera referência do documento ──
function gerarRef(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `EXP-${ano}-${mes}${dia}`;
}

// ── Formata valor monetário ──
function fmtMoeda(v: number): string {
  return "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
}

// ── DRAG + RESIZE (vanilla, aplicado via useEffect) ──
let _oDrag: any = null;
let _oResize: any = null;

function orcPosHandle(h: HTMLElement, img: HTMLElement) {
  const dir = h.dataset.dir;
  const l = img.offsetLeft;
  const t = img.offsetTop;
  const w = img.offsetWidth;
  const ih = img.offsetHeight;
  if (dir === "nw") { h.style.left = (l - 7) + "px"; h.style.top = (t - 7) + "px"; }
  if (dir === "ne") { h.style.left = (l + w - 7) + "px"; h.style.top = (t - 7) + "px"; }
  if (dir === "sw") { h.style.left = (l - 7) + "px"; h.style.top = (t + ih - 7) + "px"; }
  if (dir === "se") { h.style.left = (l + w - 7) + "px"; h.style.top = (t + ih - 7) + "px"; }
}

function instalarDragResize() {
  document.querySelectorAll(".amb-photo-col").forEach((col) => {
    const el = col as HTMLElement;
    if (el.dataset.drInit) return;
    el.dataset.drInit = "1";
    const img = el.querySelector("img") as HTMLElement | null;
    if (!img) return;

    ["nw", "ne", "sw", "se"].forEach((dir) => {
      const h = document.createElement("div");
      h.className = "orc-resize-handle " + dir;
      h.dataset.dir = dir;
      el.appendChild(h);
      orcPosHandle(h, img);
      h.addEventListener("mousedown", (e) => {
        e.preventDefault(); e.stopPropagation();
        _oResize = {
          h, img, col: el, dir,
          sx: (e as MouseEvent).clientX, sy: (e as MouseEvent).clientY,
          sl: img.offsetLeft, st: img.offsetTop,
          sw: img.offsetWidth, sh: img.offsetHeight,
        };
      });
      h.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        const t = (e as TouchEvent).touches[0];
        _oResize = {
          h, img, col: el, dir,
          sx: t.clientX, sy: t.clientY,
          sl: img.offsetLeft, st: img.offsetTop,
          sw: img.offsetWidth, sh: img.offsetHeight,
        };
      }, { passive: true });
    });

    img.addEventListener("mousedown", (e) => {
      if ((e as MouseEvent).button !== 0) return;
      e.preventDefault();
      const cRect = el.getBoundingClientRect();
      const iRect = img.getBoundingClientRect();
      const cl = iRect.left - cRect.left;
      const ct = iRect.top - cRect.top;
      img.style.left = cl + "px";
      img.style.top = ct + "px";
      img.style.right = "auto";
      img.style.bottom = "auto";
      img.style.width = iRect.width + "px";
      img.style.height = iRect.height + "px";
      _oDrag = { img, col: el, ox: (e as MouseEvent).clientX - cl, oy: (e as MouseEvent).clientY - ct };
    });
    img.addEventListener("touchstart", (e) => {
      const t = (e as TouchEvent).touches[0];
      const cRect = el.getBoundingClientRect();
      const iRect = img.getBoundingClientRect();
      const cl = iRect.left - cRect.left;
      const ct = iRect.top - cRect.top;
      img.style.left = cl + "px";
      img.style.top = ct + "px";
      img.style.right = "auto";
      img.style.bottom = "auto";
      img.style.width = iRect.width + "px";
      img.style.height = iRect.height + "px";
      _oDrag = { img, col: el, ox: t.clientX - cl, oy: t.clientY - ct };
    }, { passive: true });
  });
}

function onMouseMove(e: MouseEvent) {
  if (_oDrag) {
    const { img, col, ox, oy } = _oDrag;
    const cw = (col as HTMLElement).offsetWidth;
    const ch = (col as HTMLElement).offsetHeight;
    let nl = e.clientX - ox;
    let nt = e.clientY - oy;
    nl = Math.max(-img.offsetWidth * 0.5, Math.min(nl, cw - img.offsetWidth * 0.5));
    nt = Math.max(-img.offsetHeight * 0.5, Math.min(nt, ch - img.offsetHeight * 0.5));
    img.style.right = "auto";
    img.style.bottom = "auto";
    img.style.left = nl + "px";
    img.style.top = nt + "px";
    (col as HTMLElement).querySelectorAll(".orc-resize-handle").forEach((h) => orcPosHandle(h as HTMLElement, img));
  }
  if (_oResize) {
    const { img, col, dir, sx, sy, sl, st, sw, sh } = _oResize;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    const MIN = 60;
    let nl = sl, nt = st, nw = sw, nh = sh;
    if (dir === "se") { nw = Math.max(MIN, sw + dx); nh = Math.max(MIN, sh + dy); }
    if (dir === "sw") { nw = Math.max(MIN, sw - dx); nl = sl + sw - nw; nh = Math.max(MIN, sh + dy); }
    if (dir === "ne") { nw = Math.max(MIN, sw + dx); nh = Math.max(MIN, sh - dy); nt = st + sh - nh; }
    if (dir === "nw") { nw = Math.max(MIN, sw - dx); nl = sl + sw - nw; nh = Math.max(MIN, sh - dy); nt = st + sh - nh; }
    img.style.cssText = `position:absolute;left:${nl}px;top:${nt}px;width:${nw}px;height:${nh}px;cursor:move;user-select:none;touch-action:none;object-fit:cover;opacity:.9;`;
    (col as HTMLElement).querySelectorAll(".orc-resize-handle").forEach((h) => orcPosHandle(h as HTMLElement, img));
  }
}

function onTouchMove(e: TouchEvent) {
  const t = e.touches[0];
  if (_oDrag) {
    const { img, col, ox, oy } = _oDrag;
    let nl = t.clientX - ox;
    let nt = t.clientY - oy;
    img.style.right = "auto";
    img.style.bottom = "auto";
    img.style.left = nl + "px";
    img.style.top = nt + "px";
    (col as HTMLElement).querySelectorAll(".orc-resize-handle").forEach((h) => orcPosHandle(h as HTMLElement, img));
  }
  if (_oResize) {
    const { img, col, dir, sx, sy, sl, st, sw, sh } = _oResize;
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    const MIN = 60;
    let nl = sl, nt = st, nw = sw, nh = sh;
    if (dir === "se") { nw = Math.max(MIN, sw + dx); nh = Math.max(MIN, sh + dy); }
    if (dir === "sw") { nw = Math.max(MIN, sw - dx); nl = sl + sw - nw; nh = Math.max(MIN, sh + dy); }
    if (dir === "ne") { nw = Math.max(MIN, sw + dx); nh = Math.max(MIN, sh - dy); nt = st + sh - nh; }
    if (dir === "nw") { nw = Math.max(MIN, sw - dx); nl = sl + sw - nw; nh = Math.max(MIN, sh - dy); nt = st + sh - nh; }
    img.style.cssText = `position:absolute;left:${nl}px;top:${nt}px;width:${nw}px;height:${nh}px;cursor:move;user-select:none;touch-action:none;object-fit:cover;opacity:.9;`;
    (col as HTMLElement).querySelectorAll(".orc-resize-handle").forEach((h) => orcPosHandle(h as HTMLElement, img));
  }
}

function onPointerUp() { _oDrag = null; _oResize = null; }

/* ── TROCAR FOTO DA CAPA ── */
function trocarFotoCapa(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const bg = document.querySelector(".cover-bg") as HTMLImageElement | null;
    if (!bg) return;
    bg.src = e.target?.result as string;
    bg.style.display = "block";
    bg.onerror = null;
  };
  reader.readAsDataURL(file);
}

/* ── TROCAR FOTO POR AMBIENTE ── */
function trocarFotoOrc(file: File, idx: number) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const cols = document.querySelectorAll(".amb-photo-col");
    const col = cols[idx] as HTMLElement | null;
    if (!col) return;
    col.querySelectorAll(".orc-resize-handle").forEach((h) => h.remove());
    delete col.dataset.drInit;
    let img = col.querySelector("img") as HTMLImageElement | null;
    if (!img) { img = document.createElement("img"); col.prepend(img); }
    img.src = e.target?.result as string;
    img.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.9;cursor:move;user-select:none;touch-action:none;";
    setTimeout(instalarDragResize, 80);
  };
  reader.readAsDataURL(file);
}

export default function EditorContent() {
  const { cliente, ambientes } = useOrcamento();
  const total = calcularTotal(ambientes);
  const pagamento = calcularPagamento(total);
  const descontoInfo = calcularDescontoMateriais(ambientes);

  const nome = cliente.nome || "Cliente";
  const prazo = cliente.prazo || "45 dias";
  const instalacao = cliente.instalacao || "7 dias";
  const ref = gerarRef();
  const refPartes = ref.match(/^EXP-(\d{4})-(\d{2})(\d{2})/);
  const refFormatado = refPartes
    ? `EXP - ${refPartes[3]}/${refPartes[2]}/${refPartes[1]}`
    : ref;

  const val30 = new Date();
  val30.setDate(val30.getDate() + 30);
  const validade = val30.toLocaleDateString("pt-BR").replace(/\//g, " / ");

  const totalPages = 2 + ambientes.length + 1; // capa + quem somos + ambientes + resumo
  const lastPgNum = String(totalPages).padStart(2, "0");

  // ── Drag/resize lifecycle ──
  useEffect(() => {
    instalarDragResize();
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("mouseup", onPointerUp);
    document.addEventListener("touchend", onPointerUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mouseup", onPointerUp);
      document.removeEventListener("touchend", onPointerUp);
    };
  }, [ambientes]);

  // ── Reaplicar drag/resize após render dos ambientes ──
  useEffect(() => {
    if (ambientes.length > 0) {
      const timer = setTimeout(instalarDragResize, 120);
      return () => clearTimeout(timer);
    }
  }, [ambientes]);

  return (
    <>

      {/* ═══════════════ TOOLBAR ═══════════════ */}
      <div className="toolbar">
        <div className="toolbar-left">
          <img className="toolbar-logo" src="/imagens-explan/Group.png" alt="Explan" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="toolbar-title">Editor de Orçamento</span>
        </div>
        <div className="toolbar-right">
          <button className="btn-toolbar btn-toolbar-green" onClick={() => window.print()}>Imprimir / Exportar</button>
          <a href="/painel" className="btn-toolbar btn-toolbar-light">← Voltar ao Painel</a>
        </div>
      </div>

      {/* ═══════════════ PÁGINA 1 — CAPA ═══════════════ */}
      <div className="page-wrapper">
        <div className="page-actions">
          <input type="file" id="capa-bg-file" accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) trocarFotoCapa(f); }} />
          <button className="page-action-btn" onClick={() => document.getElementById("capa-bg-file")?.click()}>Adicionar foto de fundo</button>
        </div>
        <div className="page page-cover">
          <img className="cover-bg" src="/imagens-ambientes/pdf-capa-generica.jpg" alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="cover-overlay"></div>
          <div className="cover-accent"></div>

          <div className="cover-content">
            <div className="cover-logo-wrap">
              <img src="/imagens-explan/logo-final.png" alt="Explan" style={{ height: 54, filter: "brightness(0) invert(1)", objectFit: "contain" }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              <div className="cover-logo-text" style={{ display: "none" }}>
                EXPLAN
                <span>Móveis Planejados</span>
              </div>
            </div>

            <div className="cover-center">
              <div className="cover-tag">
                <div className="cover-tag-bar"></div>
                <span className="cover-tag-text">Proposta Personalizada</span>
              </div>
              <div className="cover-heading">
                Orçamento<br /><em>sob medida</em>
              </div>
              <div className="cover-divider"></div>
              <div className="cover-client-label">Preparado para</div>
              <div className="cover-client-name">{nome}</div>
            </div>
          </div>

          <div className="cover-bottom">
            <div className="cover-bottom-info">
              Goiânia · GO &nbsp;·&nbsp; (62) 3945-7448 &nbsp;·&nbsp; {refFormatado} · Documento confidencial
            </div>
            <div>
              <div className="cover-validity-label">Válido até</div>
              <div className="cover-validity-date">{validade}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ PÁGINA 2 — QUEM SOMOS ═══════════════ */}
      <div className="page">
        <div className="pg-header">
          <img className="pg-header-logo" src="/imagens-explan/Explan.png" alt="Explan" />
          <div className="pg-header-right">
            <span className="pg-header-client">{nome}</span>
            <div className="pg-num">02</div>
          </div>
        </div>

        <div className="pg-body" style={{ padding: 0 }}>
          <div className="qs-hero">
            <img src="/imagens-explan/foto_institucional_legivel.png" alt="Showroom Explan" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            <div className="qs-hero-overlay"></div>
            <div className="qs-hero-content">
              <div className="section-label">Sobre nós</div>
              <div className="section-title">Quem <strong>Somos</strong></div>
            </div>
          </div>

          <div className="qs-body-pad">
            <div className="qs-text-colunas">
              <div>
                <p>A <strong>Explan Móveis Planejados</strong> é especializada em transformar ambientes com móveis sob medida de alta qualidade. Localizada em Goiânia, atendemos clientes que valorizam design, durabilidade e um processo de compra transparente — do primeiro atendimento até a instalação final.</p>
              </div>
              <div>
                <p>Nossa equipe de designers e marceneiros trabalha com materiais premium, tecnologia de projeto 3D e os melhores fornecedores de ferragens do mercado, garantindo um resultado que supera expectativas. Com showroom físico em Goiânia, você visualiza e toca nos materiais antes de decidir. Sem pressão. Do seu jeito.</p>
              </div>
            </div>

            <div className="difs-grid">
              <div className="dif-card">
                <div className="dif-icon-circle">🏠</div>
                <h4>Projeto 3D Incluído</h4>
                <p>Visualize seu ambiente antes da produção, com renderização fotorrealista sem custo adicional.</p>
              </div>
              <div className="dif-card">
                <div className="dif-icon-circle">🛡️</div>
                <h4>Garantia Estendida</h4>
                <p>5 anos de garantia contra defeitos de fabricação e montagem.</p>
              </div>
              <div className="dif-card">
                <div className="dif-icon-circle">✦</div>
                <h4>Materiais Premium</h4>
                <p>Chapas Duratex, ferragens Blum e Häfele, acabamentos certificados.</p>
              </div>
              <div className="dif-card">
                <div className="dif-icon-circle">📏</div>
                <h4>Medição Gratuita</h4>
                <p>Técnico vai até você para garantir que tudo se encaixe perfeitamente.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pg-footer">
          <span>Explan Móveis Planejados</span>
          <span>Explan Móveis Planejados</span>
          <div className="pg-footer-num">02</div>
        </div>
      </div>

      {/* ═══════════════ PÁGINAS DE AMBIENTE (dinâmicas) ═══════════════ */}
      {ambientes.map((amb, idx) => {
        const num = idx + 1;
        const numStr = String(num).padStart(2, "0");
        const pgNum = num + 2;
        const fotoUrl = fotoParaAmbiente(amb.nome);
        const { primeiraLinha, restante } = formatarNomeAmbiente(amb.nome);

        return (
          <div className="page-wrapper" key={amb.id}>
            <div className="page-actions">
              <input type="file" id={`file-orc-${idx}`} accept="image/*" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) trocarFotoOrc(f, idx); }} />
              <button className="page-action-btn" onClick={() => document.getElementById(`file-orc-${idx}`)?.click()}>Trocar imagem</button>
            </div>
            <div className="page">
              <div className="pg-header">
                <img className="pg-header-logo" src="/imagens-explan/Explan.png" alt="Explan" />
                <div className="pg-header-right">
                  <span className="pg-header-client">{nome}</span>
                  <div className="pg-num">{String(pgNum).padStart(2, "0")}</div>
                </div>
              </div>

              <div className="amb-page-body">
                <div className="amb-photo-col">
                  <img src={fotoUrl} alt={amb.nome} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="amb-photo-overlay"></div>
                  <div className="amb-photo-info">
                    <div className="amb-photo-num">Ambiente {numStr}</div>
                    <div className="amb-photo-name"><strong>{primeiraLinha}</strong> {restante}</div>
                  </div>
                </div>

                <div className="amb-items-col" data-num={numStr}>
                  <div className="amb-items-heading">Itens do Ambiente</div>
                  <table className="amb-table">
                    <thead>
                      <tr>
                        <th>Item</th><th>Un</th><th>Qtd</th><th style={{ textAlign: "right" }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(amb.itens || []).length === 0 ? (
                        <tr><td colSpan={4} style={{ color: "#aaa", fontStyle: "italic" }}>Nenhum item adicionado</td></tr>
                      ) : (
                        (amb.itens || []).map((it, iIdx) => (
                          <tr key={iIdx}>
                            <td><div style={{ fontWeight: 600 }}>{it.nome}</div>{it.descricao ? <div style={{ fontSize: 10, color: '#797979', lineHeight: 1.3, marginTop: 2 }}>{it.descricao}</div> : null}</td>
                            <td>{it.unidade}</td>
                            <td>{it.qtd}</td>
                            <td className="col-r">{fmtMoeda(it.subtotal)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  <div className="amb-subtotal">
                    <span>Subtotal {amb.nome.replace(/^[\p{Emoji}\s]+/u, "").trim().replace(/\s+(Planejad[ao]s?)$/i, "")}</span>
                    {fmtMoeda(amb.total || 0)}
                  </div>
                </div>
              </div>

              <div className="pg-footer">
                <span>Explan · {nome}</span>
                <span>Explan Móveis Planejados</span>
                <div className="pg-footer-num">{String(pgNum).padStart(2, "0")}</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* ═══════════════ PÁGINA RESUMO + PAGAMENTO ═══════════════ */}
      <div className="page">
        <div className="resumo-header">
          <div className="resumo-header-grid">
            <div className="resumo-header-left">
              <div className="tag">Proposta Comercial</div>
              <div className="title">Resumo &amp; Investimento</div>
            </div>
            <div className="resumo-header-total">
              <div className="label">Valor Total</div>
              <div className="valor">{fmtMoeda(total)}</div>
              <div className="desc">{descontoInfo.label !== "Nenhum" ? descontoInfo.label : "Preços cheios aplicados"}</div>
            </div>
          </div>
        </div>

        <div className="pg-body" style={{ paddingTop: 32 }}>
          <table className="resumo-table">
            <thead>
              <tr>
                <th>Ambiente</th>
                <th>Itens</th>
                <th style={{ textAlign: "right" }}>Valor</th>
              </tr>
            </thead>
            <tbody>
              {ambientes.map((amb) => {
                const nomeAmb = amb.nome.replace(/^[\p{Emoji}\s]+/u, "").trim().replace(/\s+(Planejad[ao]s?)$/i, "");
                return (
                  <tr key={amb.id}>
                    <td>{nomeAmb}</td>
                    <td>{(amb.itens || []).length} iten{(amb.itens || []).length !== 1 ? "s" : ""}</td>
                    <td className="col-r">{fmtMoeda(amb.total || 0)}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={2}>
                  Subtotal
                  <span className="badge-pill">{descontoInfo.pct > 0 ? `−${descontoInfo.pct}%` : ""}</span>
                </td>
                <td className="col-r">{fmtMoeda(total)}</td>
              </tr>
              {descontoInfo.pct > 0 && (
                <tr className="disc-row">
                  <td colSpan={2}>Desconto ferragem ({descontoInfo.pct}%)</td>
                  <td className="col-r">− {fmtMoeda(total * descontoInfo.pct / (100 - descontoInfo.pct))}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pag-title">Condições de Pagamento</div>
          <div className="pag-grid">
            <div className="pag-card">
              <div className="parcelas">À Vista</div>
              <div className="val">{pagamento.avista}</div>
              <div className="val-original" style={{ fontSize: 12, color: "rgba(235,230,221,.5)", textDecoration: "line-through", marginTop: -4 }}>{pagamento.total}</div>
              <div className="desc-text">7% de desconto<br />PIX ou transferência</div>
            </div>
            <div className="pag-card dest">
              <div className="parcelas">50/50</div>
              <div className="val">{pagamento.metade} (cada)</div>
              <div className="desc-text">50% assinatura<br />50% conclusão</div>
              <div className="hot">Mais comum</div>
            </div>
            <div className="pag-card">
              <div className="parcelas">10×</div>
              <div className="val">{pagamento.cartao}/mês</div>
              <div className="desc-text">Cartão de crédito<br />sem juros</div>
            </div>
          </div>

          <div className="pag-extras" style={{ marginTop: 14, fontSize: 11, color: "#4A4A4A", lineHeight: 1.8 }}>
            <div style={{ background: "#F5F2ED", border: "1px solid #CCD6DF", borderRadius: 8, padding: "14px 18px" }}>
              <strong style={{ color: "#41422F" }}>Opção 1 — 50/50</strong><br />
              50% na assinatura do contrato ({pagamento.metade}) e 50% na conclusão ({pagamento.metade})
            </div>
            <div style={{ background: "#F5F2ED", border: "1px solid #CCD6DF", borderRadius: 8, padding: "14px 18px", marginTop: 8 }}>
              <strong style={{ color: "#41422F" }}>Opção 2 — 60/40</strong><br />
              60% de entrada ({pagamento.entrada60}) + saldo de 40% em 4 boletos mensais de {pagamento.boleto}
            </div>
            <div style={{ textAlign: "right", marginTop: 8, fontWeight: 700, color: "#41422F", fontSize: 13 }}>
              💰 Valor total da proposta: {pagamento.total}
            </div>
          </div>

          <div className="prazo-timeline">
            <div className="prazo-item">
              <div className="pl">Produção</div>
              <div className="pv">{prazo.replace("úteis", "").trim()}</div>
            </div>
            <div className="prazo-item">
              <div className="pl">Instalação</div>
              <div className="pv">{instalacao}</div>
            </div>
            <div className="prazo-item">
              <div className="pl">Validade</div>
              <div className="pv">30 dias</div>
            </div>
          </div>
        </div>

        <div className="pg-footer">
          <span>Explan Móveis Planejados · {nome}</span>
          <span>Explan Móveis Planejados</span>
          <div className="pg-footer-num">{lastPgNum}</div>
        </div>
      </div>

      {/* ═══════════════ CSS ═══════════════ */}
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #2D2D2D; font-family: 'Archivo', Arial, sans-serif; padding-top: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        @media (max-width: 840px) {
          body { overflow-x: auto; }
          .page { width: 794px; }
          .toolbar { flex-wrap: wrap; gap: 10px; padding: 12px 16px; }
          .toolbar-right { flex-wrap: wrap; }
        }

        .toolbar {
          background: #41422F;
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          margin-bottom: 40px;
        }
        .toolbar-left { display: flex; align-items: center; gap: 16px; }
        .toolbar-logo { height: 28px; filter: brightness(0) invert(1); }
        .toolbar-title { color: #EBE6DD; font-size: 15px; font-weight: 500; letter-spacing: .04em; }
        .toolbar-right { display: flex; gap: 10px; align-items: center; }
        .btn-toolbar { display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:50px;font-family:'Archivo',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .2s; }
        .btn-toolbar-green { background:#6B8E5E;color:#fff; }
        .btn-toolbar-green:hover { background:#4d6944; }
        .btn-toolbar-light { background:rgba(255,255,255,.15);color:#EBE6DD;border:1px solid rgba(255,255,255,.2); }
        .btn-toolbar-light:hover { background:rgba(255,255,255,.25); }

        /* PÁGINA A4 */
        .page {
          width: 794px; height: 1123px;
          background: #fff; margin: 0 auto 10px;
          position: relative; overflow: hidden;
          box-shadow: 0 8px 48px rgba(0,0,0,.5);
          display: flex; flex-direction: column;
        }

        /* ═══ CAPA ═══ */
        .page-cover { background: #41422F; }
        .cover-bg {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; opacity: .55;
          mix-blend-mode: luminosity;
        }
        .cover-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(65,66,47,.62) 0%, rgba(20,21,14,.78) 100%);
        }
        .cover-content {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          height: 100%; padding: 52px 64px 0;
        }
        .cover-accent {
          position: absolute; z-index: 3;
          top: 0; right: 64px;
          width: 4px; height: 80px;
          background: linear-gradient(to bottom, #6B8E5E, transparent);
        }
        .cover-logo-wrap { display: flex; align-items: center; gap: 14px; margin-bottom: auto; }
        .cover-logo-text {
          font-size: 28px; font-weight: 800; color: #EBE6DD;
          letter-spacing: .16em; text-transform: uppercase; line-height: 1;
        }
        .cover-logo-text span {
          display: block; font-size: 11px; font-weight: 300;
          letter-spacing: .28em; opacity: .55; margin-top: 5px;
        }
        .cover-center { flex: 1; display: flex; flex-direction: column; justify-content: center; padding-bottom: 60px; }
        .cover-tag {
          display: inline-flex; align-items: center; gap: 10px;
          margin-bottom: 28px;
        }
        .cover-tag-bar { width: 4px; height: 18px; background: #6B8E5E; border-radius: 2px; }
        .cover-tag-text {
          font-size: 11px; font-weight: 700; letter-spacing: .18em;
          text-transform: uppercase; color: #6B8E5E;
        }
        .cover-heading {
          font-family: 'Archivo', sans-serif;
          font-size: 42px; font-weight: 400; color: #EBE6DD;
          line-height: 1.15; letter-spacing: .01em;
          margin-bottom: 8px;
        }
        .cover-heading em { font-style: italic; color: rgba(235,230,221,.65); }
        .cover-divider {
          width: 64px; height: 2px;
          background: linear-gradient(to right, #6B8E5E, transparent);
          margin: 28px 0;
        }
        .cover-client-label {
          font-size: 10px; font-weight: 700; letter-spacing: .18em;
          text-transform: uppercase; color: rgba(235,230,221,.45);
          margin-bottom: 8px;
        }
        .cover-client-name {
          font-size: 26px; font-weight: 700; color: #EBE6DD;
          letter-spacing: .03em;
        }
        .cover-bottom {
          position: relative; z-index: 2;
          border-top: 1px solid rgba(235,230,221,.12);
          padding: 20px 64px;
          display: flex; justify-content: space-between; align-items: center;
          background: rgba(0,0,0,.25);
          backdrop-filter: blur(4px);
        }
        .cover-bottom-info { font-size: 11px; color: rgba(235,230,221,.45); line-height: 1.9; }
        .cover-validity-label { font-size: 10px; color: rgba(235,230,221,.4); text-align: right; letter-spacing: .06em; text-transform: uppercase; }
        .cover-validity-date { font-size: 17px; font-weight: 600; color: #EBE6DD; text-align: right; margin-top: 3px; }
        .pg-footer-cover {
          position: absolute; z-index: 3; bottom: 0; left: 0; right: 0;
          padding: 0 64px 12px;
          display: flex; justify-content: space-between;
          font-size: 9px; color: rgba(235,230,221,.25);
        }
        .pg-footer-cover a { color: rgba(235,230,221,.35); text-decoration: none; font-weight: 600; }

        /* ═══ HEADER PADRÃO ═══ */
        .pg-header {
          background: #41422F;
          padding: 20px 56px;
          display: flex; justify-content: space-between; align-items: center;
          position: relative; overflow: hidden;
          flex-shrink: 0;
        }
        .pg-header::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(to right, #6B8E5E, transparent 60%);
        }
        .pg-header-logo { height: 24px; object-fit: contain; }
        .pg-header-right { display: flex; align-items: center; gap: 16px; }
        .pg-header-client { font-size: 11px; color: rgba(235,230,221,.5); }
        .pg-num {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(235,230,221,.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #EBE6DD;
        }

        /* ═══ BODY PADRÃO ═══ */
        .pg-body { flex: 1; padding: 44px 56px; position: relative; overflow: hidden; }
        .pg-body::before {
          content: 'EXPLAN';
          position: absolute; bottom: 40px; right: -30px;
          font-size: 140px; font-weight: 800; color: rgba(65,66,47,.03);
          letter-spacing: .1em; text-transform: uppercase;
          transform: rotate(-8deg); pointer-events: none; user-select: none;
        }
        .section-label {
          font-size: 10px; font-weight: 700; letter-spacing: .14em;
          text-transform: uppercase; color: #6B8E5E; margin-bottom: 5px;
        }
        .section-title {
          font-family: 'Archivo', sans-serif;
          font-size: 30px; font-weight: 400; color: #41422F; line-height: 1.2;
          margin-bottom: 24px;
        }
        .section-title strong { font-weight: 700; }
        .section-accent {
          width: 4px; background: linear-gradient(to bottom, #6B8E5E, transparent);
          position: absolute; top: 44px; left: 0; height: 64px; border-radius: 0 2px 2px 0;
        }

        /* ═══ PÁGINA QUEM SOMOS ═══ */
        .qs-hero {
          position: relative; width: 100%; height: 290px;
          overflow: hidden;
        }
        .qs-hero img {
          width: 100%; height: 100%; object-fit: cover;
          filter: brightness(.85);
        }
        .qs-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(65,66,47,.88) 0%, rgba(65,66,47,.35) 55%, rgba(65,66,47,.06) 100%);
        }
        .qs-hero-content {
          position: absolute; bottom: 32px; left: 0; right: 0;
          padding: 0 56px;
        }
        .qs-hero-content .section-label {
          display: inline-flex; align-items: center; gap: 10px;
          color: #6B8E5E; margin-bottom: 6px;
        }
        .qs-hero-content .section-label::before {
          content: ''; width: 32px; height: 2px;
          background: #6B8E5E; border-radius: 1px;
        }
        .qs-hero-content .section-title {
          color: #EBE6DD; margin-bottom: 0;
          font-size: 34px;
        }
        .qs-hero-content .section-title strong { color: #fff; }
        .qs-body-pad { padding: 32px 56px 0; }
        .qs-text-colunas {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 36px; margin-bottom: 30px;
        }
        .qs-text-colunas p {
          font-size: 13px; line-height: 2.0; color: #4A4A4A;
        }
        .difs-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .dif-card {
          background: #F5F2ED;
          border: 1px solid #EBE6DD;
          border-radius: 6px;
          padding: 24px 16px 20px;
          text-align: center;
          position: relative; overflow: hidden;
        }
        .dif-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: #6B8E5E;
        }
        .dif-icon-circle {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: #EBE6DD;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          font-size: 20px;
        }
        .dif-card h4 {
          font-size: 13px; font-weight: 700; color: #41422F;
          margin-bottom: 6px; letter-spacing: .02em;
        }
        .dif-card p {
          font-size: 11px; color: #6B6B6B; line-height: 1.6;
        }

        /* ═══ PÁGINA AMBIENTE — layout split ═══ */
        .amb-page-body {
          flex: 1; display: grid; grid-template-columns: 53% 47%;
          position: relative;
        }
        .amb-photo-col {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #41422F 0%, #6b6c52 100%);
        }
        .amb-photo-col img {
          position: absolute; opacity: .9;
          cursor: move; user-select: none; touch-action: none;
        }
        .amb-photo-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(65,66,47,.1) 0%, rgba(65,66,47,.6) 100%);
          pointer-events: none;
        }
        .amb-photo-info {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px 28px;
          background: linear-gradient(to top, rgba(20,21,14,.85) 0%, transparent 100%);
        }
        .amb-photo-num {
          font-size: 10px; font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase; color: #6B8E5E; margin-bottom: 4px;
        }
        .amb-photo-name {
          font-family: 'Archivo', sans-serif;
          font-size: 24px; font-weight: 400; color: #EBE6DD; line-height: 1.2;
        }
        .amb-photo-name strong { font-weight: 700; }
        .amb-items-col {
          padding: 36px 36px 36px 32px;
          display: flex; flex-direction: column;
          border-left: 4px solid #6B8E5E;
          position: relative; overflow: hidden;
        }
        .amb-items-col::before {
          content: attr(data-num);
          position: absolute; bottom: -20px; right: -10px;
          font-size: 140px; font-weight: 900; color: rgba(65,66,47,.04);
          line-height: 1; pointer-events: none;
        }
        .amb-items-heading {
          font-size: 10px; font-weight: 700; letter-spacing: .12em;
          text-transform: uppercase; color: #41422F; margin-bottom: 14px;
          padding-bottom: 8px; border-bottom: 1.5px solid #41422F;
        }
        .amb-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .amb-table th {
          text-align: left; color: #797979; font-weight: 700;
          font-size: 9px; text-transform: uppercase; letter-spacing: .08em;
          padding: 7px 0; border-bottom: 1px solid #EBE6DD;
        }
        .amb-table td { padding: 8px 0; border-bottom: 1px solid #EBE6DD; color: #212121; }
        .amb-table tr:last-child td { border-bottom: none; }
        .amb-table .col-r { text-align: right; font-weight: 700; color: #41422F; }
        .amb-subtotal {
          margin-top: auto; padding-top: 14px;
          border-top: 1.5px solid #41422F;
          text-align: right;
          font-size: 13px; font-weight: 700; color: #41422F;
        }
        .amb-subtotal span { font-size: 10px; font-weight: 400; color: #797979; margin-right: 6px; }

        /* ═══ RESUMO ═══ */
        .resumo-header {
          background: #41422F; padding: 36px 56px;
          position: relative; overflow: hidden; flex-shrink: 0;
        }
        .resumo-header::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; background: linear-gradient(to right, #6B8E5E, transparent 50%);
        }
        .resumo-header-grid { display: flex; justify-content: space-between; align-items: flex-end; }
        .resumo-header-left .tag { font-size: 10px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: rgba(235,230,221,.45); margin-bottom: 6px; }
        .resumo-header-left .title { font-family: 'Archivo', sans-serif; font-size: 26px; color: #EBE6DD; font-weight: 400; }
        .resumo-header-total .label { font-size: 10px; color: rgba(235,230,221,.5); text-align: right; letter-spacing: .08em; text-transform: uppercase; margin-bottom: 4px; }
        .resumo-header-total .valor { font-family: 'Archivo', sans-serif; font-size: 38px; font-weight: 700; color: #EBE6DD; line-height: 1; }
        .resumo-header-total .desc { font-size: 11px; color: rgba(107,142,94,.9); text-align: right; margin-top: 4px; }

        .resumo-table { width: 100%; border-collapse: collapse; }
        .resumo-table th { background: #f5f2ed; color: #41422F; padding: 10px 16px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
        .resumo-table td { padding: 11px 16px; border-bottom: 1px solid #EBE6DD; font-size: 13px; }
        .resumo-table tr:nth-child(even) td { background: #faf8f5; }
        .resumo-table .col-r { text-align: right; font-weight: 700; }
        .resumo-table .disc-row td { color: #6B8E5E; }
        .badge-pill { display: inline-block; background: #EBE6DD; color: #41422F; font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 20px; margin-left: 6px; }

        /* pagamento */
        .pag-title { font-size: 14px; font-weight: 600; color: #41422F; margin: 28px 0 14px; letter-spacing: .02em; }
        .pag-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
        .pag-card {
          border: 1.5px solid #CCD6DF; border-radius: 8px; padding: 18px;
          text-align: center; position: relative;
        }
        .pag-card.dest {
          border: 2px solid #41422F;
          background: linear-gradient(135deg, #f5f2ed 0%, #ebe6dd 100%);
        }
        .pag-card .parcelas { font-family: 'Archivo', sans-serif; font-size: 24px; font-weight: 700; color: #41422F; }
        .pag-card .val { font-size: 13px; color: #212121; margin: 5px 0; }
        .pag-card .desc-text { font-size: 10px; color: #797979; line-height: 1.6; }
        .pag-card .hot { display:inline-block; background:#6B8E5E; color:#fff; font-size:9px; font-weight:700; padding:2px 10px; border-radius:20px; margin-top:8px; }

        /* timeline prazo */
        .prazo-timeline {
          display: grid; grid-template-columns: repeat(3,1fr);
          gap: 0; margin-top: 20px;
          background: #41422F; border-radius: 8px; overflow: hidden;
        }
        .prazo-item {
          padding: 18px 20px; text-align: center;
          position: relative;
        }
        .prazo-item:not(:last-child)::after {
          content: '→';
          position: absolute; right: -2px; top: 50%; transform: translateY(-50%);
          color: rgba(235,230,221,.3); font-size: 16px;
        }
        .prazo-item .pl { font-size: 9px; color: rgba(235,230,221,.45); text-transform: uppercase; letter-spacing: .1em; margin-bottom: 5px; }
        .prazo-item .pv { font-size: 18px; font-weight: 700; color: #EBE6DD; }

        /* ═══ FOOTER ═══ */
        .pg-footer {
          padding: 12px 56px; border-top: 1px solid #EBE6DD;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 9px; color: #797979; flex-shrink: 0;
        }
        .pg-footer a { color: #41422F; font-weight: 600; text-decoration: none; }
        .pg-footer-num {
          width: 22px; height: 22px; background: #41422F; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 9px; font-weight: 700; color: #EBE6DD;
        }

        /* ── DRAG / RESIZE handles ── */
        .amb-photo-col img {
          cursor: move;
          user-select: none;
          touch-action: none;
        }
        .orc-resize-handle {
          position: absolute;
          width: 14px; height: 14px;
          background: #6B8E5E;
          border: 2px solid #fff;
          border-radius: 3px;
          z-index: 20;
          touch-action: none;
        }
        .orc-resize-handle.nw { cursor: nw-resize; }
        .orc-resize-handle.ne { cursor: ne-resize; }
        .orc-resize-handle.sw { cursor: sw-resize; }
        .orc-resize-handle.se { cursor: se-resize; }

        /* ── Botão trocar foto ── */
        .page-wrapper { position: relative; width: 794px; margin: 0 auto 32px; }
        .page-actions { display: flex; gap: 8px; justify-content: flex-end; margin-bottom: 8px; }
        .page-action-btn {
          background: rgba(255,255,255,.1);
          border: 1px solid rgba(255,255,255,.15);
          color: rgba(255,255,255,.6);
          font-size: 11px;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Archivo', sans-serif;
          transition: all .15s;
        }

        @media print {
          .toolbar, .page-actions { display: none !important; }
          .page { box-shadow: none !important; page-break-after: always; }
          .page:last-child { page-break-after: avoid; }
        }
      `}</style>
    </>
  );
}
