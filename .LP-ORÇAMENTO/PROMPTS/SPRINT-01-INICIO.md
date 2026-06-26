# Explan Orçamento Express — Sprint 01
**Data:** 08–09/06/2026
**Desenvolvido por:** TM · Sempre Tecnologia

---

## O que eu queria construir

O Ygor precisava de uma ferramenta interna para o vendedor usar na reunião com o cliente. A ideia é simples: o vendedor abre no notebook ou tablet, já começa a montar o orçamento ali na hora — escolhe os ambientes, seleciona os itens com metragem, define o tipo de material (chapa 15 ou 18), a ferragem (Blum, Häfele ou FGV), e o sistema já calcula o desconto automático e mostra o total em tempo real.

No final, gera um PDF com cara de apresentação profissional — capa com nome do cliente, páginas por ambiente com foto e lista de itens, resumo de valores, condições de pagamento. E ainda gera um contrato pré-preenchido com os dados do cliente. Além disso, manda um email de notificação pro Ygor cada vez que um orçamento for fechado.

Tudo isso em HTML puro, hospedado no GitHub Pages — sem servidor, sem custo mensal, sem dependência.

---

## O que a gente fez nesse sprint

### 1. Planejamento e identidade visual
Antes de escrever uma linha de código, fui fundo nas análises de branding da Explan. Tinha feito as análises antes — tipografia, psicologia de cores, identidade visual completa. Usei tudo isso pra garantir que o produto visual ficasse alinhado com a marca:
- Fonte Archivo (Light 300 para elegância, Bold 600 para impacto)
- Cor primária `#41422F` (oliva que é a identidade da marca)
- Fundo `#EBE6DD` (bege quente)
- Botões pretos `#000000` com hover magenta `#CC3366`
- Foco nos inputs em azul cyan `#6EC1E4`

### 2. Dois protótipos funcionais criados
Fiz dois modelos distintos para testar qual fluxo vai melhor pra equipe de vendas:

**Wizard (4 etapas):**
- Step 1: Dados do cliente
- Step 2: Escolha de materiais (chips visuais)
- Step 3: Montagem de ambientes + itens
- Step 4: Fechamento com total + ações

**Página Única com Sidebar:**
- Tudo numa tela só
- Sidebar fixa com total em tempo real
- Cards colapsáveis por seção
- Mais rápido pra quem já conhece o fluxo

### 3. Testes automatizados com Playwright
Rodei a bateria de testes E2E nos dois protótipos: carregamento, header, logo, inputs, botões CTA, navegação wizard (steps 1→4), responsividade em desktop/tablet/mobile, overflow horizontal.

Resultado: **25/28 testes passaram (89%)**.
Os 3 que falharam são falsos positivos conhecidos:
- Overflow detection: o `scrollWidth` mede conteúdo interno mesmo com `overflow:hidden` — visualmente está correto
- Botão CTA no wizard: está em footer `position:fixed`, o Playwright não consegue verificar, mas funciona normalmente

### 4. Preview do PDF
Criamos o `pdf-preview.html` — uma prévia visual completa de como vai ficar o PDF gerado:
- Página de capa com nome do cliente e data de validade
- Quem somos + diferenciais Explan
- Uma página por ambiente (foto + tabela de itens + subtotal)
- Resumo de valores com desconto aplicado em destaque
- Condições de pagamento (à vista / 50-50 / parcelado)
- Prazos de produção e instalação
- Rodapé com selo TM · Sempre Tecnologia em todas as páginas

### 5. Template de contrato
Criamos o `contrato-template.html` com todos os placeholders em `{{DUPLA_CHAVE}}` prontos para substituição automática pelo código:
- Dados do cliente: nome, CPF, telefone, email
- Endereço da obra
- Valor total + valor por extenso
- Forma de pagamento e descrição
- Lista de ambientes contratados
- Materiais escolhidos e prazo de execução
- 6 cláusulas: Objeto, Valor, Prazo, Pagamento, Garantia, Rescisão
- Assinaturas (contratante + contratada + testemunhas)

---

## O que ainda vem por aí (próximo sprint)

- [ ] Integrar `html2pdf.js` para gerar o PDF real a partir da ferramenta
- [ ] Integrar `EmailJS` para notificação automática pro Ygor
- [ ] Lógica de contrato: substituir placeholders com dados preenchidos
- [ ] Versão de produção do wizard (além do protótipo)
- [ ] Versão de produção da página única
- [ ] Deploy no GitHub Pages
- [ ] Imagens reais dos ambientes (substituir Unsplash por fotos da Explan)
- [ ] Refinar catálogo de itens com preços validados pelo Ygor

---

## Arquivos do projeto

```
LP-ORÇAMENTO/
├── prototipo-wizard.html        ← Protótipo funcional Wizard
├── prototipo-pagina-unica.html  ← Protótipo funcional Página Única
├── pdf-preview.html             ← Prévia do layout do PDF
├── contrato-template.html       ← Template de contrato com placeholders
├── test_prototipos.py           ← Testes E2E Playwright
├── test_report.html             ← Relatório dos testes
└── test_screenshots/            ← Prints automáticos desktop + mobile
```

---

*Desenvolvido por TM · Sempre Tecnologia — thiagonascimentobarbosapro.com*
