# 📦 Explan LP-Orçamento — Sistema de Orçamento Expresso

> Sistema interno para geração de orçamentos, contratos e apresentações de móveis planejados para a **Explan Móveis Planejados** — Goiânia/GO.
>
> Desenvolvido por [TM · Sempre Tecnologia](https://thiagonascimentobarbosapro.com) · 2026

---

## 📁 Estrutura de Arquivos

```
EM DESENVOLVIMENTO/
│
├── sprint-09.html               ← ⭐ ARQUIVO PRINCIPAL (Orçador)
├── orçamento-editor.html        ← Gerador de PDF de Orçamento
├── Contrato-de Serviço - template.html   ← Template de Contrato de Serviço
├── Contrato-de-Producao-template.html    ← Template de Contrato de Produção
├── apresentacao-editor.html     ← Gerador de Apresentação
├── login.html                   ← Tela de Login (em desenvolvimento)
│
├── faq.html                     ← Página de Perguntas Frequentes
├── bug-report.html              ← Página de Relatar Bug / Sugestão
├── README.md                    ← Este arquivo
│
├── Legado/                      ← Versões anteriores (backups datados)
│   ├── sprint-09_backup_2026-06-22.html
│   ├── orcamento-editor_backup_2026-06-22.html
│   └── Versões/                 ← Sprints históricos (01 ao 07)
│
└── karla e luiz/                ← Projeto de exemplo / referência real
```

---

## 🗺️ Onde ficam os Itens e Valores

> **IMPORTANTE:** O arquivo que concentra 95% da lógica de precificação é o `sprint-09.html`.

### `sprint-09.html`

| Seção / Linha | O que controla | Como editar |
|---|---|---|
| **`ITEM_SEL_TEMPLATE`** (~linha 876) | **Catálogo completo de itens** com preços unitários — todos os produtos do dropdown por categoria (Caixotes, Painéis, Portas, Lineares, Por unidade) | Editar os valores após o `\|` no formato `Nome\|PREÇO\|unidade` |
| **`FOTOS_PADRAO`** (~linha 913) | Mapeamento de nome de ambiente → foto padrão do PDF | Trocar o caminho da imagem |
| **`calcEnvDiscount()`** (~linha 936) | **Tabela de descontos por material**: Chapa 15 = −10%, Häfele = −5%, FGV = −15%, Branco interno = −5% | Alterar os números percentuais dentro da função |
| **`discLabel()`** (~linha 945) | Rótulos exibidos para cada desconto de material | Editar os textos dos labels |
| **`recalc()`** (~linha 1063) | **Motor de cálculo principal** — soma itens × quantidade por ambiente, aplica descontos, soma frete + comissões + acréscimos, exibe total final | Não alterar sem entender o fluxo completo |
| **Card "Variáveis do Projeto"** (~linha 749) | Campos de entrada: **Frete (R$)**, **Comissão Vendedor (%)**, **Comissão Arquiteto (%)**, **Acréscimos Extras (%)** | São campos editáveis diretamente na interface |
| **Forma de Pagamento** (~linha 717) | As 4 opções de pagamento listadas no `<select>` | Editar os `<option>` no HTML |

### `orçamento-editor.html`

| Seção / Linha | O que controla |
|---|---|
| **Script principal** (~linha 772) | Lê `localStorage['explan_oc']` e injeta: nome do cliente, total geral, descontos aplicados, ambientes com itens |
| **Cards de pagamento** (~linha 954) | Calcula e exibe os valores: À vista, 50/50 e parcelado em 6× com base no `total_geral` |
| **Tabela de resumo** (~linha 916) | Monta as linhas de ambientes + subtotal + linha de desconto no PDF |

### Contratos (`Contrato-de Serviço` e `Contrato-de-Producao`)
- Leem `localStorage['explan_oc']` para preencher nome, total, condições e data.

---

## 🧮 Fluxo de Cálculo

```
Para cada ambiente:
  ┌─ Soma todos os itens: Preço unitário × Quantidade
  ├─ Calcula desconto de material (Chapa + Ferragem + Cor)
  └─ Subtotal do ambiente = Soma bruta × (1 - desconto%)

Total final:
  ┌─ Grand Subtotal = soma dos subtotais de todos os ambientes
  ├─ + Frete (R$ fixo)
  ├─ + Comissão Vendedor (% sobre grand subtotal)
  ├─ + Comissão Arquiteto (% sobre grand subtotal)
  └─ + Acréscimos Extras (% sobre grand subtotal)
```

---

## ✏️ Como Adicionar um Novo Item ao Catálogo

1. Abra `sprint-09.html` em um editor de texto
2. Localize a constante `ITEM_SEL_TEMPLATE` (~linha 876)
3. Dentro do `<optgroup>` desejado, adicione uma linha no formato:
   ```html
   <option value="Nome do Item|PREÇO_SEM_VIRGULA|unidade">Nome do Item — R$ PREÇO/unidade</option>
   ```
   **Exemplo:**
   ```html
   <option value="Painel Cimentício|3200|m²">Painel Cimentício — R$ 3.200/m²</option>
   ```
4. Salve e recarregue o arquivo no navegador

---

## 🎨 Como Alterar um Desconto de Material

1. Abra `sprint-09.html`
2. Localize a função `calcEnvDiscount()` (~linha 936):
   ```javascript
   function calcEnvDiscount(cfg) {
     let d = 0;
     if (cfg.chapa === '15') d += 10;     // ← Chapa 15: −10%
     if (cfg.ferragem === 'hafele') d += 5; // ← Häfele: −5%
     if (cfg.ferragem === 'fgv') d += 15;  // ← FGV: −15%
     if (cfg.cor === 'branco') d += 5;    // ← Branco int.: −5%
     return d;
   }
   ```
3. Altere os números conforme necessário e salve

---

## 💾 Persistência de Dados

O sistema usa exclusivamente o **`localStorage`** do navegador:

| Chave | Conteúdo |
|---|---|
| `explan_oc` | Dados do orçamento atual (cliente + ambientes + totais) — usado para gerar PDF, contrato e apresentação |
| `explan_perfil` | Dados do perfil do vendedor (nome, cargo, email, WhatsApp) |
| `explan_projetos` | Array de projetos salvos (histórico completo) |

> ⚠️ **Atenção:** os dados ficam apenas no navegador local. Limpar o cache ou trocar de navegador apaga os projetos salvos. Para backup real, exporte o projeto como JSON (funcionalidade futura).

---

## 🖨️ Fluxo de Geração de Documentos

```
sprint-09.html
    │
    ├─ [Gerar PDF] ──────────────→ orçamento-editor.html
    │                               (lê localStorage, monta páginas A4, imprime)
    │
    ├─ [Gerar Contrato] ─────────→ Contrato-de Serviço - template.html
    │                               (preenche campos com dados do cliente/total)
    │
    └─ [Gerar Apresentação] ─────→ apresentacao-editor.html
                                    (slides de apresentação do projeto)
```

---

## 🆘 Suporte

- **Perguntas Frequentes:** [`faq.html`](faq.html)
- **Relatar Bug ou Sugestão:** [`bug-report.html`](bug-report.html)
- **Desenvolvedor:** [Thiago Nascimento — TM · Sempre Tecnologia](https://thiagonascimentobarbosapro.com)

---

## 📋 Histórico de Versões

| Versão | Arquivo | Principais mudanças |
|---|---|---|
| Sprint 01–04 | `Legado/` | Protótipos iniciais, página única |
| Sprint 05–06 | `Legado/` | Layout de ambientes, catálogo inicial |
| Sprint 07 | `Legado/` | Refatoração de materiais |
| Sprint 08 | — | Versão interna |
| **Sprint 09** | `sprint-09.html` | ⭐ Versão atual — Config por ambiente, descontos individuais, geração de PDF/Contrato/Apresentação, painel de projetos e clientes |

---

*Uso exclusivo Explan Móveis Planejados · Goiânia – GO · 2026*
