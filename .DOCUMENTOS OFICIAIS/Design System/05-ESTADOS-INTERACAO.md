# 🎮 Estados & Interação

## Estados de Componentes

### Estados de Botão

#### Default
Estado inicial do botão.

```css
.btn-primary {
  background: var(--black);
  color: #fff;
  cursor: pointer;
}
```

#### Hover
Quando o mouse passa sobre o elemento.

```css
.btn-primary:hover {
  background: var(--magenta);
  transform: scale(1.02);
}
```

#### Active/Pressed
Quando o botão está sendo pressionado.

```css
.btn-primary:active {
  transform: scale(0.98);
}
```

#### Focused (Keyboard)
Quando o elemento recebe foco via teclado (Tab).

```css
.btn:focus {
  outline: 2px solid var(--cyan);
  outline-offset: 2px;
}
```

#### Disabled
Quando o botão está desabilitado.

```css
.btn:disabled {
  background: var(--cream-dark);
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.6;
}
```

---

### Estados de Input

#### Default
Campo vazio ou preenchido normalmente.

```css
input, select, textarea {
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--text);
}
```

#### Hover
Quando o mouse passa sobre o input (não em foco).

```css
input:hover, select:hover, textarea:hover {
  border-color: var(--text-muted);
  background: var(--white);
}
```

#### Focus
Quando o input recebe foco.

```css
input:focus, select:focus, textarea:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(110, 193, 228, 0.15);
  outline: none;
}
```

#### Filled/Invalid
Quando há erro.

```css
input:invalid, select:invalid, textarea:invalid {
  border-color: var(--red);
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.1);
}
```

#### Placeholder
Texto sugestivo quando vazio.

```css
input::placeholder, textarea::placeholder {
  color: var(--text-muted);
}
```

#### Disabled
Campo desabilitado.

```css
input:disabled, select:disabled, textarea:disabled {
  background: var(--cream-dark);
  color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.6;
}
```

---

### Estados de Chip

#### Default
Chip não selecionado.

```css
.chip {
  border: 2px solid var(--border);
  background: var(--white);
  color: var(--text);
  cursor: pointer;
}
```

#### Hover
Mouse sobre o chip.

```css
.chip:hover {
  border-color: var(--olive);
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(65, 66, 47, 0.12);
}
```

#### Selected
Chip selecionado.

```css
.chip.selected {
  border-color: var(--olive);
  background: #EAEBE3;
  color: var(--text);
  box-shadow: 0 0 0 3px rgba(65, 66, 47, 0.12);
}
```

#### Active/Focused
Foco via teclado.

```css
.chip:focus {
  outline: 2px solid var(--cyan);
  outline-offset: -2px;
}
```

---

### Estados de Card

#### Default
Card em repouso.

```css
.card {
  background: var(--white);
  box-shadow: var(--shadow);
}
```

#### Hover
Mouse sobre o card.

```css
.card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-1px);
}
```

#### Active/Selected
Card está "aberto" ou selecionado.

```css
.card.active {
  border-color: var(--olive);
  box-shadow: var(--shadow-hover);
}
```

#### Loading
Enquanto carrega dados.

```css
.card.loading {
  opacity: 0.6;
  pointer-events: none;
}

.card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 10px,
    rgba(65, 66, 47, 0.05) 10px,
    rgba(65, 66, 47, 0.05) 20px
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

---

## Feedback Visual

### Animações de Sucesso
Quando uma ação é completada com sucesso.

```css
@keyframes success-check {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.success-icon {
  animation: success-check 0.4s ease-out;
}
```

### Animações de Erro
Quando uma ação falha.

```css
@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
  20%, 40%, 60%, 80% { transform: translateX(3px); }
}

.error-shake {
  animation: error-shake 0.5s ease-in-out;
}
```

### Animações de Loading
Indicador de progresso.

```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  border: 2px solid var(--cream-dark);
  border-top: 2px solid var(--olive);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}
```

### Pulse (Respiração)
Para elementos que precisam atenção.

```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

---

## Validação de Formulário

### Valid (Sucesso)
```html
<div class="field field-valid">
  <label>CPF</label>
  <input type="text" value="123.456.789-00" class="input-valid">
  <span class="help-text help-valid">✓ CPF válido</span>
</div>
```

```css
.field-valid input {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(59, 94, 39, 0.1);
}

.help-valid {
  color: var(--green);
  font-size: 11px;
}
```

### Invalid (Erro)
```html
<div class="field field-invalid">
  <label>E-mail</label>
  <input type="email" value="invalid" class="input-invalid">
  <span class="help-text help-error">✕ E-mail inválido</span>
</div>
```

```css
.field-invalid input {
  border-color: var(--red);
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.1);
}

.help-error {
  color: var(--red);
  font-size: 11px;
}
```

### Warning
```html
<div class="field field-warning">
  <label>Data</label>
  <input type="date" value="2026-01-01" class="input-warning">
  <span class="help-text help-warning">⚠ Data no passado</span>
</div>
```

```css
.field-warning input {
  border-color: #D97706;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.help-warning {
  color: #D97706;
  font-size: 11px;
}
```

---

## Interação com Teclado

### Focus Visible
Quando o elemento recebe foco via Tab (não via mouse).

```css
.btn:focus-visible {
  outline: 2px solid var(--cyan);
  outline-offset: 2px;
}

input:focus-visible {
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(110, 193, 228, 0.15);
}
```

### Keyboard Navigation
Elementos navegáveis via teclado devem ter ordem clara.

```html
<button tabindex="1">Primeiro</button>
<button tabindex="2">Segundo</button>
<button tabindex="3">Terceiro</button>
```

### Skip Link (Acessibilidade)
Link oculto que aparece no Tab (ir direto ao conteúdo).

```html
<a href="#main" class="skip-link">Pular para o conteúdo</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--olive);
  color: #fff;
  padding: 8px;
  text-decoration: none;
}

.skip-link:focus {
  top: 0;
}
```

---

## Mobile & Touch

### Hover vs. Active
Em dispositivos touch, não há "hover". Use active/focus.

```css
/* Desktop */
@media (hover: hover) {
  .btn:hover { transform: scale(1.02); }
}

/* Mobile */
@media (hover: none) {
  .btn:active { transform: scale(0.98); }
}
```

### Touch Target Size
Elementos interativos devem ter mínimo 44x44px (acessibilidade).

```css
.btn {
  min-height: 44px;
  min-width: 44px;
}

.btn-del {
  width: 32px;
  height: 32px;
  /* Padding invisível para aumentar área tátil */
  padding: 6px;
}
```

---

## Transições Suaves

### Propriedades Transicionáveis
Sempre que possível, usar transição em:
- `color`
- `background-color`
- `border-color`
- `box-shadow`
- `transform`
- `opacity`

### Propriedades NÃO Transicionar
Evitar transição em:
- `display` (usar `visibility` ao invés)
- `width/height` (usar `transform: scale()`)
- `z-index`

```css
/* ✓ BOM */
.card {
  transition: box-shadow 0.25s, transform 0.25s;
}

.card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-1px);
}

/* ✗ RUIM */
.card {
  transition: display 0.25s; /* Não faz efeito */
}
```

---

**Última revisão:** 11/06/2026 | **Responsável:** TM · Sempre Tecnologia
