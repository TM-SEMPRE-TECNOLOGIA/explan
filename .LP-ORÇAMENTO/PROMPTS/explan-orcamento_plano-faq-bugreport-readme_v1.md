# Plano — Explan LP-Orçamento: FAQ, Bug Report, Guia e README

> [!TIP]
> **Nome sugerido para o arquivo:**
> ```
> explan-orcamento_plano-faq-bugreport-readme_v1.md
> ```
> Segue o padrão `[projeto]_[escopo]_[versão]` — legível, sem espaços, compatível com Git e sistemas de arquivo Windows/Mac/Linux.

## Contexto e Diagnóstico

O projeto é um sistema de orçamento para a **Explan Móveis Planejados** (Goiânia/GO), composto por arquivos HTML standalone que usam `localStorage` para persistência. O arquivo principal é o **sprint-09.html** (orçador), que gera PDFs via **orçamento-editor.html**, contratos via **Contrato-de Serviço - template.html** e apresentações via **apresentacao-editor.html**.

---

## 🗺️ Mapa dos Arquivos de Itens e Valores

### `sprint-09.html` — **Arquivo principal (orçador)**

| Linha | O que controla |
|---|---|
| **874–911** | `ITEM_SEL_TEMPLATE` — **Catálogo completo de itens** com preços unitários. É aqui que estão todos os itens do dropdown (Caixotes, Painéis, Portas, Lineares, Por unidade) e seus preços em R$/m², R$/ml ou R$/un |
| **913–926** | `FOTOS_PADRAO` — Mapeamento de ambiente → foto padrão |
| **936–943** | `calcEnvDiscount()` — **Regras de desconto por material**: Chapa 15 = −10%, Häfele = −5%, FGV = −15%, Branco interno = −5% |
| **1063–1146** | `recalc()` — **Motor de cálculo principal**: soma itens × quantidade, aplica desconto de material por ambiente, soma frete + comissões + acréscimos, exibe total final |
| **749–770** | Card "Variáveis do Projeto" — campos de **Frete (R$)**, **Comissão Vendedor (%)**, **Comissão Arquiteto (%)**, **Acréscimos Extras (%)** |
| **717–722** | Select **Forma de Pagamento** — as 4 opções com % de desconto mencionado no texto |

### `orçamento-editor.html` — **Gerador de PDF**

| Linha | O que controla |
|---|---|
| **772–810** | Lê `localStorage['explan_oc']` e injeta dados do cliente, total e descontos na capa e resumo do PDF |
| **815–829** | Mapa foto → ambiente para o PDF |
| **954–960** | **Atualiza os cards de pagamento** no resumo: À vista, 50/50 e parcelado em 6× |
| **839** | Calcula número total de páginas |

### `Contrato-de Serviço - template.html` e `Contrato-de-Producao-template.html`
- Leem `localStorage['explan_oc']` para preencher o nome do cliente, total e condições de pagamento.

---

## User Review Required

> [!IMPORTANT]
> **Qual é o seu número de WhatsApp pessoal?**
> Ele será embutido como link `https://wa.me/55XXXXXXXXXXX` na página de "Relatar Bug". Por favor, confirme no formato: `55 + DDD + número` (ex: `5562999998888`).

> [!IMPORTANT]
> **O projeto tem navegação entre páginas?**
> Atualmente `sprint-09.html` é o orçador principal. O FAQ e o Bug Report vão ser páginas HTML separadas linkadas a partir de onde? Sugestão: adicionar botões na barra lateral esquerda (`nav-sidebar`) do sprint-09.

> [!WARNING]
> **Política de backup/Legado**: conforme acordado, antes de qualquer edição nos arquivos originais, criaremos cópias datadas dentro da pasta `Legado/`. Nenhum arquivo original será modificado sem cópia prévia.

---

## Open Questions

> [!NOTE]
> As páginas de FAQ e Bug Report devem seguir exatamente o mesmo design (paleta olive/cream/green, fonte Archivo) do sprint-09? Plano: sim, por padrão será consistente.

---

## Proposed Changes

### Fase 0 — Backup em /Legado *(não modifica originais)*

#### [NEW] `Legado/sprint-09_backup_2026-06-22.html`
#### [NEW] `Legado/orçamento-editor_backup_2026-06-22.html`
Cópias dos dois arquivos que serão modificados.

---

### Fase 1 — `README.md` *(novo arquivo na raiz do projeto)*

#### [NEW] `README.md`
Documento de referência técnica e onboarding do projeto. Conteúdo:
- Visão geral do sistema
- Estrutura de arquivos e responsabilidades
- **Mapa de onde ficam os itens e preços** (tabela igual ao diagnóstico acima)
- Como adicionar/editar itens no catálogo
- Como ajustar descontos de material
- Como publicar e usar o sistema
- Histórico de versões (sprint-01 ao sprint-09)

---

### Fase 2 — `faq.html` *(nova página)*

#### [NEW] `faq.html`
Página de Perguntas Frequentes no estilo do sistema. Design premium com:
- Header com logo Explan + navegação de volta ao orçador
- Seções de FAQ com acordeão animado (expandir/colapsar)
- Categorias: Sobre o Orçamento, Materiais e Descontos, Pagamento, Prazo, Entrega e Garantia
- ~15 perguntas pré-preenchidas com respostas da Explan
- Botão de contato via WhatsApp no rodapé
- Mesmo design visual do sprint-09 (olive/cream/green + Archivo)

**Perguntas cobertas:**
1. O orçamento tem validade?
2. Posso parcelar no cartão de crédito?
3. Quais materiais são usados?
4. O que é a Chapa 15 e como funciona o desconto?
5. O que inclui o frete?
6. Qual é o prazo de produção e instalação?
7. O projeto 3D tem custo?
8. Posso alterar o projeto após fechar?
9. Como funciona a garantia?
10. A medição é gratuita?
11. Qual a diferença entre ferragem Blum, Häfele e FGV?
12. Posso ver os materiais antes de fechar?
13. O que significa "interior branco"?
14. Como funciona o pagamento por etapas?
15. Tenho dúvidas — como falo com a Explan?

---

### Fase 3 — `bug-report.html` *(nova página)*

#### [NEW] `bug-report.html`
Página para o usuário relatar problemas ou sugestões, com envio direto ao WhatsApp pessoal do Thiago.

**Funcionamento:**
1. Formulário com campos: Nome, E-mail (opcional), Tipo (Bug / Sugestão / Melhoria), Descrição do problema, e campo para cole o contexto (ex: qual orçamento estava fazendo)
2. Ao clicar "Enviar via WhatsApp", o sistema monta uma mensagem pré-formatada e abre `https://wa.me/55[SEU_NUMERO]?text=[mensagem_codificada]`
3. A mensagem terá header: `🐛 *BUG REPORT — Explan Orçador*`, tipo, descrição, data/hora automática e user-agent do navegador

**Design:** mesmo tema do projeto, com formulário clean e um call-to-action verde de WhatsApp com ícone.

---

### Fase 4 — Modificar `sprint-09.html` *(adicionar links de navegação)*

#### [MODIFY] `sprint-09.html`
Adicionar na `nav-sidebar` dois novos botões:
- 📋 FAQ → abre `faq.html` em nova aba
- 🐛 Bug → abre `bug-report.html` em nova aba

E um link discreto no `footer` para as mesmas páginas.

---

## Verification Plan

### Manual
- Abrir `faq.html` e testar todos os acordeões
- Clicar no botão WhatsApp e verificar que a mensagem pré-formatada aparece no WhatsApp Web
- Abrir `bug-report.html`, preencher e clicar em "Enviar via WhatsApp" — confirmar URL correta
- Abrir `sprint-09.html` e confirmar que os botões de FAQ e Bug aparecem na nav-sidebar
- Confirmar que os backups existem em `Legado/` antes de qualquer modificação

### Conferência do README
- Verificar que todos os números de linha do mapa de itens/valores batem com o arquivo atual
