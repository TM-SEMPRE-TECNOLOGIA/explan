# ♿ Acessibilidade

Padrões WCAG 2.1 AA (mínimo) para garantir acesso a todos os usuários.

---

## Contraste de Cores

### Mínimo Recomendado
- **AA:** 4.5:1 (texto normal), 3:1 (texto grande)
- **AAA:** 7:1 (texto normal), 4.5:1 (texto grande)

### Pares Validados no Design System

| Combinação | Contraste | Nível | ✓ |
|------------|-----------|-------|---|
| Olive + Cream | 8.2:1 | AAA | ✓ |
| Olive + White | 10.1:1 | AAA | ✓ |
| Text (#212121) + Cream | 12.5:1 | AAA | ✓ |
| Text (#212121) + White | 21:1 | AAA | ✓ |
| Green + White | 6.8:1 | AAA | ✓ |
| Red + White | 5.2:1 | AAA | ✓ |
| Magenta + White | 5.5:1 | AAA | ✓ |
| Cyan + White | 3.2:1 | AA | ⚠ (usar com cuidado) |

**Ferramentas de teste:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Deque axe DevTools](https://www.deque.com/axe/devtools/)

---

## Texto Alternativo

### Imagens
Toda imagem deve ter `alt` descritivo:

```html
<!-- ✓ BOM -->
<img src="sala-estar.jpg" alt="Sala de estar com móveis planejados">

<!-- ✗ RUIM -->
<img src="sala-estar.jpg" alt="imagem">
<img src="sala-estar.jpg" alt=""> <!-- Só se decorativa -->
```

### Ícones & Emojis
Se o emoji/ícone é ativo, incluir label:

```html
<!-- ✓ BOM -->
<button aria-label="Excluir ambiente">✕</button>

<!-- ✗ RUIM -->
<button>✕</button>
```

### Decorativos
Se a imagem é puramente decorativa, deixar `alt` vazio:

```html
<img src="decorative-line.svg" alt="">
```

---

## Estrutura Semântica

### Headings Hierárquicos
Usar H1, H2, H3... em ordem, sem pular níveis:

```html
<!-- ✓ BOM -->
<h1>Orçamento Express</h1>
<h2>Dados do Cliente</h2>
<h3>Nome completo</h3>

<!-- ✗ RUIM -->
<h1>Orçamento Express</h1>
<h3>Dados do Cliente</h3> <!-- Pulou H2 -->
```

### Elementos Semânticos
```html
<header>...</header>      <!-- Cabeçalho da página -->
<nav>...</nav>            <!-- Navegação -->
<main>...</main>          <!-- Conteúdo principal -->
<section>...</section>    <!-- Seções temáticas -->
<article>...</article>    <!-- Artigo independente -->
<aside>...</aside>        <!-- Conteúdo relacionado -->
<footer>...</footer>      <!-- Rodapé da página -->
```

---

## Formulários

### Labels Explícitos
Todo input deve ter label associado:

```html
<!-- ✓ BOM -->
<label for="nome-cliente">Nome completo</label>
<input type="text" id="nome-cliente" name="nome">

<!-- ✗ RUIM -->
<label>Nome completo</label>
<input type="text">

<!-- ✗ RUIM -->
<input type="text" placeholder="Nome completo">
```

### Required & Invalid
Indicar campos obrigatórios e erros:

```html
<!-- Required -->
<label for="email">E-mail <span aria-label="obrigatório">*</span></label>
<input type="email" id="email" required>

<!-- Error -->
<label for="cpf" class="error">CPF</label>
<input type="text" id="cpf" aria-invalid="true" aria-describedby="cpf-error">
<span id="cpf-error" role="alert">CPF inválido</span>
```

### Fieldsets
Agrupar campos relacionados:

```html
<fieldset>
  <legend>Configuração de Materiais</legend>
  <div class="field">...</div>
  <div class="field">...</div>
</fieldset>
```

---

## Navegação

### Keyboard Navigation
Todos os elementos interativos devem ser acessíveis via teclado:

```html
<!-- Botões -->
<button onclick="...">Ação</button>

<!-- Links -->
<a href="/page">Link</a>

<!-- Inputs & Selects -->
<input type="text">
<select>...</select>

<!-- DIVs clicáveis devem ser tratados como botões -->
<div role="button" tabindex="0" onclick="..." onkeydown="...">
  Ação
</div>
```

### Tab Order
Ordem de navegação deve fazer sentido (left-to-right, top-to-bottom):

```html
<form>
  <input tabindex="1">
  <input tabindex="2">
  <button tabindex="3">Enviar</button>
</form>
```

Evitar valores de tabindex > 0 (usar apenas -1 para elementos removidos do fluxo).

### Focus Visible
Sempre deixar visível onde o foco está:

```css
*:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 2px;
}
```

---

## ARIA (Accessible Rich Internet Applications)

### Live Regions
Para atualizações dinâmicas sem reload:

```html
<!-- Polite: anúncia quando o usuário parar -->
<div id="total" aria-live="polite" aria-atomic="true">
  Total: R$ 12.600,00
</div>

<!-- Assertive: anúncia imediatamente -->
<div id="error" aria-live="assertive" role="alert">
  Erro ao salvar
</div>
```

### Aria Labels
Para elementos sem texto visível:

```html
<button aria-label="Fechar modal">×</button>
<button aria-label="Ir para próximo slide">→</button>
```

### Aria Descriptions
Para descrever em detalhes:

```html
<input type="password" aria-describedby="pwd-hint">
<p id="pwd-hint">Mínimo 8 caracteres, 1 maiúscula, 1 número</p>
```

### Aria Hidden
Para elementos decorativos que leitores de tela não devem ler:

```html
<span aria-hidden="true">→</span> <!-- Ícone decorativo -->
<img src="decoration.svg" alt="" aria-hidden="true">
```

---

## Cores

### Não Use Cor Apenas para Significado
Sempre complementar com texto, ícone ou padrão:

```html
<!-- ✓ BOM -->
<span class="success">✓ Desconto aplicado</span>
<span class="error">✕ CPF inválido</span>

<!-- ✗ RUIM -->
<span style="color: green;">Desconto aplicado</span>
<span style="color: red;">CPF inválido</span>
```

### Padrões Alternativos
Usar além de cor:
- ✓ / ✕ (checkmarks)
- (i) / ! (ícones informativos)
- Padrões (striped, dotted)
- Texto claro

---

## Animações

### Respeitar Preferência do Usuário
Reduzir movimento para usuários que preferem (vestibular disorders):

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Sem Auto-play
Vídeos e animações não devem iniciar automaticamente:

```html
<!-- ✓ BOM -->
<video controls>
  <source src="demo.mp4" type="video/mp4">
</video>

<!-- ✗ RUIM -->
<video autoplay>...</video>
```

---

## Componentes Acessíveis

### Modals
Devem ter:
- Título claro (h2, h3)
- Foco contido dentro do modal
- Botão de fechar visível
- ESC para fechar

```html
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Novo Ambiente</h2>
  <form>...</form>
  <button aria-label="Fechar">×</button>
</div>
```

### Tabs
Navegação por tabs deve ser acessível:

```html
<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel1">
    Aba 1
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel2">
    Aba 2
  </button>
</div>

<div id="panel1" role="tabpanel">Conteúdo 1</div>
<div id="panel2" role="tabpanel" hidden>Conteúdo 2</div>
```

---

## Checklist de Acessibilidade

- [ ] Contraste de cores ≥ 4.5:1
- [ ] Todos os inputs têm labels
- [ ] Navegação por teclado (Tab) funciona
- [ ] Elementos clicáveis têm min 44x44px
- [ ] Imagens têm alt text
- [ ] Headings em ordem (H1 → H2 → H3)
- [ ] Focus visível em todos os elementos
- [ ] Formulários com validação clara
- [ ] Erros anunciados (aria-live)
- [ ] Modais com foco contido
- [ ] Respeita prefers-reduced-motion
- [ ] Sem dependência de cor
- [ ] Textos com min 12px
- [ ] Line-height ≥ 1.4

---

## Testes Recomendados

### Teclado
- Navegar com Tab/Shift+Tab
- Ativar com Enter/Space
- ESC para fechar modais

### Leitor de Tela
- NVDA (Windows, grátis)
- JAWS (Windows, pago)
- VoiceOver (Mac/iOS)
- TalkBack (Android)

### Validadores
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse (Chrome)](https://developers.google.com/web/tools/lighthouse)
- [WebAIM](https://webaim.org/)
- [WAVE](https://wave.webaim.org/)

---

**Última revisão:** 11/06/2026 | **Responsável:** TM · Sempre Tecnologia
