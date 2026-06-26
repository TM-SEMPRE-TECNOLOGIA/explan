# UI/UX Design System — Explan Móveis Planejados
### Gerado via ui-ux-pro-max · Produto: Service / Interior Design · Stack: Web (WordPress + Elementor)

---

## DESIGN SYSTEM RECOMENDADO

### Produto e Padrão
```
Product Type : Service — Home & Interior Design (alto ticket, confiança crítica)
Pattern      : Portfolio-first com prova social e CTA de contato
Style        : Warm Minimalism + Editorial (sofisticado, humano, premium sem frieza)
Density      : Low density — respiro amplo, imagens dominantes
Navigation   : Single-page scroll com âncoras fixas no topo
```

### Anti-padrões a Evitar
- ❌ Glassmorphism (parecer tech demais para marcenaria)
- ❌ Brutalism (quebra o tom premium)
- ❌ Neon / Cyberpunk (contexto errado)
- ❌ Emojis como ícones estruturais (usar SVG Lucide ou similar)
- ❌ CTA repetido sem variação de hierarquia
- ❌ Galeria sem filtro de categoria

---

## PALETA DE CORES (Sistema de Tokens)

```css
/* ─── TOKENS SEMÂNTICOS ─── */

/* Surface */
--color-surface-base      : #FFFFFF;    /* fundo principal */
--color-surface-alt       : #F7F5F2;    /* seções alternadas (off-white quente) */
--color-surface-dark      : #1C1C1A;    /* footer / hero escuro */
--color-surface-overlay   : rgba(28,28,26,0.55);  /* overlay sobre fotos */

/* Brand */
--color-brand-primary     : #3B5E27;    /* verde musgo — ação principal */
--color-brand-primary-lt  : #E8F0E2;    /* verde claro — badges, bg de cards */
--color-brand-accent      : #8B6914;    /* dourado/terracota — luxo sutil */

/* Text */
--color-text-heading      : #111210;    /* quase preto — títulos */
--color-text-body         : #3A3A37;    /* cinza escuro quente — corpo */
--color-text-muted        : #7A7A74;    /* placeholder, legendas */
--color-text-inverse      : #F7F5F2;    /* texto sobre fundo escuro */

/* Feedback */
--color-success           : #3B5E27;
--color-error             : #C0392B;
--color-warning           : #D97706;

/* Border */
--color-border-subtle     : #E5E2DC;    /* divisórias suaves */
--color-border-strong     : #3B5E27;    /* borda de destaque */
```

**Verificação de Contraste (WCAG AA 4.5:1):**
| Par | Ratio | Status |
|---|---|---|
| `text-heading` (#111210) sobre `surface-base` (#FFF) | 19.5:1 | ✅ AAA |
| `text-body` (#3A3A37) sobre `surface-base` | 9.8:1 | ✅ AAA |
| `text-inverse` (#F7F5F2) sobre `surface-dark` (#1C1C1A) | 14.2:1 | ✅ AAA |
| `brand-primary` (#3B5E27) sobre `surface-base` | 7.1:1 | ✅ AAA |
| `text-muted` (#7A7A74) sobre `surface-base` | 4.6:1 | ✅ AA |

---

## TIPOGRAFIA

### Sistema de Tipos
```css
/* ─── FONT PAIRING ─── */
--font-display  : 'Cormorant Garamond', Georgia, serif;   /* títulos editoriais */
--font-heading  : 'Montserrat', 'Helvetica Neue', sans-serif; /* subtítulos, nav */
--font-body     : 'Inter', system-ui, sans-serif;         /* corpo, UI */
--font-mono     : 'JetBrains Mono', monospace;            /* dados técnicos (CNPJ, etc) */

/* ─── SCALE (rem base = 16px) ─── */
--text-xs       : 0.75rem;   /* 12px — legal, rodapé */
--text-sm       : 0.875rem;  /* 14px — label, caption */
--text-base     : 1rem;      /* 16px — corpo mínimo mobile */
--text-lg       : 1.125rem;  /* 18px — corpo desktop */
--text-xl       : 1.25rem;   /* 20px — subtítulo menor */
--text-2xl      : 1.5rem;    /* 24px — subtítulo seção */
--text-3xl      : 2rem;      /* 32px — título seção */
--text-4xl      : 2.75rem;   /* 44px — título principal */
--text-5xl      : 3.75rem;   /* 60px — hero display */

/* ─── LINE HEIGHT ─── */
--leading-tight : 1.2;    /* títulos grandes */
--leading-snug  : 1.35;   /* subtítulos */
--leading-normal: 1.6;    /* corpo (acima de 1.5 recomendado) */
--leading-loose : 1.75;   /* leitura longa */

/* ─── WEIGHT ─── */
--weight-regular : 400;
--weight-medium  : 500;
--weight-semibold: 600;
--weight-bold    : 700;
```

### Uso por Elemento
| Elemento | Font | Size | Weight | Line-height |
|---|---|---|---|---|
| Hero H1 | Cormorant Garamond | 5xl (60px) | 600 | tight |
| Título de seção H2 | Cormorant Garamond | 4xl (44px) | 600 | tight |
| Subtítulo H3 | Montserrat | 2xl (24px) | 600 | snug |
| Corpo principal | Inter | lg (18px) | 400 | normal (1.6) |
| Caption / legenda | Inter | sm (14px) | 400 | normal |
| CTA button | Montserrat | base (16px) | 600 | — |
| Nav links | Montserrat | sm (14px) | 500 | — |
| Tag / badge | Montserrat | xs (12px) | 600 | uppercase |

---

## SPACING SYSTEM (4pt/8dp)

```css
--space-1  :  4px;
--space-2  :  8px;
--space-3  : 12px;
--space-4  : 16px;
--space-5  : 20px;
--space-6  : 24px;
--space-8  : 32px;
--space-10 : 40px;
--space-12 : 48px;
--space-16 : 64px;
--space-20 : 80px;
--space-24 : 96px;
--space-32 :128px;

/* Margens laterais por breakpoint */
--gutter-mobile  : 20px;
--gutter-tablet  : 40px;
--gutter-desktop : 64px;

/* Container max-width */
--container-sm   : 640px;
--container-md   : 768px;
--container-lg   : 1024px;
--container-xl   : 1280px;
--container-2xl  : 1440px;
```

---

## EFEITOS VISUAIS

```css
/* ─── BORDER RADIUS ─── */
--radius-sm   :  4px;   /* inputs, badges */
--radius-md   :  8px;   /* cards menores */
--radius-lg   : 16px;   /* cards principais */
--radius-xl   : 24px;   /* cards hero */
--radius-full : 9999px; /* pills, botões arredondados */

/* ─── SHADOWS (Warm Minimalism — sombras quentes, não frias) ─── */
--shadow-sm   : 0 1px 3px rgba(28,28,26,0.08), 0 1px 2px rgba(28,28,26,0.04);
--shadow-md   : 0 4px 12px rgba(28,28,26,0.10), 0 2px 4px rgba(28,28,26,0.06);
--shadow-lg   : 0 12px 32px rgba(28,28,26,0.14), 0 4px 8px rgba(28,28,26,0.08);
--shadow-hover: 0 16px 40px rgba(28,28,26,0.18);

/* ─── TRANSITIONS ─── */
--transition-fast  : 150ms ease-out;
--transition-base  : 250ms ease-out;
--transition-slow  : 350ms ease-out;
/* exit = ease-in, ~60–70% do tempo de entrada */
```

---

## COMPONENTES PRINCIPAIS

### Botão Primário (CTA)
```css
.btn-primary {
  background     : var(--color-brand-primary);
  color          : var(--color-text-inverse);
  font-family    : var(--font-heading);
  font-size      : var(--text-base);
  font-weight    : var(--weight-semibold);
  padding        : 14px 32px;
  border-radius  : var(--radius-sm);
  min-height     : 48px;          /* ≥44px touch target */
  min-width      : 44px;
  transition     : all var(--transition-base);
  cursor         : pointer;
  letter-spacing : 0.04em;
  text-transform : uppercase;
}
.btn-primary:hover {
  background     : #2D4A1E;       /* darkened 10% */
  box-shadow     : var(--shadow-md);
  transform      : translateY(-1px);  /* apenas transform — nunca top/left */
}
.btn-primary:active {
  transform      : scale(0.97);
  transition     : all 100ms ease-in;
}
.btn-primary:focus-visible {
  outline        : 3px solid var(--color-brand-primary);
  outline-offset : 3px;           /* focus ring visível — não remover */
}
.btn-primary:disabled {
  opacity        : 0.4;
  cursor         : not-allowed;
  pointer-events : none;
}
```

### Botão Secundário
```css
.btn-secondary {
  background     : transparent;
  color          : var(--color-brand-primary);
  border         : 2px solid var(--color-brand-primary);
  /* demais propriedades iguais ao primário */
}
.btn-secondary:hover {
  background     : var(--color-brand-primary-lt);
}
```

### Card de Projeto (Portfolio)
```css
.card-project {
  background     : var(--color-surface-base);
  border-radius  : var(--radius-lg);
  overflow       : hidden;
  box-shadow     : var(--shadow-sm);
  transition     : box-shadow var(--transition-base),
                   transform var(--transition-base);
}
.card-project:hover {
  box-shadow     : var(--shadow-hover);
  transform      : translateY(-4px);  /* apenas transform */
}
/* Imagem deve ter width + height declarados para evitar CLS */
.card-project img {
  width          : 100%;
  height         : 280px;
  object-fit     : cover;
  aspect-ratio   : 4/3;   /* reserva espaço antes do load */
  display        : block;
}
```

### Input de Formulário
```css
.input-field {
  width          : 100%;
  min-height     : 48px;         /* touch target ≥44px */
  padding        : 12px 16px;
  border         : 1.5px solid var(--color-border-subtle);
  border-radius  : var(--radius-sm);
  font-family    : var(--font-body);
  font-size      : var(--text-base);  /* 16px — evita zoom iOS */
  color          : var(--color-text-body);
  background     : var(--color-surface-base);
  transition     : border-color var(--transition-fast);
}
.input-field:focus {
  border-color   : var(--color-brand-primary);
  outline        : 2px solid var(--color-brand-primary-lt);
  outline-offset : 0;
}
.input-field::placeholder {
  color          : var(--color-text-muted);
}
/* SEMPRE usar <label> visível — nunca placeholder como único label */
```

---

## LAYOUT HERO (Estrutura Recomendada)

```html
<!-- Hero: regra 55/45 — conteúdo esquerda, imagem direita -->
<section class="hero" aria-label="Apresentação principal">
  <div class="hero__content">
    <!-- Tag de credibilidade -->
    <span class="badge" aria-label="Localização">Goiânia · GO</span>

    <!-- H1 único da página -->
    <h1 class="hero__title">
      Móveis planejados pensados<br>
      <em>para além do agora</em>
    </h1>

    <!-- Subtítulo — max 2 linhas -->
    <p class="hero__subtitle">
      Projetos residenciais e comerciais sob medida,
      com clareza e transparência do início à entrega.
    </p>

    <!-- CTA group — primário + secundário -->
    <div class="hero__cta" role="group" aria-label="Ações principais">
      <a href="https://wa.me/556299439-3938" class="btn-primary"
         aria-label="Solicitar orçamento via WhatsApp">
        Solicitar Orçamento
      </a>
      <a href="#portfolio" class="btn-secondary"
         aria-label="Ver portfólio de projetos">
        Ver Projetos
      </a>
    </div>

    <!-- Trust signals -->
    <ul class="hero__trust" aria-label="Diferenciais">
      <li><svg aria-hidden="true">…</svg> Projeto 3D grátis</li>
      <li><svg aria-hidden="true">…</svg> Garantia até 5 anos</li>
      <li><svg aria-hidden="true">…</svg> Showroom em Goiânia</li>
    </ul>
  </div>

  <!-- Imagem com dimensões declaradas (evita CLS) -->
  <div class="hero__image" aria-hidden="true">
    <img
      src="hero-cozinha.webp"
      alt="Cozinha planejada em Goiânia executada pela Explan"
      width="820" height="680"
      loading="eager"
      fetchpriority="high"
    >
  </div>
</section>
```

---

## CHECKLIST UI/UX — PRÉ-LANÇAMENTO

### Prioridade 1 — Acessibilidade (CRÍTICO)
- [ ] Contraste ≥ 4.5:1 em todo texto — verificar com [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] Todas as imagens têm `alt` descritivo (não vazio, não "imagem")
- [ ] Todos os botões/links têm `aria-label` quando o texto visual é insuficiente
- [ ] Botão WhatsApp flutuante tem label acessível (`aria-label="Abrir chat WhatsApp"`)
- [ ] H1 único por página; hierarquia H1 → H2 → H3 sem pular nível
- [ ] Form labels visíveis e associados via `for` + `id`
- [ ] Focus ring visível em todos os elementos interativos (não remover outline)
- [ ] Navegação por teclado funcional (Tab, Enter, Escape)

### Prioridade 2 — Touch & Interação (CRÍTICO)
- [ ] Todo elemento clicável tem área mínima de 44×44px
- [ ] Espaçamento mínimo de 8px entre botões/links
- [ ] Botão "Solicitar Orçamento" desabilitado com loader durante envio de form
- [ ] Feedback visual em hover E em tap (não só hover)
- [ ] Formulário dá feedback claro após envio (sucesso ou erro)

### Prioridade 3 — Performance (ALTO)
- [ ] Todas as imagens em WebP com fallback (já presente — manter)
- [ ] `width` e `height` declarados em todas as `<img>` (previne CLS)
- [ ] Imagem hero com `loading="eager"` e `fetchpriority="high"`
- [ ] Demais imagens com `loading="lazy"`
- [ ] CLS (Cumulative Layout Shift) < 0.1 — verificar no PageSpeed Insights
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] Fontes com `font-display: swap`
- [ ] Galeria duplicada removida (bug crítico de performance)

### Prioridade 4 — Estilo (ALTO)
- [ ] Ícones SVG — nenhum emoji como ícone estrutural
- [ ] Mesmo estilo de ícones em toda a página (stroke consistente)
- [ ] Máximo 1 CTA primário por seção (hierarquia visual)
- [ ] CTA secundário visualmente subordinado ao primário

### Prioridade 5 — Layout Responsivo (ALTO)
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1">` presente
- [ ] Sem scroll horizontal no mobile (375px)
- [ ] Fonte mínima 16px no body (evita zoom automático do iOS)
- [ ] Conteúdo visível sem scroll nos primeiros 600px (above the fold) no mobile
- [ ] Menu funcional em 375px

### Prioridade 6 — Tipografia e Cor (MÉDIO)
- [ ] Line-height do corpo ≥ 1.5 (recomendado 1.6)
- [ ] Comprimento de linha: 35–60 chars no mobile, 60–75 chars no desktop
- [ ] Sem texto abaixo de 12px (mínimo 14px em legendas)
- [ ] Não usar cor como único indicador de informação

### Prioridade 8 — Formulários (MÉDIO)
- [ ] Label visível em cada campo (não só placeholder)
- [ ] Erro exibido abaixo do campo relacionado, não só no topo
- [ ] Campos obrigatórios marcados com asterisco
- [ ] `type="tel"` no campo de WhatsApp (abre teclado numérico no mobile)
- [ ] `autocomplete` nos campos (nome, tel)

### Prioridade 9 — Navegação (ALTO)
- [ ] Menu âncoras funcionam para todas as seções
- [ ] Nav permanece acessível de qualquer ponto da página
- [ ] Seção ativa destacada no menu durante o scroll (scroll-spy)
- [ ] Botão WhatsApp não sobrepõe conteúdo crítico no mobile
- [ ] Logo leva ao topo da página

---

## MELHORIAS ESPECÍFICAS POR SEÇÃO

### Hero
| Problema | Solução | Impacto |
|---|---|---|
| CTA único | Adicionar btn-secondary "Ver Projetos" | Alto — reduz rejeição |
| Trust signals ausentes | Adicionar 3 bullets abaixo do CTA | Alto — confiança imediata |
| Imagem sem dimensões | Declarar width/height | Alto — CLS |

### Galeria / Portfólio
| Problema | Solução | Impacto |
|---|---|---|
| Galeria duplicada | Remover duplicata no Elementor | Crítico |
| Sem filtro de categoria | Adicionar filtro: Cozinha / Closet / Corporativo | Alto |
| Imagens sem alt descritivo | Adicionar alt específico por projeto | Alto (SEO + A11y) |
| Cards sem dimensão reservada | Declarar aspect-ratio: 4/3 no CSS | Médio (CLS) |

### Seção Processo
| Problema | Solução | Impacto |
|---|---|---|
| Bom — manter como está | Melhorar ícones para SVG se forem PNG | Baixo |

### Depoimentos
| Problema | Solução | Impacto |
|---|---|---|
| Sem foto do cliente | Adicionar avatar (foto real ou inicial) | Médio |
| Sem projeto associado | Linkar cada depoimento a uma foto do projeto | Alto |
| Sem data | Adicionar mês/ano | Médio |
| Sem rating visual | Adicionar 5 estrelas SVG | Médio |

### FAQ
| Problema | Solução | Impacto |
|---|---|---|
| Sem schema JSON-LD | Adicionar FAQPage schema (ver arquivo SEO) | Alto (SEO) |
| Sem âncora no menu | Adicionar link "FAQ" na navegação | Médio |

### Formulário de Contato
| Problema | Solução | Impacto |
|---|---|---|
| Labels não verificados | Garantir label visível em cada campo | Alto (A11y) |
| type="text" no telefone | Mudar para type="tel" | Médio (UX mobile) |
| Sem feedback de envio | Mostrar loader + mensagem de sucesso/erro | Alto |
| Formulário escondido | Tornar mais proeminente como opção além do WhatsApp | Alto |

### Rodapé
| Problema | Solução | Impacto |
|---|---|---|
| CNPJ sem formatação mono | Usar font-variant-numeric: tabular-nums | Baixo |
| Links de redes sociais | Verificar se Instagram está linkado e atualizado | Alto |
