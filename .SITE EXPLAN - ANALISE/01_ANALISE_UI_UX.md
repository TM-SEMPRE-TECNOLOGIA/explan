# Análise UI/UX — Explan Móveis Planejados
### explanmoveisplanejados.com.br · Diagnóstico e Projeção de Melhorias

---

## SCORE ATUAL ESTIMADO: 6.2 / 10

| Dimensão | Nota | Justificativa |
|---|---|---|
| Visual e Identidade | 7.5 | Design limpo, coerente com o segmento |
| Navegação e Arquitetura | 5.5 | Scroll infinito sem âncoras claras no menu |
| Conversão (CTA) | 6.0 | WhatsApp repetido 9x — sem funil estruturado |
| Mobile Experience | 6.5 | Responsivo, mas hierarquia quebra em telas pequenas |
| Velocidade e Performance | 7.0 | WebP e SVG usados, mas Elementor pesa |
| Conteúdo e Hierarquia | 5.5 | Textos genéricos, pouca prova social visual |
| Acessibilidade | 4.5 | Sem atributos alt visíveis, contraste não verificado |
| Confiança e Credibilidade | 6.5 | CNPJ visível, depoimentos básicos — falta profundidade |

---

## PROBLEMAS IDENTIFICADOS

### 🔴 Críticos (impactam conversão diretamente)

**1. CTA único e repetitivo**
- "Solicite Seu Orçamento" aparece 9 vezes, todos indo para WhatsApp
- Não há funil: o visitante que não está pronto para comprar não tem opção
- **Impacto:** leads frios descartados, sem nutrição

**2. Galeria de portfólio duplicada no layout**
- A mesma galeria aparece duas vezes no scroll
- Sinal de erro de configuração no Elementor
- **Impacto:** experiência quebrada, passa impressão de descuido

**3. Ausência de âncoras funcionais no menu**
- Navegação lateral off-canvas sem links claros por seção
- Usuário que quer ir direto ao portfólio ou FAQ precisa rolar tudo
- **Impacto:** taxa de rejeição elevada em mobile

**4. Formulário lateral sem destaque**
- Formulário com campos existe mas não está em posição de destaque
- Compete visualmente com o CTA WhatsApp sem hierarquia clara
- **Impacto:** leads perdidos que preferem formulário ao WhatsApp

### 🟡 Importantes (afetam experiência e percepção de valor)

**5. Depoimentos fracos**
- Três textos curtos sem foto, sem projeto associado, sem data
- Nomes genéricos sem sobrenome completo
- **Melhoria:** vincular depoimento à foto do projeto executado

**6. Hero sem ancoragem visual do produto**
- A frase principal é forte, mas o fundo/imagem do hero não é explicitamente mostrado
- Deve abrir com a melhor foto de projeto da empresa

**7. Seção "Quem Somos" muito curta (~80 palavras)**
- Não humaniza a empresa, não apresenta o fundador ou a história
- Segmento de alto ticket exige conexão emocional

**8. FAQ sem estrutura de schema**
- Perguntas excelentes (8 questões relevantes) mas sem markup JSON-LD
- Oportunidade de rich snippet perdida no Google

**9. Sem urgência ou escassez**
- Nenhum elemento que crie senso de timing (agenda, vagas, promoção sazonal)

### 🟢 Pontos Positivos a Manter

- Logo SVG leve e identidade visual coerente
- Processo de 5 etapas bem visualizado
- Imagens WebP otimizadas
- WhatsApp integrado via Joinchat (boa UX de contato)
- CNPJ e endereço físico visíveis (confiança)
- Showroom como diferencial bem posicionado

---

## PROJEÇÃO DE MELHORIAS (Roadmap)

### FASE 1 — Quick Wins (0–2 semanas, sem redesign)

| # | Ação | Esforço | Impacto |
|---|---|---|---|
| 1.1 | Corrigir galeria duplicada | Baixo | Alto |
| 1.2 | Adicionar schema FAQ (JSON-LD) | Baixo | Alto (SEO) |
| 1.3 | Criar CTA secundário: "Ver Projetos" na hero | Baixo | Médio |
| 1.4 | Adicionar atributo `alt` descritivo em todas as fotos | Baixo | Alto (SEO + Acessibilidade) |
| 1.5 | Inserir âncoras no menu para cada seção | Baixo | Médio |
| 1.6 | Adicionar data e foto de perfil nos depoimentos | Baixo | Médio |

### FASE 2 — Melhorias Estruturais (2–6 semanas)

| # | Ação | Esforço | Impacto |
|---|---|---|---|
| 2.1 | Novo bloco "Nossos Projetos" com filtro por categoria | Médio | Alto |
| 2.2 | Seção "Quem Somos" expandida com foto do time | Médio | Alto |
| 2.3 | Adicionar bloco de logo dos fornecedores (Duratex, Arauco) | Baixo | Alto (confiança) |
| 2.4 | Criar landing page separada para Projetos Corporativos | Alto | Alto |
| 2.5 | Inserir formulário de leads com isca digital ("Guia de Móveis Planejados") | Médio | Alto |
| 2.6 | Adicionar número de projetos entregues e anos de mercado | Baixo | Alto (prova social) |

### FASE 3 — Otimização Avançada (6–12 semanas)

| # | Ação | Esforço | Impacto |
|---|---|---|---|
| 3.1 | Implementar chat com qualificação por perguntas (tipo Typeform) | Alto | Alto |
| 3.2 | Criar blog com conteúdo SEO (ver arquivo SEO) | Alto | Alto (longo prazo) |
| 3.3 | A/B test hero: imagem cozinha vs. closet | Médio | Médio |
| 3.4 | Vídeo tour do showroom na seção "Quem Somos" | Médio | Alto |
| 3.5 | Migrar builder de Elementor para bloco nativo ou Bricks (performance) | Alto | Médio |

---

## WIREFRAME TEXTUAL — Hero Ideal

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo]                    [Portfólio] [Processo] [FAQ] [Contato]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TÍTULO H1:                         [FOTO DO MELHOR PROJETO     │
│  "Móveis planejados                  — cozinha ou closet        │
│   pensados para                      high-end, 60% da tela]    │
│   além do agora"                                                │
│                                                                  │
│  SUBTÍTULO:                                                      │
│  "Projetos residenciais e comerciais                            │
│   com clareza e transparência"                                  │
│                                                                  │
│  [● Solicite Orçamento]  [○ Ver Projetos]                       │
│                                                                  │
│  ✓ Projeto 3D grátis  ✓ Garantia até 5 anos  ✓ Showroom GO    │
└─────────────────────────────────────────────────────────────────┘
```

---

## MÉTRICAS PARA ACOMPANHAR APÓS MELHORIAS

- Taxa de conversão do site (visita → WhatsApp / formulário)
- Tempo médio na página
- Taxa de rejeição (bounce rate)
- Scroll depth (até onde o usuário chega)
- Origem dos leads (orgânico / pago / direto)
