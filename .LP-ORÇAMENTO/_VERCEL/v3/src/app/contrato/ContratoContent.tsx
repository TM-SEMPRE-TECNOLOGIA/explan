"use client";

import { useEffect, useState, useMemo } from "react";

/* ────────────────────────────────────────────
   valorExtenso — convert number to Portuguese words
   ──────────────────────────────────────────── */
function valorExtenso(n: number): string {
  if (!n) return "zero reais";
  const inteiro = Math.floor(n);
  const centavos = Math.round((n - inteiro) * 100);
  const un = [
    "", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove",
    "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete",
    "dezoito", "dezenove",
  ];
  const dez = [
    "", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta",
    "oitenta", "noventa",
  ];
  function grupo(n: number): string {
    if (n === 0) return "";
    if (n < 20) return un[n];
    if (n < 100)
      return dez[Math.floor(n / 10)] + (n % 10 ? " e " + un[n % 10] : "");
    const c = Math.floor(n / 100);
    const r = n % 100;
    const cent = [
      "", "cem", "duzentos", "trezentos", "quatrocentos", "quinhentos",
      "seiscentos", "setecentos", "oitocentos", "novecentos",
    ];
    if (r === 0) return cent[c];
    return (c === 1 ? "cento" : cent[c]) + " e " + grupo(r);
  }
  const mil = Math.floor(inteiro / 1000);
  const res = inteiro % 1000;
  let txt = "";
  if (mil > 0)
    txt += (mil === 1 ? "um mil" : grupo(mil) + " mil") + (res > 0 ? " e " : "");
  if (res > 0) txt += grupo(res);
  txt += inteiro === 1 ? " real" : " reais";
  if (centavos > 0)
    txt += " e " + grupo(centavos) + (centavos === 1 ? " centavo" : " centavos");
  return txt;
}

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */
const fmtMoeda = (v: number) =>
  "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

const hoje = new Date();
const dataStr = hoje.toLocaleDateString("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

/* ────────────────────────────────────────────
   Cláusula ordinal names for renumbering
   ──────────────────────────────────────────── */
const CLAUSULA_TITLES: Record<number, string> = {
  4: "Quarta",
  5: "Quinta",
  6: "Sexta",
  7: "Sétima",
  8: "Oitava",
  9: "Nona",
  10: "Décima",
  11: "Décima Primeira",
  12: "Décima Segunda",
  13: "Décima Terceira",
};

/* ────────────────────────────────────────────
   Main Page Component
   ──────────────────────────────────────────── */
export default function ContratoContent() {
  const [loaded, setLoaded] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [logoContError, setLogoContError] = useState(false);

  // Read from Zustand-persisted localStorage
  const [c, setC] = useState<Record<string, string>>({});
  const [d, setD] = useState<any>({});

  useEffect(() => {
    const raw = localStorage.getItem("explan-v3-orcamento");
    if (raw) {
      const parsed = JSON.parse(raw);
      const state = parsed.state || {};
      setC(state.cliente || {});
      setD(state);
    }
    setLoaded(true);
  }, []);

  /* ── Derived values ── */
  const totalGeral = useMemo(() => {
    if (!d.ambientes) return 0;
    return d.ambientes.reduce((t: number, a: any) => t + (a.total || 0), 0);
  }, [d.ambientes]);

  const pagto = useMemo(() => {
    const t = totalGeral;
    const fmt = fmtMoeda;
    return {
      avista: fmt(t * 0.93),
      metade: fmt(t / 2),
      cartao: fmt(Math.ceil(t / 6)),
      entrada60: fmt(t * 0.6),
      boleto: fmt((t * 0.4) / 4),
      total: fmt(t),
    };
  }, [totalGeral]);

  const pgtoDetalhado = useMemo(
    () =>
      `💰 Valor total: ${pagto.total}\n` +
      `💳 Cartão: 6× de ${pagto.cartao} sem juros\n` +
      `🟢 À vista: ${pagto.avista} (7% de desconto)\n` +
      `📝 Opção 1: 50% assinatura (${pagto.metade}) + 50% conclusão (${pagto.metade})\n` +
      `📝 Opção 2: 60% entrada (${pagto.entrada60}) + 4 boletos de ${pagto.boleto}`,
    [pagto],
  );

  const ambientesHtml = useMemo(() => {
    if (!d.ambientes) return "—";
    return d.ambientes
      .map((a: any) => {
        const nome = (a.nome || "").replace(/^[\p{Emoji}\s]+/u, "").trim();
        return `${nome} — ${fmtMoeda(a.total || 0)}`;
      })
      .join("\n");
  }, [d.ambientes]);

  const materiaisList = useMemo(() => {
    const mats: string[] = [];
    const primeiro = d.ambientes?.[0];
    if (primeiro?.materiais?.chapa === "15") mats.push("Chapa MDF 15mm");
    else mats.push("Chapa MDF 18mm");
    if (primeiro?.materiais?.ferragem === "blum") mats.push("Ferragem Blum");
    else if (primeiro?.materiais?.ferragem === "hafele") mats.push("Ferragem Häfele");
    else if (primeiro?.materiais?.ferragem === "fgv") mats.push("Ferragem FGV");
    if (primeiro?.materiais?.cor === "branco") mats.push("Interior branco");
    return mats.join(", ");
  }, [d.ambientes]);

  const temResponsavel = !!(c.responsavelNome && c.responsavelNome.trim() !== "");

  /* ── Cláusula number offset when no responsável ── */
  const clNum = (original: number) => (temResponsavel ? original : original - 1);

  /* ── Render helpers ── */
  const clausulaTitulo = (num: number, titulo: string) => {
    const n = clNum(num);
    return (
      <div className="clausula-titulo">
        <span className="clausula-num">{n}</span>
        Cláusula {CLAUSULA_TITLES[n] || ""} — {titulo}
      </div>
    );
  };

  const val = (v: any) => (v ? String(v) : "—");

  /* ── Header continuacao ── */
  const headerCont = (
    <div className="header-cont" style={{ background: "var(--oliva, #41422F)", padding: "14px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 56 }}>
      <img
        className="header-cont-logo"
        src="/imagens-explan/logo-final.png"
        alt="Explan"
        style={{ height: 28, filter: "brightness(0) invert(1)" }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
      <span className="header-cont-info" style={{ color: "rgba(235,230,221,0.65)", fontSize: 10, fontWeight: 300 }}>
        Contrato —{" "}
        <span style={{ color: "rgba(235,230,221,0.5)" }}>
          {val(c.nome)}
        </span>
      </span>
    </div>
  );

  return (
    <>
      {/* ═══════════════ TOOLBAR ═══════════════ */}
      <div className="contrato-toolbar">
        <div className="contrato-toolbar-left">
          <img className="toolbar-logo" src="/imagens-explan/Group.png" alt="Explan" style={{ height: 24 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <span className="contrato-toolbar-title">Contrato</span>
        </div>
        <div className="contrato-toolbar-right">
          <button className="btn-toolbar btn-toolbar-green" onClick={() => window.print()}>🖨️ Imprimir / Exportar PDF</button>
          <a href="/painel" className="btn-toolbar btn-toolbar-light">← Voltar ao Painel</a>
        </div>
      </div>

      <style jsx>{`
        /* ── TOOLBAR ── */
        .contrato-toolbar {
          background: #41422f;
          padding: 14px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          max-width: 100%;
        }
        .contrato-toolbar-left { display: flex; align-items: center; gap: 14px; }
        .contrato-toolbar-title { color: #ebe6dd; font-weight: 600; font-size: 15px; }
        .contrato-toolbar-right { display: flex; gap: 10px; }
        .btn-toolbar {
          padding: 9px 18px; border-radius: 8px; border: none;
          font-family: 'Archivo', sans-serif; font-size: 12px; font-weight: 600;
          cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
        }
        .btn-toolbar-green { background: #6b8e5e; color: #fff; }
        .btn-toolbar-green:hover { background: #4d6944; }
        .btn-toolbar-light { background: rgba(255,255,255,.12); color: #ebe6dd; }
        .btn-toolbar-light:hover { background: rgba(255,255,255,.2); }

        @media print {
          .contrato-toolbar { display: none !important; }
          .contrato-wrapper { background: white !important; padding: 0 !important; min-height: auto !important; }
          .page { box-shadow: none !important; margin: 0 !important; page-break-after: always; width: 100% !important; min-height: 100vh !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page:last-child { page-break-after: avoid; }
          .header, .header-cont, .cliente-banner, .valor-destaque, .clausula-num { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }

        @page { size: A4 portrait; margin: 0; }
      `}</style>

      <style jsx>{`
        /* ── RESET & BASE ── */
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .contrato-wrapper {
          font-family: "Archivo", sans-serif;
          background: #c8c3b8;
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          color: #212121;
          min-height: 100vh;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .page {
          width: 794px;
          min-height: 1122px;
          background: #ffffff;
          padding: 0;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.22);
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .page + .page {
          margin-top: 32px;
        }

        .header {
          background: #41422f;
          padding: 24px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-logo {
          height: 40px;
          filter: brightness(0) invert(1);
        }
        .header-logo-fallback {
          color: #fff;
          font-weight: 800;
          font-size: 18px;
          letter-spacing: 0.2em;
        }
        .header-title-block {
          text-align: right;
        }
        .header-doc-type {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(235, 230, 221, 0.6);
          margin-bottom: 4px;
        }
        .header-doc-name {
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .cliente-banner {
          background: #ebe6dd;
          padding: 16px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #ccd6df;
        }
        .cliente-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cliente-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #cc3366;
        }
        .cliente-nome {
          font-size: 16px;
          font-weight: 700;
          color: #41422f;
        }
        .cliente-meta {
          font-size: 11px;
          color: #666;
          font-weight: 300;
        }
        .contrato-meta {
          text-align: right;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .contrato-num {
          font-size: 11px;
          font-weight: 600;
          color: #41422f;
        }
        .contrato-data {
          font-size: 10px;
          color: #666;
          font-weight: 300;
        }

        .content {
          flex: 1;
          padding: 36px 48px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .partes-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
        }
        .parte-box {
          border: 1px solid #ccd6df;
          border-radius: 3px;
          overflow: hidden;
        }
        .parte-header {
          background: #ebe6dd;
          padding: 7px 14px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #41422f;
          border-bottom: 1px solid #ccd6df;
        }
        .parte-body {
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .parte-row {
          display: flex;
          gap: 6px;
          font-size: 10.5px;
        }
        .parte-field {
          font-weight: 600;
          color: #41422f;
          flex-shrink: 0;
          min-width: 80px;
        }
        .parte-value {
          color: #212121;
          font-weight: 400;
        }
        .filled-data {
          font-weight: 700;
          color: #212121;
        }

        .clausula {
          margin-bottom: 20px;
        }
        .clausula-titulo {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #41422f;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1.5px solid #41422f;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .clausula-num {
          background: #41422f;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .clausula-body {
          font-size: 11px;
          color: #212121;
          line-height: 1.8;
          font-weight: 400;
        }
        .clausula-body p + p {
          margin-top: 6px;
        }
        .clausula-body strong {
          font-weight: 700;
          color: #41422f;
        }

        .ambientes-list {
          margin: 10px 0;
          border: 1px solid #ccd6df;
          border-radius: 3px;
          overflow: hidden;
        }
        .ambientes-list-header {
          background: #ebe6dd;
          padding: 6px 16px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #41422f;
          border-bottom: 1px solid #ccd6df;
          display: grid;
          grid-template-columns: 1fr auto;
        }
        .ambiente-item {
          padding: 8px 16px;
          display: grid;
          grid-template-columns: 1fr auto;
          font-size: 11px;
          border-bottom: 1px solid #ccd6df;
        }
        .ambiente-item:last-child {
          border-bottom: none;
        }
        .ambiente-item:nth-child(even) {
          background: rgba(235, 230, 221, 0.35);
        }
        .ambiente-item-nome {
          font-weight: 400;
          color: #212121;
        }
        .ambiente-item-val {
          font-weight: 600;
          color: #41422f;
        }

        .valor-destaque {
          background: #41422f;
          border-radius: 3px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 12px 0;
        }
        .valor-destaque-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(235, 230, 221, 0.65);
        }
        .valor-destaque-num {
          font-size: 24px;
          font-weight: 800;
          color: #ebe6dd;
        }
        .valor-extenso {
          font-size: 10.5px;
          font-style: italic;
          color: rgba(235, 230, 221, 0.7);
          font-weight: 300;
        }

        .pagamento-bloco {
          background: rgba(65, 66, 47, 0.04);
          border-left: 3px solid #41422f;
          border-radius: 0 3px 3px 0;
          padding: 12px 16px;
          margin: 10px 0;
          font-size: 11px;
          line-height: 1.7;
          font-weight: 400;
          white-space: pre-line;
        }

        .assinaturas-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #ccd6df;
          page-break-inside: avoid;
        }
        .ass-local-data {
          font-size: 11px;
          color: #666;
          font-weight: 400;
          margin-bottom: 36px;
          text-align: center;
        }
        .ass-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          margin-bottom: 24px;
        }
        .ass-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ass-linha {
          border-bottom: 1.5px solid #212121;
          height: 50px;
          position: relative;
        }
        .ass-nome {
          font-size: 11px;
          font-weight: 600;
          color: #41422f;
          margin-top: 6px;
        }
        .ass-qualif {
          font-size: 10px;
          color: #666;
          font-weight: 400;
        }
        .ass-cpf {
          font-size: 10px;
          color: #666;
          font-weight: 400;
          margin-top: 2px;
        }

        .ass-testemunhas {
          margin-top: 24px;
        }
        .ass-testemunhas-label {
          font-size: 11px;
          font-weight: 700;
          color: #41422f;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 16px;
          text-align: center;
        }
        .ass-tess-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }

        .footer {
          background: #ebe6dd;
          border-top: 1px solid #ccd6df;
          padding: 10px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-left {
          font-size: 9px;
          color: #666;
          font-weight: 400;
        }
        .footer-right {
          font-size: 9px;
          color: #aaa;
          font-weight: 400;
        }
        .page-num {
          position: absolute;
          bottom: 44px;
          right: 48px;
          font-size: 9px;
          color: #666;
          font-weight: 400;
        }

        .header-cont {
          background: #41422f;
          padding: 14px 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .header-cont-logo {
          height: 28px;
          filter: brightness(0) invert(1);
        }
        .header-cont-info {
          font-size: 10px;
          color: rgba(235, 230, 221, 0.65);
          font-weight: 300;
        }

        .lista-alfabetica {
          padding-left: 20px;
          list-style-type: lower-alpha;
        }
        .lista-alfabetica li {
          margin-bottom: 4px;
        }
      `}</style>

      <div className="contrato-wrapper">
        {/* ══════════════ PAGE 1 ══════════════ */}
        <div className="page">
          <div className="header">
            {logoError ? (
              <span className="header-logo-fallback">EXPLAN</span>
            ) : (
              <img
                className="header-logo"
                src="/imagens-explan/logo-final.png"
                alt="Explan"
                onError={() => setLogoError(true)}
              />
            )}
            <div className="header-title-block">
              <p className="header-doc-type">Documento oficial</p>
              <p className="header-doc-name">Contrato de Prestação de Serviços</p>
            </div>
          </div>

          <div className="cliente-banner">
            <div className="cliente-info">
              <p className="cliente-label">Contratante</p>
              <p className="cliente-nome">
                <span className="filled-data">{val(c.nome)}</span>
              </p>
              <p className="cliente-meta">
                CPF/CNPJ: <span className="filled-data">{val(c.cpf)}</span>{" "}
                &nbsp;|&nbsp;{" "}
                <span className="filled-data">{val(c.email)}</span>
              </p>
            </div>
            <div className="contrato-meta">
              <p className="contrato-num">
                Contrato nº {val(d.projetosSalvos?.[d.projetosSalvos.length - 1]?.ref || "—")}
              </p>
              <p className="contrato-data">
                <span className="filled-data">Goiânia</span>,{" "}
                <span className="filled-data">{dataStr}</span>
              </p>
            </div>
          </div>

          <div className="content">
            {/* Partes */}
            <div className="partes-section">
              <div className="parte-box">
                <div className="parte-header">Contratante</div>
                <div className="parte-body">
                  <div className="parte-row">
                    <span className="parte-field">Nome:</span>
                    <span className="parte-value filled-data">{val(c.nome)}</span>
                  </div>
                  <div className="parte-row">
                    <span className="parte-field">CPF/CNPJ:</span>
                    <span className="parte-value filled-data">{val(c.cpf)}</span>
                  </div>
                  <div className="parte-row">
                    <span className="parte-field">Telefone:</span>
                    <span className="parte-value filled-data">{val(c.whatsapp)}</span>
                  </div>
                  <div className="parte-row">
                    <span className="parte-field">E-mail:</span>
                    <span className="parte-value filled-data">{val(c.email)}</span>
                  </div>
                  <div className="parte-row">
                    <span className="parte-field">End. Obra:</span>
                    <span className="parte-value filled-data">
                      {val(c.endereco || c.observacoes)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="parte-box">
                <div className="parte-header">Contratada</div>
                <div className="parte-body">
                  <div className="parte-row">
                    <span className="parte-field">Razão Social:</span>
                    <span className="parte-value">Explan Engenharia e Serviços Ltda.</span>
                  </div>
                  <div className="parte-row">
                    <span className="parte-field">CNPJ:</span>
                    <span className="parte-value">55.708.752/0001-01</span>
                  </div>
                  <div className="parte-row">
                    <span className="parte-field">Endereço:</span>
                    <span className="parte-value">
                      Rua da Passagem, Qd 06, Lt 17, Nº 43, Esplanada dos Anicuns, Goiânia/GO
                    </span>
                  </div>
                  <div className="parte-row">
                    <span className="parte-field">CEP:</span>
                    <span className="parte-value">74.433-130</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CLÁUSULA 1 */}
            <div className="clausula">
              <div className="clausula-titulo">
                <span className="clausula-num">1</span>Cláusula Primeira — Do Objeto
              </div>
              <div className="clausula-body">
                <p>
                  O presente contrato tem como OBJETO a venda de móveis sob medida,
                  fabricados e/ou revendidos pela CONTRATADA, que serão devidamente
                  montados e instalados pela CONTRATADA no endereço indicado pelo
                  CONTRATANTE, de forma e acordo com os projetos apresentados e
                  aprovados pelo CONTRATANTE.
                </p>
                <div className="ambientes-list">
                  <div className="ambientes-list-header">
                    <span>Ambiente</span>
                    <span>Valor</span>
                  </div>
                  {d.ambientes?.map((a: any) => {
                    const nome = (a.nome || "")
                      .replace(/^[\p{Emoji}\s]+/u, "")
                      .trim();
                    return (
                      <div className="ambiente-item" key={a.id}>
                        <span className="ambiente-item-nome">
                          <span className="filled-data">{nome}</span>
                        </span>
                        <span className="ambiente-item-val">
                          {fmtMoeda(a.total || 0)}
                        </span>
                      </div>
                    );
                  }) || (
                    <div className="ambiente-item">
                      <span className="ambiente-item-nome">
                        <span className="filled-data">—</span>
                      </span>
                      <span className="ambiente-item-val" />
                    </div>
                  )}
                </div>
                <p>
                  As especificações técnicas, materiais (
                  <strong>
                    <span className="filled-data">{materiaisList}</span>
                  </strong>
                  ), acabamentos, medidas e demais características do objeto
                  contratado constam no Caderno Técnico, que integra o presente
                  contrato para todos os fins de direito. A execução dos serviços
                  somente terá início após aprovação formal do Caderno Técnico pelo
                  CONTRATANTE.
                </p>
                <p>
                  Após aprovação do Caderno Técnico pelo CONTRATANTE, qualquer
                  solicitação de alteração posterior estará sujeita a análise de
                  viabilidade pela CONTRATADA e poderá implicar revisão dos prazos de
                  execução bem como cobrança de valores adicionais, sendo vedada
                  qualquer alteração sem a prévia e expressa anuência das partes. A
                  CONTRATADA não estará obrigada a realizar alterações solicitadas se
                  técnica ou economicamente inviáveis.
                </p>
              </div>
            </div>

            {/* CLÁUSULA 2 */}
            <div className="clausula">
              <div className="clausula-titulo">
                <span className="clausula-num">2</span>Cláusula Segunda — Do Valor e
                Condições de Pagamento
              </div>
              <div className="clausula-body">
                <p>O valor total ajustado para a execução dos serviços é de:</p>
                <div className="valor-destaque">
                  <div>
                    <p className="valor-destaque-label">Investimento Total</p>
                    <p className="valor-extenso">
                      <span className="filled-data">
                        {valorExtenso(totalGeral)}
                      </span>
                    </p>
                  </div>
                  <p className="valor-destaque-num">
                    <span className="filled-data">{fmtMoeda(totalGeral)}</span>
                  </p>
                </div>
                <p>
                  O pagamento do valor total será realizado pelo CONTRATANTE à
                  CONTRATADA conforme a seguinte maneira:
                </p>
                <div className="pagamento-bloco">
                  <span className="filled-data">{pgtoDetalhado}</span>
                </div>
              </div>
            </div>
          </div>

          <span className="page-num">Pág. 1 / 4</span>
          <div className="footer">
            <p className="footer-left">Documento gerado oficialmente pelo Sistema Explan</p>
            <p className="footer-right">Explan Móveis Planejados © 2026</p>
          </div>
        </div>

        {/* ══════════════ PAGE 2 ══════════════ */}
        <div className="page">
          {headerCont}

          <div className="content">
            {/* CLÁUSULA 3 */}
            <div className="clausula">
              {clausulaTitulo(3, "Do Inadimplemento")}
              <div className="clausula-body">
                <p>
                  3.1 Na hipótese de inadimplemento superior a 15 (quinze) dias,
                  ficará a CONTRATADA autorizada, a seu exclusivo critério, a
                  suspender a execução dos serviços até a regularização integral dos
                  valores em aberto, sem que tal suspensão caracterize descumprimento
                  contratual, permanecendo, contudo, exigíveis todas as obrigações
                  pecuniárias assumidas pelo CONTRATANTE.
                </p>
                <p>
                  3.2 O inadimplemento de qualquer parcela por prazo superior a 15
                  (quinze) dias poderá, ainda, ensejar o vencimento antecipado das
                  demais parcelas vincendas, tornando-se imediatamente exigível o
                  saldo remanescente do contrato, sem prejuízo das medidas de
                  cobrança cabíveis, judiciais ou extrajudiciais.
                </p>
                <p>
                  3.3 O atraso no pagamento de quaisquer valores acarretará{" "}
                  <strong>multa de 2% (dois por cento)</strong> sobre o valor devido,
                  acrescida de <strong>juros de 1% (um por cento) ao mês</strong> e
                  correção monetária pelo INPC, até o efetivo pagamento.
                </p>
              </div>
            </div>

            {/* CLÁUSULA 4 — Responsável Solidário (condicional) */}
            {temResponsavel && (
              <div className="clausula">
                {clausulaTitulo(4, "Do Responsável Financeiro Solidário")}
                <div className="clausula-body">
                  <p>
                    4.1 O RESPONSÁVEL FINANCEIRO SOLIDÁRIO (
                    <strong>
                      <span className="filled-data">{val(c.responsavelNome)}</span>
                    </strong>
                    , CPF:{" "}
                    <strong>
                      <span className="filled-data">{val(c.responsavelCpf)}</span>
                    </strong>
                    ) assume de forma expressa, irrevogável e irretratável a
                    responsabilidade pelo fiel, integral e pontual cumprimento de
                    todas as obrigações financeiras assumidas pelo CONTRATANTE
                    perante a CONTRATADA, não se limitando apenas ao valor principal,
                    ficando responsável também pela quitação de multas, juros,
                    correção monetária e honorários advocatícios.
                  </p>
                  <p>
                    4.2 A CONTRATADA poderá exigir o cumprimento das obrigações
                    tanto do CONTRATANTE quanto do RESPONSÁVEL FINANCEIRO SOLIDÁRIO,
                    conjunta ou isoladamente.
                  </p>
                  <p>
                    4.3 Esta responsabilidade solidária permanecerá válida até a
                    quitação integral de todas as obrigações, inclusive em caso de
                    prorrogação de prazos ou renegociação.
                  </p>
                </div>
              </div>
            )}

            {/* CLÁUSULA 5 (4 if no responsável) — Reserva de Domínio */}
            <div className="clausula">
              {clausulaTitulo(5, "Da Reserva de Domínio")}
              <div className="clausula-body">
                <p>
                  5.1 Por força do pacto de Reserva de Domínio, expresso e aceito
                  pelas partes, fica reservada à CONTRATADA o direito de propriedade
                  dos móveis até que seja liquidada a última das prestações
                  pactuadas.
                </p>
                <p>
                  Parágrafo Único: Os valores pagos pelo CONTRATANTE, antes de
                  restituídos os bens em razão de inadimplência, deverão compensar o
                  tempo de utilização, o desgaste, as reparações necessárias e a
                  multa, conforme se apurar caso a caso.
                </p>
              </div>
            </div>

            {/* CLÁUSULA 6 (5 if no responsável) — Condições de Execução */}
            <div className="clausula">
              {clausulaTitulo(6, "Das Condições de Execução")}
              <div className="clausula-body">
                <p>
                  6.1 Para a adequada execução dos serviços, a CONTRATANTE deverá
                  disponibilizar:
                </p>
                <ul className="lista-alfabetica">
                  <li>
                    energia elétrica e condições seguras para o trabalho no local;
                  </li>
                  <li>
                    livre acesso à área de instalação em horários previamente
                    acordados;
                  </li>
                  <li>
                    ambientes com acabamento de piso e paredes previamente
                    concluídos, secos e devidamente nivelados;
                  </li>
                  <li>
                    disponibilização de água, quando necessária; e autorizações para
                    instalação.
                  </li>
                </ul>
                <p>
                  6.2 A CONTRATANTE declara que o local está apto a receber os
                  móveis, isentando a CONTRATADA de responsabilidade por imperfeições
                  decorrentes de paredes, pisos ou tetos irregulares ou fora de
                  esquadro, que possam resultar em frestas ou necessidade de ajustes
                  não previstos.
                </p>
                <p>
                  6.3 Caso a CONTRATADA constate na data agendada que as condições
                  acima não foram atendidas, o prazo de execução será suspenso até a
                  conformidade do local, e a CONTRATANTE arcará com o custo de R$
                  100,00 por deslocamento improdutivo da equipe.
                </p>
                <p>
                  6.4 Será realizado um Checklist de Montagem prévio para verificar
                  as condições gerais do ambiente e identificar eventuais
                  irregularidades já existentes. Vícios ali registrados não serão de
                  responsabilidade da CONTRATADA.
                </p>
              </div>
            </div>
          </div>

          <span className="page-num">Pág. 2 / 4</span>
          <div className="footer">
            <p className="footer-left">Documento oficial gerado pelo Sistema Explan</p>
            <p className="footer-right">Explan Móveis Planejados © 2026</p>
          </div>
        </div>

        {/* ══════════════ PAGE 3 ══════════════ */}
        <div className="page">
          {headerCont}

          <div className="content">
            {/* CLÁUSULA 7 (6 if no responsável) — Guarda de Objetos */}
            <div className="clausula">
              {clausulaTitulo(7, "Da Guarda de Objetos e Itens de Valor")}
              <div className="clausula-body">
                <p>
                  7.1 O CONTRATANTE compromete-se a guardar previamente todos os
                  objetos de valor, itens frágeis ou suscetíveis a quebra nos
                  ambientes onde ocorrerão os serviços.
                </p>
                <p>
                  7.2 A CONTRATADA não se responsabilizará por danos, perdas ou
                  extravios de bens não removidos pelo CONTRATANTE antes das
                  atividades.
                </p>
              </div>
            </div>

            {/* CLÁUSULA 8 (7 if no responsável) — Serviços Adicionais */}
            <div className="clausula">
              {clausulaTitulo(8, "Dos Serviços Adicionais")}
              <div className="clausula-body">
                <p>
                  8.1 Caso surjam serviços extras ou complementares não previstos
                  neste contrato, as partes firmarão Termo Aditivo específico,
                  contendo novos valores, prazos e condições de execução. Nenhum
                  serviço adicional será considerado contratado sem a formalização do
                  referido aditivo.
                </p>
              </div>
            </div>

            {/* CLÁUSULA 9 (8 if no responsável) — Prazo de Execução */}
            <div className="clausula">
              {clausulaTitulo(9, "Do Prazo de Execução")}
              <div className="clausula-body">
                <p>
                  9.1 O prazo de produção é de{" "}
                  <strong>
                    <span className="filled-data">
                      {val(c.prazo || "45 dias úteis")}
                    </span>
                  </strong>{" "}
                  e o prazo de instalação é de{" "}
                  <strong>
                    <span className="filled-data">
                      {val(c.instalacao || "7 dias")}
                    </span>
                  </strong>
                  , contados a partir da assinatura do caderno técnico, podendo ser
                  prorrogado mediante acordo formal entre as partes.
                </p>
                <p>
                  9.2 O prazo de execução será suspenso ou prorrogado em hipóteses
                  de: não cumprimento das condições de instalação, solicitação de
                  serviços extras, caso fortuito ou força maior (incluindo falta de
                  insumos no mercado ou chuvas extremas), e não autorização de
                  entrada no local.
                </p>
              </div>
            </div>

            {/* CLÁUSULA 10 (9 if no responsável) — Vistoria e Aceitação */}
            <div className="clausula">
              {clausulaTitulo(10, "Da Vistoria e Aceitação")}
              <div className="clausula-body">
                <p>
                  10.1 Concluída a instalação, a CONTRATADA convocará a CONTRATANTE
                  para a vistoria conjunta dos serviços, preenchendo o checklist de
                  entrega.
                </p>
                <p>
                  10.2 A CONTRATANTE terá o prazo de 48 (quarenta e oito) horas
                  úteis, após a convocação, para apontar eventuais vícios aparentes
                  ou discordâncias.
                </p>
                <p>
                  10.3 Havendo vícios ou discordâncias, a CONTRATADA terá o prazo de
                  10 (dez) dias úteis para saná-los, sem custo adicional. Não
                  havendo manifestação em 48 horas úteis, os serviços serão
                  considerados definitiva e irrevogavelmente aceitos.
                </p>
              </div>
            </div>

            {/* CLÁUSULA 11 (10 if no responsável) — Garantia */}
            <div className="clausula">
              {clausulaTitulo(11, "Da Garantia")}
              <div className="clausula-body">
                <p>
                  11.1 Os móveis e serviços objeto deste contrato possuem garantia
                  total de <strong>60 (sessenta) meses</strong> contra defeitos de
                  fabricação e ferragens, contados a partir da assinatura do
                  checklist de entrega.
                </p>
                <p>
                  11.2 Excluem-se da garantia defeitos decorrentes de: mau uso ou
                  negligência, exposição direta ao sol, umidade excessiva ou contato
                  direto com água, danos por produtos químicos, desgaste natural, e
                  modificações realizadas por terceiros.
                </p>
              </div>
            </div>
          </div>

          <span className="page-num">Pág. 3 / 4</span>
          <div className="footer">
            <p className="footer-left">Documento oficial gerado pelo Sistema Explan</p>
            <p className="footer-right">Explan Móveis Planejados © 2026</p>
          </div>
        </div>

        {/* ══════════════ PAGE 4 ══════════════ */}
        <div className="page">
          {headerCont}

          <div className="content">
            {/* CLÁUSULA 12 (11 if no responsável) — Penalidades e Rescisão */}
            <div className="clausula">
              {clausulaTitulo(12, "Das Penalidades e Rescisão")}
              <div className="clausula-body">
                <p>
                  12.1 O presente contrato poderá ser rescindido nas hipóteses
                  legais.
                </p>
                <p>
                  12.2 Ocorrendo a rescisão por culpa da CONTRATANTE: a) A
                  CONTRATADA terá direito ao reembolso dos materiais já adquiridos e
                  custos iniciais. b) A CONTRATANTE deverá pagar o valor proporcional
                  aos serviços já executados até a data da rescisão, mediante
                  medição.
                </p>
                <p>
                  12.3 Ocorrendo a rescisão por culpa da CONTRATADA, ela deverá
                  restituir os valores eventualmente adiantados, deduzidos os custos
                  proporcionais de serviços e materiais efetivamente entregues e
                  aceitos.
                </p>
              </div>
            </div>

            {/* CLÁUSULA 13 (12 if no responsável) — Foro */}
            <div className="clausula">
              {clausulaTitulo(13, "Do Foro")}
              <div className="clausula-body">
                <p>
                  13.1 Fica eleito o foro da comarca de Goiânia/GO, com renúncia a
                  qualquer outro, por mais privilegiado que seja, para dirimir
                  eventuais controvérsias oriundas deste contrato.
                </p>
              </div>
            </div>

            {/* ── ASSINATURAS ── */}
            <div className="assinaturas-section">
              <p className="ass-local-data">
                <span className="filled-data">Goiânia</span>,{" "}
                <span className="filled-data">{dataStr}</span>.
              </p>

              <div className="ass-grid">
                <div className="ass-col">
                  <div className="ass-linha" />
                  <p className="ass-nome">
                    <span className="filled-data">{val(c.nome)}</span>
                  </p>
                  <p className="ass-qualif">CONTRATANTE</p>
                  <p className="ass-cpf">
                    CPF/CNPJ: <span className="filled-data">{val(c.cpf)}</span>
                  </p>
                </div>
                <div className="ass-col">
                  <div className="ass-linha" />
                  <p className="ass-nome">Explan Engenharia e Serviços Ltda.</p>
                  <p className="ass-qualif">CONTRATADA</p>
                  <p className="ass-cpf">CNPJ: 55.708.752/0001-01</p>
                </div>
              </div>

              {temResponsavel && (
                <div className="ass-grid">
                  <div className="ass-col">
                    <div className="ass-linha" />
                    <p className="ass-nome">
                      <span className="filled-data">{val(c.responsavelNome)}</span>
                    </p>
                    <p className="ass-qualif">
                      RESPONSÁVEL FINANCEIRO SOLIDÁRIO
                    </p>
                    <p className="ass-cpf">
                      CPF: <span className="filled-data">{val(c.responsavelCpf)}</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="ass-testemunhas">
                <p className="ass-testemunhas-label">Testemunhas</p>
                <div className="ass-tess-grid">
                  <div className="ass-col">
                    <div className="ass-linha" />
                    <p className="ass-nome">Testemunha 1</p>
                    <p className="ass-cpf">CPF: ___.___.___-__</p>
                  </div>
                  <div className="ass-col">
                    <div className="ass-linha" />
                    <p className="ass-nome">Testemunha 2</p>
                    <p className="ass-cpf">CPF: ___.___.___-__</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <span className="page-num">Pág. 4 / 4</span>
          <div className="footer">
            <p className="footer-left">Documento oficial gerado pelo Sistema Explan</p>
            <p className="footer-right">Explan Móveis Planejados © 2026</p>
          </div>
        </div>
      </div>
    </>
  );
}
