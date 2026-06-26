# Explan — Orçamento Express
**Ferramenta interna de orçamento para vendedores da Explan Móveis Planejados**

> Cliente: Ygor Augusto Patrão · Desenvolvedor: Thiago Nascimento (TM Sempre Tecnologia)  
> Stack: HTML + CSS + JS puro · Hospedagem: GitHub Pages (sem servidor)  
> Iniciado em: 08/06/2026 · Última atualização: 12/06/2026

---

## Visão Geral

Ferramenta usada pelo vendedor **durante a reunião presencial** para montar orçamento em tempo real, gerar PDF profissional, criar apresentação visual dos ambientes e preencher contrato — tudo no browser, sem backend.

**Referência visual:** [https://explanmoveisplanejados.com.br](https://explanmoveisplanejados.com.br)  
**Design System:** Archivo (tipografia única), Verde Musgo `#6B8E5E`, Olive `#41422F`, Cream `#EBE6DD`

---

## Estrutura do Repositório

```
.LP-ORÇAMENTO/
├── PLAN/                              ← documentação de projeto
│   ├── 1 - PLANO.md                   ← este arquivo
│   ├── 2 - ARQUITETURA.md             ← stack atual + futura (Supabase, WhatsApp)
│   ├── 3 - ROADMAP.md                 ← fases e status por funcionalidade
│   └── 4 - PROJEÇÃO DO FUTURO.md      ← ideias e funcionalidades planejadas
│
├── EM DESENVOLVIMENTO/                ← arquivos ativos do app
│   ├── sprint-09.html                 ← app principal (versão corrente)
│   ├── login.html                     ← tela de login (nome fixo, nunca renomear)
│   ├── pdf-preview.html               ← preview/geração de PDF A4 dinâmico
│   ├── apresentacao-editor.html       ← editor visual de apresentação (sem preços)
│   ├── contrato-servico.html          ← template de contrato HTML auto-fill
│   └── Legado/                        ← sprints anteriores
│       ├── sprint-06.html
│       └── sprint-04.html / sprint-05.html / sprint-07.html
│
├── design-system/                     ← documentação do Design System v2.0
│   ├── 01-PALETA-CORES.md
│   ├── 02-TIPOGRAFIA.md
│   ├── design-system.css
│   └── README.md
│
├── imagens-ambientes/                 ← 23 fotos de referência (18 Manus + 5 Stitch)
├── PROMPTS/                           ← briefings e prompts de geração de imagens
│   ├── naspalavrasdodono.md           ← conversa original com Ygor (requisitos)
│   ├── PROMPTS-GPT-IMAGE-2.md         ← 21 prompts para geração via GPT Image 2
│   └── SPRINT-01-INICIO.md
│
├── catalogo-itens.json                ← catálogo de itens com preços (fonte de dados)
├── catalogo-itens.xlsx                ← planilha gerada do JSON (não editar diretamente)
├── README_TO_SAVE.md                  ← guia de organização de arquivos
└── RELATORIO-CORRECOES.md             ← log de bugs corrigidos
```

---

## Funcionalidades Implementadas ✓

### Fluxo Principal
- **Login com autenticação local** → credenciais em `explan_users` no localStorage
- **App de orçamento página única** — sidebar sticky com totalizador em tempo real
- **Ambientes dinâmicos** — adicionar/remover ambientes; cada um tem seu catálogo

### Catálogo e Preços
- Itens mapeados por categoria (caixotes, painéis, ferragens, rodapés, portas, etc.)
- Select com busca, preços do `catalogo-itens.json`
- **Adição manual de itens** — form inline por ambiente (nome, unidade, preço, qtd)

### Sistema de Descontos por Ambiente
Cada ambiente tem sua própria configuração de materiais:

| Seleção | Desconto |
|---|---|
| Chapa 15 (MDF) | −10% em todos os itens MDF |
| Ferragem Häfele | −5% |
| Ferragem FGV | −15% |
| Caixote Cor Branca Interno | −5% |
| Combinações | Cumulativos |

### Geração de Documentos
- **PDF Preview** — 5 páginas A4: capa, institucional, ambientes, resumo, pagamentos
- **Contrato de Serviço** — auto-fill com placeholders do orçamento
- **Apresentação Visual** — editor com slides A4 por ambiente, upload de imagens, sem preços

### Sidebar de Navegação (esquerda)
- Perfil do vendedor (nome, cargo, email) — salvo em `explan_perfil`
- Clientes com histórico — salvo em `explan_clientes`
- Projetos/orçamentos salvos — salvo em `explan_projetos`, com opção de carregar/editar

### Design System v2.0
```css
font-family: 'Archivo', sans-serif;  /* única fonte — pesos 300/400/500/600/700 */
--green:  #6B8E5E;  /* Verde Musgo — botões primários, destaques */
--olive:  #41422F;  /* Texto escuro, fundo escuro */
--cream:  #EBE6DD;  /* Fundo claro, cards */
```

---

## Pendências Imediatas

| Item | Responsável | Impacto |
|---|---|---|
| Preencher preços reais em `catalogo-itens.json` | **Ygor** | Sistema usa null sem preços |
| Deploy no GitHub Pages | **Thiago** | Ferramenta ainda só roda local |

---

## Roadmap Resumido

| Fase | Status | Descrição |
|---|---|---|
| Fase 1 — MVP Local | ✅ Concluída | App funcional offline, PDF, contrato, apresentação |
| Fase 2 — Supabase | 🔜 Planejada | Auth real + banco de dados na nuvem |
| Fase 3 — Integrações | 🔮 Futuro | Evolution API (WhatsApp), EmailJS, dashboard Ygor |

Detalhes completos em `3 - ROADMAP.md` e `2 - ARQUITETURA.md`.

---

## Contexto de Negócio

> "Para não dar tempo do cliente nem pensar" — Ygor Patrão

O vendedor usa a ferramenta durante a reunião, monta o orçamento em tempo real com o cliente, gera o PDF e o contrato na hora. Objetivo: **profissionalismo e fechamento imediato**, sem depender de planilhas manuais.

**Fluxo completo:**
1. Vendedor abre `login.html` no notebook/tablet
2. Faz login → redirecionado para `sprint-09.html`
3. Preenche dados do cliente, adiciona ambientes e itens
4. Configura materiais por ambiente → descontos aplicados automaticamente
5. Visualiza total em tempo real na sidebar direita
6. Gera PDF, Contrato ou Apresentação com um clique
7. Salva o projeto para consulta futura

---

## Histórico de Sprints

| Sprint | Data | Entregável Principal |
|---|---|---|
| Sprint 01 | 08/06/2026 | Protótipos (wizard + página única), PDF preview, contrato, testes E2E 25/28 |
| Sprint 02–03 | 09/06/2026 | GSAP/AOS, PDF dinâmico, contrato auto-fill, 23 imagens, catálogo JSON |
| Sprint 06 | 10/06/2026 | Correções de bugs (dados cliente, desconto zerado, sidebar) |
| Sprint 08 | 11/06/2026 | Design System v2.0 — Archivo, verde musgo `#6B8E5E` |
| Sprint 09 | 11–12/06/2026 | login.html, sprint-09.html completo, apresentacao-editor.html, Excel catálogo, plan/ |

---

*Desenvolvido por TM Sempre Tecnologia — thiagonascimentobarbosapro.com*
