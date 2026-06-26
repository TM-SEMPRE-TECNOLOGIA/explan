# Roadmap — Explan Orçamento Express

> Última atualização: 12/06/2026

---

## ✅ Fase 1 — MVP Local (Concluída)

| Feature | Sprint | Data |
|---|---|---|
| Protótipo wizard 4 etapas | Sprint 01 | 08/06/2026 |
| Protótipo página única (app principal) | Sprint 01 | 08/06/2026 |
| PDF preview dinâmico (5 páginas A4) | Sprint 01 | 08/06/2026 |
| Template contrato auto-fill | Sprint 01 | 08/06/2026 |
| Testes E2E Playwright (25/28) | Sprint 01 | 08/06/2026 |
| Animações GSAP/AOS | Sprint 02 | 09/06/2026 |
| Bridge localStorage orçamento → PDF | Sprint 02 | 09/06/2026 |
| Catálogo de itens JSON (10 categorias) | Sprint 02 | 09/06/2026 |
| 21 prompts GPT Image 2 | Sprint 02 | 09/06/2026 |
| Contrato de Produção template | Sprint 03 | 09/06/2026 |
| 23 imagens de ambientes (0 Unsplash) | Sprint 03 | 09/06/2026 |
| Correções bugs dados/desconto/sidebar | Sprint 06 | 10/06/2026 |
| Design System v2.0 (Archivo, verde musgo `#6B8E5E`) | Sprint 08 | 11/06/2026 |
| login.html (tela de login dedicada) | Sprint 09 | 11/06/2026 |
| sprint-09.html — app principal refatorado | Sprint 09 | 11/06/2026 |
| Materiais por ambiente (config individual, não global) | Sprint 09 | 11/06/2026 |
| Sidebar nav esquerda (Perfil, Clientes, Projetos) | Sprint 09 | 11/06/2026 |
| Adição manual de itens por ambiente | Sprint 09 | 11/06/2026 |
| Salvar/carregar projetos (localStorage) | Sprint 09 | 11/06/2026 |
| Botão "Gerar Apresentação" | Sprint 09 | 11/06/2026 |
| apresentacao-editor.html (slides A4, upload de imagens, sem preços) | Sprint 09 | 11/06/2026 |
| Redesign card Variáveis do Projeto (Design System v2) | Sprint 09 | 11/06/2026 |
| Excel do catálogo (3 abas: Completo, Consolidado, Ambientes) | Sprint 09 | 11/06/2026 |
| Documentação PLAN/ (PLANO, ARQUITETURA, ROADMAP, Projeção do Futuro) | Sprint 09 | 11/06/2026 |
| README_TO_SAVE.md — guia de organização de arquivos | Sprint 09 | 12/06/2026 |

---

## 🔴 Alta Prioridade — Próximo

| Feature | Motivo |
|---|---|
| Preencher preços em `catalogo-itens.json` | Aguardando Ygor — sem preços o sistema usa null |
| Deploy no GitHub Pages | Ferramenta ainda só roda local |
| html2pdf.js — download real do PDF | Hoje o PDF só abre no browser, não baixa arquivo |

---

## 🟠 Média Prioridade — Sprint 10

| Feature | Descrição |
|---|---|
| Responsividade mobile refinada | Testar em tablets reais usados nas reuniões |
| Verificar contraste AAA | Todas as combinações de cor do Design System |
| Melhorar editor de apresentação | Drag de imagem dentro da zona, multi-slide por ambiente |
| Alinhamento contrato HTML ao CONTRATO.docx | Garantir 12 cláusulas, Responsável Financeiro Solidário |

---

## 🟡 Fase 2 — Supabase (Planejada)

| Feature | Descrição |
|---|---|
| Supabase Auth | Substituir localStorage de login por auth real |
| Supabase DB — Clientes | Clientes e histórico na nuvem |
| Supabase DB — Orçamentos | Snapshots dos orçamentos persistidos por usuário |
| Migração progressiva | localStorage → Supabase sem quebrar fluxo atual |

Guia técnico em `2 - ARQUITETURA.md`.

---

## 🟢 Fase 3 — Integrações Externas (Futuro)

| Feature | Descrição |
|---|---|
| EmailJS | Notificação ao Ygor quando orçamento for gerado |
| Evolution API (WhatsApp) | Mensagem automática ao cliente após fechamento |
| Dashboard Ygor | Visão de todos os orçamentos gerados pelos vendedores |
| Multi-usuário | Cada vendedor com seu login e histórico separado |

Detalhes em `4 - PROJEÇÃO DO FUTURO.md`.

---

## Bloqueadores Externos

| Item | Impacto | Aguardando |
|---|---|---|
| Preços reais em `catalogo-itens.json` | Orçamentos sem valor financeiro correto | **Ygor** |
| Validação do fluxo em reunião real | Ajustes UX só após teste com cliente real | **Ygor/vendedor** |
