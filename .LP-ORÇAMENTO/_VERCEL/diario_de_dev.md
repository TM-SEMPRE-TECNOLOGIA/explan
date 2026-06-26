# Diário de Dev - Atualização e Padronização do Sistema

**Data:** 23 de Junho de 2026
**Contexto:** Refatoração visual (remoção de Emojis para o Lucide) e padronização do ecossistema Explan.

### O Que Foi Feito
- Exclusão dos arquivos duplicados `login.html` e `sprint-09.html`. Centralizamos a lógica de login em `index.html` e a de orçamentos em `painel.html`.
- Varredura de todos os links do sistema (nas páginas de Ajuda, Suporte e Editor). Os links foram corrigidos para aterrissar corretamente nos dois arquivos principais.
- Substituição em massa de todos os emojis que estavam quebrando o encoding (`ðŸ’°`, `ðŸ“…`, `ðŸš¿`) por componentes de ícone do Lucide (ex: `<i data-lucide="circle-dollar-sign"></i>`).
- Injeção da CDN do Lucide no `<head>` e inicialização no `<body>` de todos os arquivos restantes.

### Decisões / Soluções
- A biblioteca **Lucide Icons** foi escolhida (via CDN) para unificar a apresentação visual. Sem SVGs pesando no arquivo e sem emojis nativos que causavam dor de cabeça em diferentes sistemas operacionais.
- O botão "ABRIR Â†'" foi restaurado programaticamente para "Abrir &rarr;" de modo que as setas renderizem adequadamente independente do editor de texto que o dev usar no futuro.

### Próximo Passo Imediato
- Validação visual por parte do time no fluxo das telas unificadas (Index → Painel → Editor / Suporte / Ajuda).
