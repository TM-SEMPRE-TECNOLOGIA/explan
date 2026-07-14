"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ── FAQ DATA ── */
interface FAQItem {
  q: string;
  a: string;
  tags?: string;
}

interface FAQSection {
  cat: string;
  label: string;
  icon: string;
  items: FAQItem[];
}

const FAQ_SECTIONS: FAQSection[] = [
  {
    cat: "orcamento",
    label: "Sobre o Orçamento",
    icon: "circle-dollar-sign",
    items: [
      {
        q: "Qual a validade informada nos orçamentos?",
        a: `Informe sempre aos clientes que nossos orçamentos têm validade de <strong>30 dias corridos</strong> a partir da emissão.<br/><br/>
Essa regra existe devido à flutuação de preços dos fornecedores (MDF e ferragens). Após o prazo, recálculos podem ser necessários.<br/><br/>
<span class="tag"><i data-lucide="calendar"></i> Validade: 30 dias</span>`,
      },
      {
        q: "Como proceder em orçamentos sem visita técnica?",
        a: `A equipe pode gerar um <strong>orçamento estimativo</strong> (pré-orçamento) com base nas metragens enviadas pelo cliente. Deixe claro que o valor final <strong>sempre dependerá</strong> da medição gratuita no local.<br/><br/>
A visita técnica só avança após o cliente estar confortável com a faixa de preço estimada.`,
      },
      {
        q: "Cobramos pelo projeto 3D?",
        a: `<strong>Não! O projeto 3D é 100% gratuito</strong> e serve como grande apelo de vendas.<br/><br/>
Reforce com o cliente que ele poderá visualizar todos os ambientes fotorrealísticos antes de fechar o negócio.<br/><br/>
<span class="tag"><i data-lucide="check-circle-2"></i> Grátis</span><span class="tag"><i data-lucide="palette"></i> Fotorrealístico</span>`,
      },
      {
        q: "O cliente pode alterar o projeto após assinar?",
        a: `Pequenas alterações (cor, puxador, divisórias) são permitidas <strong>em até 5 dias úteis</strong> após a assinatura, antes do plano de corte.<br/><br/>
Aumentos de dimensão ou novos ambientes devem gerar um <strong>aditivo de contrato</strong> com recálculo e prazo novo.`,
      },
    ],
  },
  {
    cat: "materiais",
    label: "Materiais e Descontos",
    icon: "layers",
    items: [
      {
        q: "Quais materiais são usados nos móveis?",
        a: `Trabalhamos com os melhores materiais do mercado:
<ul>
  <li><strong>Chapas MDF Duratex</strong> — 15mm ou 18mm, conforme o projeto</li>
  <li><strong>Ferragens Blum</strong> (padrão), <strong>Häfele</strong> ou <strong>FGV</strong></li>
  <li>Acabamentos certificados (fórmica, laca, madeirado, ripado, palha)</li>
  <li>Vidros e espelhos de fornecedores homologados</li>
</ul>
<br/>
<span class="tag">🏆 Duratex</span><span class="tag">⚙️ Blum / Häfele</span>`,
      },
      {
        q: "O que é a Chapa 15 e como funciona o desconto?",
        a: `A <strong>Chapa 15mm</strong> é uma alternativa à chapa padrão de 18mm, com espessura menor, indicada para ambientes com menor demanda estrutural (como armários aéreos e painéis decorativos).<br/><br/>
Por ter menor custo de material, optar pela chapa 15 gera um <strong>desconto de −10% no valor do MDF</strong> daquele ambiente.<br/><br/>
<span class="tag"><i data-lucide="package"></i> −10% no custo de MDF</span>`,
      },
      {
        q: "Qual é a diferença entre Blum, Häfele e FGV?",
        a: `<ul>
  <li><strong>Blum</strong> — Ferragem padrão da Explan. Marca austríaca, referência mundial em dobradiças e corrediças. Alta durabilidade e suavidade de movimento. <span class="tag">padrão</span></li>
  <li><strong>Häfele</strong> — Alemã, excelente custo-benefício. Gera <span class="tag">−5% de desconto</span> no valor do ambiente.</li>
  <li><strong>FGV</strong> — Nacional, com boa qualidade para projetos mais econômicos. Gera <span class="tag">−15% de desconto</span> no valor do ambiente.</li>
</ul>`,
      },
      {
        q: 'O que significa "interior branco" no orçamento?',
        a: `"Interior branco" significa que o <strong>lado interno</strong> das gavetas, prateleiras e a parte interna dos armários é branco — a cor padrão da chapa crua, sem revestimento colorido.<br/><br/>
Como dispensa um processo de laminação extra, isso gera um <strong>desconto de −5%</strong> no valor do ambiente.<br/><br/>
A maioria dos clientes opta por interior branco em cozinhas e banheiros, mantendo a cor apenas no exterior visível.`,
      },
      {
        q: "Como agendar visita ao showroom para o cliente?",
        a: `Incentive o cliente a visitar nosso showroom físico para conferir o mostruário de laca, ferragens e MDF.<br/><br/>
Combine com a recepção e confirme a presença do projetista responsável para apresentar as soluções.`,
      },
    ],
  },
  {
    cat: "pagamento",
    label: "Condições de Pagamento",
    icon: "credit-card",
    items: [
      {
        q: "Quais as regras de parcelamento no cartão?",
        a: `A equipe pode oferecer parcelamento em <strong>até 12× sem juros</strong>.<br/><br/>
Lembre-se que as taxas da operadora já estão cobertas pela nossa margem. Não repasse juros para o cliente nessa modalidade.<br/><br/>
<span class="tag"><i data-lucide="credit-card"></i> Até 12× sem juros</span>`,
      },
      {
        q: "Como funciona o pagamento por etapas?",
        a: `No pagamento por etapas, o valor é dividido em <strong>3 ou 4 parcelas</strong> vinculadas ao andamento da obra:
<ul>
  <li>1ª parcela: na assinatura do contrato</li>
  <li>2ª parcela: no início da produção</li>
  <li>3ª parcela: na entrega dos móveis</li>
  <li>4ª parcela: após a instalação completa (quando aplicável)</li>
</ul>
<br/>
Essa modalidade garante <strong>5% de desconto</strong> sobre o valor total.
<br/><span class="tag">🎁 −5% de desconto</span>`,
      },
      {
        q: "Quais os limites de desconto à vista?",
        a: `Para pagamento <strong>50% assinatura + 50% entrega</strong>, o desconto padrão aplicável no sistema é de <strong>10%</strong> sobre o subtotal.<br/><br/>
Essa é a modalidade mais recomendada pelos nossos fluxos de caixa.<br/><br/>
<span class="tag">🏆 −10% de desconto</span><span class="tag"><i data-lucide="star"></i> Mais popular</span>`,
      },
    ],
  },
  {
    cat: "prazo",
    label: "Prazo e Entrega",
    icon: "calendar",
    items: [
      {
        q: "Qual é o prazo de produção e instalação?",
        a: `O prazo padrão é de <strong>45 dias úteis</strong> a partir da assinatura do contrato e pagamento da entrada, dividido assim:
<ul>
  <li>📑 Medição técnica: até 5 dias úteis</li>
  <li>🏭 Produção em fábrica: 30 a 35 dias úteis</li>
  <li>🔑 Instalação: 2 a 5 dias (dependendo do volume)</li>
</ul>
<br/>
Projetos maiores (apartamento completo) podem ter prazo de até 60 dias. Sempre informamos antes de fechar.`,
      },
      {
        q: "O que inclui o frete e a instalação?",
        a: `O <strong>frete</strong> (transporte dos móveis até o imóvel) e a <strong>instalação completa</strong> são serviços cobrados separadamente e sempre detalhados no orçamento.<br/><br/>
Nossos instaladores são treinados e utilizam ferramentas próprias. Não há surpresas no dia da entrega.`,
      },
    ],
  },
  {
    cat: "garantia",
    label: "Garantia",
    icon: "shield-check",
    items: [
      {
        q: "Qual é a garantia dos móveis Explan?",
        a: `Oferecemos <strong>5 anos de garantia</strong> contra defeitos de fabricação e montagem. Isso inclui:
<ul>
  <li>Empenamento de peças por defeito de fábrica</li>
  <li>Falhas em ferragens e corrediças</li>
  <li>Problemas estruturais de montagem</li>
</ul>
<br/>
A garantia <strong>não cobre</strong> danos causados por mau uso, umidade excessiva, impacto físico ou alterações feitas por terceiros.<br/><br/>
<span class="tag">🛡️ 5 anos de garantia</span>`,
      },
      {
        q: "Como a equipe deve tratar chamados de garantia?",
        a: `O cliente deve ser orientado a enviar fotos e a descrição do problema via WhatsApp do Atendimento.<br/><br/>
A visita técnica para avaliação e reparo (caso coberto) deve ser agendada em até <strong>5 dias úteis</strong>.<br/><br/>
Lembre o cliente que a garantia não cobre umidade, danos físicos de terceiros ou limpezas inadequadas.`,
      },
    ],
  },
];

const CATEGORIES = [
  { key: "todas", label: "Todas", icon: null },
  { key: "orcamento", label: "Orçamento", icon: "circle-dollar-sign" },
  { key: "materiais", label: "Materiais", icon: "layers" },
  { key: "pagamento", label: "Pagamento", icon: "credit-card" },
  { key: "prazo", label: "Prazo", icon: "calendar" },
  { key: "garantia", label: "Garantia", icon: "shield-check" },
];

export default function AjudaContent() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCat, setActiveCat] = useState("todas");
  const iconsRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).lucide) {
      (window as any).lucide.createIcons();
    }
    iconsRef.current = true;
  }, []);

  // Refresh icons after state changes that affect DOM
  useEffect(() => {
    if (iconsRef.current && typeof window !== "undefined" && (window as any).lucide) {
      // Small delay to let React commit DOM changes
      const t = setTimeout(() => (window as any).lucide.createIcons(), 50);
      return () => clearTimeout(t);
    }
  }, [openIndex, searchQuery, activeCat]);

  const toggleFAQ = (sectionIdx: number, itemIdx: number) => {
    const key = `${sectionIdx}-${itemIdx}`;
    setOpenIndex((prev) => (prev === key ? null : key));
  };

  const filtrarCategoria = (cat: string) => {
    setSearchQuery("");
    setActiveCat(cat);
  };

  const filteredSections = FAQ_SECTIONS.filter((sec) => {
    if (activeCat !== "todas") return sec.cat === activeCat;
    return true;
  });

  const matchesSearch = (item: FAQItem, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    const text = (item.q + " " + item.a.replace(/<[^>]+>/g, "")).toLowerCase();
    return text.includes(q);
  };

  const qLower = searchQuery.toLowerCase().trim();
  const hasResults =
    qLower === "" ||
    filteredSections.some((sec) =>
      sec.items.some((item) => matchesSearch(item, qLower))
    );

  return (
    <>
      {/* ── HEADER ── */}
      <header className="site-header">
        <div className="header-left">
          <img
            className="header-logo"
            src="/imagens-explan/Explan.png"
            alt="Explan"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="header-title">
            Guia Interno (FAQ)
            <span>Regras e políticas de orçamento</span>
          </div>
        </div>
        <a href="/painel" className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          <span>Voltar ao Orçador</span>
        </a>
      </header>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-tag">
          <div className="hero-tag-dot" />
          <span className="hero-tag-text">Central de Ajuda</span>
        </div>
        <h1>
          Guia de
          <br />
          <em>Orçamentos</em>
        </h1>
        <p>
          Consulte rapidamente as regras de negócio, aplicação de descontos,
          prazos e políticas internas da Explan.
        </p>
        <div className="hero-search">
          <span className="hero-search-icon">
            <i data-lucide="search" style={{ width: 18, height: 18 }}></i>
          </span>
          <input
            type="text"
            id="faq-search"
            placeholder="Buscar uma dúvida..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value) setActiveCat("todas");
            }}
            autoComplete="off"
          />
        </div>
      </section>

      {/* ── FILTROS POR CATEGORIA ── */}
      <div className="categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`cat-chip${activeCat === cat.key ? " active" : ""}`}
            onClick={() => filtrarCategoria(cat.key)}
          >
            {cat.icon && <i data-lucide={cat.icon}></i>}
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── FAQ CONTENT ── */}
      <div className="faq-container">
        {/* Nenhum resultado */}
        <div className={`no-results${!hasResults ? " show" : ""}`} id="no-results">
          <span>🔍</span>
          <strong>Nenhuma pergunta encontrada</strong>
          <br />
          Tente outros termos ou{" "}
          <Link href="/suporte" style={{ color: "var(--green)" }}>
            entre em contato conosco
          </Link>
          .
        </div>

        {filteredSections.map((section, sIdx) => {
          const filteredItems =
            qLower === ""
              ? section.items
              : section.items.filter((item) => matchesSearch(item, qLower));

          if (filteredItems.length === 0) return null;

          return (
            <div key={sIdx} className="faq-section" data-cat={section.cat}>
              <div className="faq-section-title">
                <div className="faq-section-icon">
                  {section.icon.includes("shield") && section.icon.length < 10 ? (
                    "🛡️"
                  ) : (
                    <i data-lucide={section.icon}></i>
                  )}
                </div>
                <span className="faq-section-label">{section.label}</span>
              </div>

              {filteredItems.map((item, iIdx) => {
                const key = `${sIdx}-${iIdx}`;
                const isOpen = openIndex === key;
                return (
                  <div
                    key={iIdx}
                    className={`faq-item${isOpen ? " open" : ""}`}
                    data-cat={section.cat}
                  >
                    <div
                      className="faq-q"
                      onClick={() => toggleFAQ(sIdx, iIdx)}
                    >
                      <span className="faq-q-text">{item.q}</span>
                      <div className="faq-q-icon">+</div>
                    </div>
                    <div className="faq-a">
                      <div
                        className="faq-a-inner"
                        dangerouslySetInnerHTML={{ __html: item.a }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* ── CTA WHATSAPP ── */}
        <div className="cta-section">
          <h2>Dúvida em alguma regra?</h2>
          <p>
            Se você precisa de aprovação especial de margem, tirar dúvidas
            sobre materiais exóticos ou confirmar prazos, acione a gerência no
            WhatsApp interno.
          </p>
          <a
            href="#"
            className="btn-wpp"
            id="btn-wpp-interno"
            onClick={(e) => {
              e.preventDefault();
              alert("O WhatsApp da gerência será configurado em breve.");
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Falar com a Gerência (WhatsApp)
          </a>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer>
        <Link href="/painel">← Voltar ao Orçador</Link>
        &nbsp;·&nbsp;
        <Link href="/suporte">Relatar um problema</Link>
        &nbsp;·&nbsp;
        Explan Móveis Planejados · Goiânia — GO · 2026
        &nbsp;·&nbsp;
        Desenvolvido por{" "}
        <a href="https://thiagonascimentobarbosapro.com" target="_blank" rel="noopener noreferrer">
          TM · Sempre Tecnologia
        </a>
      </footer>

      <style jsx>{`
        /* ── HEADER ── */
        .site-header {
          background: var(--olive);
          padding: 18px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.25);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .header-logo {
          height: 36px;
          object-fit: contain;
        }
        .header-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--cream);
          letter-spacing: 0.04em;
        }
        .header-title :global(span) {
          font-weight: 300;
          opacity: 0.65;
          font-size: 13px;
          display: block;
          letter-spacing: 0.02em;
        }
        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: 50px;
          font-family: "Archivo", sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid rgba(235, 230, 221, 0.3);
          background: rgba(235, 230, 221, 0.1);
          color: var(--cream);
          text-decoration: none;
          transition: all 0.2s;
        }
        .btn-back:hover {
          background: rgba(235, 230, 221, 0.2);
          border-color: rgba(235, 230, 221, 0.5);
        }

        /* ── HERO ── */
        .hero {
          background: linear-gradient(135deg, var(--olive) 0%, #2f3020 100%);
          padding: 64px 32px 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: "FAQ";
          position: absolute;
          bottom: -30px;
          right: -20px;
          font-size: 200px;
          font-weight: 900;
          color: rgba(235, 230, 221, 0.03);
          letter-spacing: -0.02em;
          pointer-events: none;
        }
        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(107, 142, 94, 0.2);
          border: 1px solid rgba(107, 142, 94, 0.4);
          padding: 6px 16px;
          border-radius: 50px;
          margin-bottom: 20px;
        }
        .hero-tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--green);
        }
        .hero-tag-text {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--green);
        }
        .hero h1 {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          color: var(--cream);
          line-height: 1.1;
          margin-bottom: 16px;
        }
        .hero h1 :global(em) {
          font-style: italic;
          font-weight: 300;
          color: rgba(235, 230, 221, 0.6);
        }
        .hero p {
          font-size: 16px;
          color: rgba(235, 230, 221, 0.65);
          max-width: 520px;
          margin: 0 auto 32px;
          line-height: 1.7;
        }
        .hero-search {
          max-width: 480px;
          margin: 0 auto;
          position: relative;
        }
        .hero-search :global(input) {
          width: 100%;
          padding: 16px 20px 16px 50px;
          border-radius: 50px;
          border: 2px solid rgba(235, 230, 221, 0.2);
          background: rgba(255, 255, 255, 0.08);
          font-family: "Archivo", sans-serif;
          font-size: 14px;
          color: var(--cream);
          outline: none;
          transition: all 0.3s;
          backdrop-filter: blur(8px);
        }
        .hero-search :global(input)::placeholder {
          color: rgba(235, 230, 221, 0.4);
        }
        .hero-search :global(input):focus {
          border-color: var(--green);
          background: rgba(255, 255, 255, 0.12);
        }
        .hero-search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(235, 230, 221, 0.4);
          display: flex;
        }

        /* ── CATEGORIAS ── */
        .categories {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          transform: translateY(-24px);
        }
        .cat-chip {
          padding: 10px 20px;
          border-radius: 50px;
          font-family: "Archivo", sans-serif;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          border: 2px solid var(--border);
          background: var(--white);
          color: var(--text-muted);
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: var(--shadow);
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }
        .cat-chip :global(i) {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
        }
        .cat-chip:hover {
          border-color: var(--olive);
          color: var(--olive);
          transform: translateY(-1px);
        }
        .cat-chip.active {
          background: var(--olive);
          color: var(--cream);
          border-color: var(--olive);
          box-shadow: 0 4px 16px rgba(65, 66, 47, 0.3);
        }

        /* ── FAQ CONTAINER ── */
        .faq-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 0 16px 80px;
        }

        .faq-section {
          margin-bottom: 40px;
        }

        .faq-section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .faq-section-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--olive);
          color: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .faq-section-icon :global(i) {
          width: 18px;
          height: 18px;
        }
        .faq-section-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--olive);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* ── ACCORDION ── */
        .faq-item {
          background: var(--white);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          margin-bottom: 10px;
          overflow: hidden;
          transition: box-shadow 0.25s;
          border: 1px solid transparent;
        }
        .faq-item:hover {
          box-shadow: var(--shadow-hover);
        }
        .faq-item.open {
          border-color: rgba(107, 142, 94, 0.25);
        }
        .faq-q {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          cursor: pointer;
          gap: 16px;
          transition: background 0.2s;
          user-select: none;
        }
        .faq-q:hover {
          background: var(--cream-alt);
        }
        .faq-item.open .faq-q {
          background: var(--cream-alt);
        }
        .faq-q-text {
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          line-height: 1.4;
        }
        .faq-q-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--cream);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: var(--text-muted);
          flex-shrink: 0;
          transition: all 0.3s;
          font-weight: 300;
        }
        .faq-item.open .faq-q-icon {
          background: var(--green);
          color: #fff;
          transform: rotate(45deg);
        }
        .faq-a {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
            padding 0.3s;
          padding: 0 24px;
        }
        .faq-item.open .faq-a {
          max-height: 600px;
          padding: 0 24px 22px;
        }
        .faq-a-inner {
          font-size: 14px;
          line-height: 1.8;
          color: var(--text-body);
          border-top: 1px solid var(--cream-dark);
          padding-top: 18px;
        }
        .faq-a-inner :global(strong) {
          color: var(--olive);
        }
        .faq-a-inner :global(.tag) {
          display: inline-block;
          background: #eff3ec;
          color: var(--green);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          margin: 4px 4px 4px 0;
        }
        .faq-a-inner :global(ul) {
          padding-left: 18px;
          margin-top: 8px;
        }
        .faq-a-inner :global(ul li) {
          margin-bottom: 4px;
        }

        /* ── NO RESULTS ── */
        .no-results {
          text-align: center;
          padding: 48px 16px;
          color: var(--text-muted);
          display: none;
        }
        .no-results.show {
          display: block;
        }
        .no-results :global(span) {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }

        /* ── CTA WHATSAPP ── */
        .cta-section {
          background: linear-gradient(135deg, var(--olive) 0%, #2f3020 100%);
          margin: 0 auto 60px;
          border-radius: 20px;
          padding: 48px 40px;
          text-align: center;
          max-width: 820px;
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: "";
          position: absolute;
          top: -60px;
          right: -60px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(107, 142, 94, 0.15);
        }
        .cta-section::after {
          content: "";
          position: absolute;
          bottom: -40px;
          left: -40px;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: rgba(107, 142, 94, 0.08);
        }
        .cta-section h2 {
          font-size: 26px;
          font-weight: 700;
          color: var(--cream);
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
        }
        .cta-section p {
          font-size: 15px;
          color: rgba(235, 230, 221, 0.65);
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }
        .btn-wpp {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 15px 32px;
          border-radius: 50px;
          background: #25d366;
          color: #fff;
          font-family: "Archivo", sans-serif;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: all 0.25s;
          box-shadow: 0 4px 20px rgba(37, 211, 102, 0.35);
          position: relative;
          z-index: 1;
        }
        .btn-wpp:hover {
          background: #1da851;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(37, 211, 102, 0.45);
        }
        .btn-wpp :global(svg) {
          width: 22px;
          height: 22px;
        }

        /* ── FOOTER ── */
        footer {
          background: var(--olive);
          text-align: center;
          padding: 20px;
          font-size: 11px;
          color: rgba(235, 230, 221, 0.5);
          letter-spacing: 0.04em;
        }
        footer :global(a) {
          color: rgba(235, 230, 221, 0.85);
          text-decoration: none;
          font-weight: 600;
        }
        footer :global(a):hover {
          color: var(--green);
        }

        /* ── ANIMAÇÕES ── */
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .faq-section {
          animation: fadeUp 0.5s ease forwards;
        }
        .faq-container > :global(.faq-section:nth-child(2)) {
          animation-delay: 0.05s;
        }
        .faq-container > :global(.faq-section:nth-child(3)) {
          animation-delay: 0.1s;
        }
        .faq-container > :global(.faq-section:nth-child(4)) {
          animation-delay: 0.15s;
        }
        .faq-container > :global(.faq-section:nth-child(5)) {
          animation-delay: 0.2s;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 600px) {
          .site-header {
            padding: 14px 16px;
          }
          .hero {
            padding: 48px 16px 64px;
          }
          .hero h1 {
            font-size: 28px;
          }
          .faq-q {
            padding: 16px 18px;
          }
          .faq-a {
            padding: 0 18px;
          }
          .faq-item.open .faq-a {
            padding: 0 18px 18px;
          }
          .cta-section {
            padding: 36px 24px;
            border-radius: 16px;
          }
          .btn-back :global(span) {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
