# Estratégia de SEO — Explan Móveis Planejados
### Meta: Rankear para as principais buscas de móveis planejados em Goiânia

---

## DIAGNÓSTICO SEO ATUAL

### O que já existe (positivo)
- Title tag: "Explan | Móveis planejados em Goiânia" ✓
- Palavra-chave principal na URL raiz ✓
- Conteúdo textual com menções a Goiânia (geo-sinal) ✓
- FAQ com 8 perguntas relevantes (conteúdo rico sem schema) ✓
- Imagens WebP (velocidade) ✓
- CNPJ e endereço físico visíveis (E-E-A-T) ✓

### O que está faltando (crítico)
- Schema JSON-LD: LocalBusiness, FAQPage, BreadcrumbList ✗
- Google Business Profile otimizado (não verificado) ✗
- Meta description personalizada ✗
- Headings hierárquicos H1 → H2 → H3 estruturados ✗
- Blog / conteúdo indexável ✗
- Backlinks de qualidade ✗
- Alt text descritivo nas imagens ✗
- Sitemap.xml e robots.txt otimizados ✗

---

## PESQUISA DE PALAVRAS-CHAVE

### Cluster Principal — Fundo de Funil (alta intenção de compra)

| Palavra-chave | Volume Est. | Concorrência | Prioridade |
|---|---|---|---|
| móveis planejados goiânia | 1.300/mês | Média | 🔴 Principal |
| cozinha planejada goiânia | 720/mês | Média | 🔴 Principal |
| closet planejado goiânia | 480/mês | Baixa | 🔴 Principal |
| dormitório planejado goiânia | 320/mês | Baixa | 🔴 Principal |
| marcenaria planejada goiânia | 210/mês | Baixa | 🟡 Secundária |
| móveis sob medida goiânia | 390/mês | Média | 🔴 Principal |
| móveis planejados setor bueno | 90/mês | Baixa | 🟡 Secundária |

### Cluster Secundário — Meio de Funil (pesquisa comparativa)

| Palavra-chave | Volume Est. | Prioridade |
|---|---|---|
| quanto custa móveis planejados goiânia | 260/mês | 🟡 |
| melhor marcenaria goiânia | 170/mês | 🟡 |
| móveis planejados com garantia goiânia | 90/mês | 🟡 |
| projeto 3d móveis planejados goiânia | 70/mês | 🟢 |
| showroom móveis planejados goiânia | 50/mês | 🟢 |

### Cluster de Blog — Topo de Funil (conteúdo educativo)

| Tema de artigo | Palavra-chave alvo | Volume Est. |
|---|---|---|
| Como escolher móveis planejados | como escolher móveis planejados | 1.900/mês |
| Quanto custa uma cozinha planejada | preço cozinha planejada | 2.400/mês |
| Diferença MDF e MDP | mdf ou mdp móveis | 880/mês |
| Closet planejado: dicas de projeto | closet planejado pequeno quarto | 1.600/mês |
| Móveis planejados valem a pena? | móveis planejados valem a pena | 1.200/mês |

---

## AÇÕES ON-PAGE (Prioridade Alta)

### 1. Meta Description (adicionar urgente)
```
<meta name="description" content="Móveis planejados em Goiânia com projeto 3D grátis,
garantia de até 5 anos e showroom no Setor Bueno. Cozinhas, closets, dormitórios e projetos
corporativos sob medida. Solicite seu orçamento.">
```

### 2. Schema LocalBusiness (adicionar no `<head>`)
```json
{
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "name": "Explan Móveis Planejados",
  "url": "https://explanmoveisplanejados.com.br",
  "telephone": "+556299439-3938",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "R. C-235, 553",
    "addressLocality": "Goiânia",
    "addressRegion": "GO",
    "postalCode": "74230-180",
    "addressCountry": "BR"
  },
  "openingHours": ["Mo-Fr 08:00-18:00", "Sa 08:00-12:00"],
  "priceRange": "$$",
  "image": "https://explanmoveisplanejados.com.br/logo.svg"
}
```

### 3. Schema FAQPage (adicionar na seção FAQ)
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Qual o prazo de entrega dos móveis planejados?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "O prazo é de aproximadamente 30 dias para projetos de até 150m²."
      }
    },
    {
      "@type": "Question",
      "name": "A Explan oferece garantia?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim, a garantia varia de 1 a 5 anos dependendo do produto."
      }
    }
  ]
}
```

### 4. Otimização de Headings
```
H1: Móveis Planejados em Goiânia — Explan (apenas 1 por página)
H2: Por Que Escolher a Explan
H2: Nossos Projetos de Móveis Planejados
H2: Como Funciona Nosso Processo
H2: Perguntas Frequentes sobre Móveis Planejados em Goiânia
H3: Cozinhas Planejadas | Closets | Dormitórios | Corporativo
```

### 5. Alt text nas imagens
Padrão: `[tipo de ambiente] planejado [cidade] — Explan Móveis`
- `cozinha-planejada-goiania-explan-01.webp` → alt: "Cozinha planejada em Goiânia com acabamento premium — Explan Móveis Planejados"

---

## GOOGLE BUSINESS PROFILE (GBP) — Ações

1. **Verificar e otimizar** o perfil (se não verificado, prioridade máxima)
2. **Categorias:** Marcenaria (principal) + Loja de móveis + Decoração de interiores
3. **Fotos:** Mínimo 20 fotos de projetos + fachada + showroom + equipe
4. **Posts semanais:** Um projeto novo por semana com foto e descrição
5. **Respostas a avaliações:** Responder 100% com menção à palavra-chave
6. **Serviços:** Listar cozinha planejada, closet, dormitório, corporativo, etc.
7. **Perguntas e respostas:** Cadastrar as mesmas do FAQ do site

**Meta:** Aparecer no "Pacote Local" (mapa) para "móveis planejados goiânia"

---

## ESTRATÉGIA DE LINK BUILDING

### Baixo Esforço / Alto Retorno
- Cadastro em: Acha Tudo Goiânia, Guia Goiânia, Yelp Brasil, Abralimp
- Fornecedores: Pedir link de parceiro no site da Duratex/Arauco
- Associações: SINDIMÓVEL-GO, AGEMOB, Sindmóvel

### Médio Esforço
- Parcerias com arquitetos e designers de interiores de Goiânia (troca de links)
- Menção em portais como ArchDaily Brasil, Casa e Jardim, Viva Decora
- Guest post em blog de decoração goiana

---

## PLANO DE BLOG (12 artigos — 1 por mês)

| Mês | Título | Palavra-chave |
|---|---|---|
| 1 | Quanto custa uma cozinha planejada em Goiânia? | cozinha planejada preço goiânia |
| 2 | MDF ou MDP: qual escolher para seus móveis? | mdf mdp diferença |
| 3 | Closet planejado: tudo que você precisa saber | closet planejado goiânia |
| 4 | 7 erros ao contratar uma marcenaria | erros móveis planejados |
| 5 | Como é o processo de fabricação de móveis planejados? | como é feito móvel planejado |
| 6 | Móveis planejados para home office em Goiânia | home office planejado goiânia |
| 7 | Dormitório planejado: guia completo | dormitório planejado goiânia |
| 8 | Showroom de móveis planejados: o que avaliar | showroom móveis goiânia |
| 9 | Projeto 3D de móveis: como funciona? | projeto 3d móveis planejados |
| 10 | Móveis planejados para escritório em Goiânia | móveis corporativos goiânia |
| 11 | Garantia de móveis planejados: o que diz a lei? | garantia móveis planejados |
| 12 | Explan: 1 ano de projetos entregues em Goiânia | explan móveis planejados |

---

## KPIs DE SEO

| Métrica | Baseline | Meta 6 meses | Meta 12 meses |
|---|---|---|---|
| Posição "móveis planejados goiânia" | Desconhecida | Top 10 | Top 5 |
| Tráfego orgânico/mês | Desconhecido | +200 visitas | +800 visitas |
| Avaliações Google Business | Desconhecido | 30+ avaliações 4.8★ | 80+ avaliações |
| Rich snippets ativos | 0 | FAQ snippet | FAQ + Local |
| Artigos de blog indexados | 0 | 6 | 12 |
