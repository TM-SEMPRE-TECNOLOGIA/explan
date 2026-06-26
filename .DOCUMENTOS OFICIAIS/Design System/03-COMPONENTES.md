# 🧩 Componentes

Componentes reutilizáveis do Design System Explan.

---

## Botões

### Button Primary (Padrão)
Ação principal, chamada de atenção alta.

**Aparência:**
- Fundo: Olive/Black (#41422F ou #000000)
- Texto: White (#FFFFFF)
- Padding: 11px 18px
- Border Radius: 50px (arredondado)
- Font: Manrope 13px Bold

**Estados:**
- Default: Olive (#41422F)
- Hover: Magenta (#CC3366)
- Active: Darker Olive
- Disabled: Cream Dark (#D8D4CC), texto muted

```html
<button class="btn btn-primary">
  📄 Gerar PDF
</button>
```

```css
.btn-primary {
  background: var(--black);
  color: #fff;
  width: 100%;
  justify-content: center;
  border-radius: 50px;
  margin-bottom: 8px;
  transition: all .2s;
}
.btn-primary:hover {
  background: var(--magenta);
}
```

---

### Button Green (Sucesso)
Ação positiva confirmada (salvar, confirmar, gerar).

**Aparência:**
- Fundo: Green (#3B5E27)
- Texto: White (#FFFFFF)
- Padding: 11px 18px
- Border Radius: 50px

**Estados:**
- Default: Green (#3B5E27)
- Hover: Dark Green (#2d4a1e)
- Active: Darker
- Disabled: Cream Dark

```html
<button class="btn btn-green">
  ✓ Confirmar
</button>
```

```css
.btn-green {
  background: var(--green);
  color: #fff;
  width: 100%;
  justify-content: center;
  border-radius: 50px;
}
.btn-green:hover {
  background: #2d4a1e;
}
```

---

### Button Secondary
Ação secundária, contexto alterado.

**Aparência:**
- Fundo: Cream Alt (#F5F2ED)
- Borda: 1px solid Border (#CCD6DF)
- Texto: Text (#212121)
- Padding: 11px 18px
- Border Radius: 50px

**Estados:**
- Default: Cream Alt
- Hover: Cream Dark background
- Active: Border mais escura
- Disabled: Cream Dark text

```html
<button class="btn btn-secondary">
  Cancelar
</button>
```

```css
.btn-secondary {
  background: var(--cream-alt);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 50px;
  transition: all .2s;
}
.btn-secondary:hover {
  background: var(--cream-dark);
  border-color: var(--text-muted);
}
```

---

### Button Danger (Deletar)
Ação destrutiva, exclusão.

**Aparência:**
- Fundo: Light Red (#F5E5E0)
- Texto: Red (#C0392B)
- Borda: 1px solid #E8C8C0
- Padding: 11px 18px
- Border Radius: 50px

**Estados:**
- Default: Light Red background
- Hover: Red background, White text
- Active: Darker Red
- Disabled: Cream Dark

```html
<button class="btn btn-danger">
  ✕ Excluir
</button>
```

```css
.btn-danger {
  background: #F5E5E0;
  color: var(--red);
  border: 1px solid #E8C8C0;
  border-radius: 50px;
  transition: all .2s;
}
.btn-danger:hover {
  background: var(--red);
  color: #fff;
}
```

---

### Button Small
Para ações menores, inline.

```html
<button class="btn btn-primary btn-sm">
  + Adicionar
</button>
```

```css
.btn-sm {
  padding: 7px 13px;
  font-size: 12px;
}
```

---

### Button Icon
Apenas ícone/emoji, sem texto (excluir, fechar).

```html
<button class="btn-del" onclick="delItem(this)">×</button>
```

```css
.btn-del {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--cream-dark);
  font-size: 18px;
  transition: color .15s;
}
.btn-del:hover {
  color: var(--red);
}
```

---

## Cards

Containers para agrupar conteúdo relacionado.

### Card Base
```html
<div class="card">
  <div class="card-header">
    <div>
      <div class="card-header-title">Título</div>
      <div class="card-header-sub">Subtítulo/descrição</div>
    </div>
  </div>
  <div class="card-body">
    Conteúdo aqui...
  </div>
</div>
```

```css
.card {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: 20px;
  overflow: hidden;
  transition: box-shadow .25s;
}
.card:hover {
  box-shadow: var(--shadow-hover);
}

.card-header {
  background: var(--cream-alt);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
}

.card-header-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.card-header-sub {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 1px;
}

.card-body {
  padding: 20px;
}
```

---

## Formulários

### Field (Input Group)
```html
<div class="field">
  <label>Nome completo</label>
  <input type="text" placeholder="Ex: Alessandro Ferreira">
</div>
```

```css
.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: .07em;
}

input, select, textarea {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 7px;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--text);
  outline: none;
  transition: border-color .2s;
}

input:focus, select:focus, textarea:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(110, 193, 228, .15);
}
```

### Field Row (Grid 2 colunas)
```html
<div class="field-row">
  <div class="field">...</div>
  <div class="field">...</div>
</div>
```

```css
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

.field-row.col3 {
  grid-template-columns: 1fr 1fr 1fr;
}

.field-row.col4 {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.field-row.full {
  grid-template-columns: 1fr;
}
```

---

## Chips (Material Design style)

Seleção múltipla/opcional.

```html
<div class="chip-group">
  <div class="chip" onclick="selChip(this, 'chapa', '15')">
    <span class="chip-name">Chapa 15</span>
    <span class="chip-disc">−10% MDF</span>
  </div>
  <div class="chip selected">
    <span class="chip-name">Chapa 18</span>
    <span class="chip-disc">padrão</span>
  </div>
</div>
```

```css
.chip-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  padding: 8px 14px;
  border-radius: 7px;
  border: 2px solid var(--border);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s;
  background: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 80px;
  text-align: center;
}

.chip:hover {
  border-color: var(--olive);
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(65, 66, 47, .12);
}

.chip.selected {
  border-color: var(--olive);
  background: #EAEBE3;
  color: var(--text);
  box-shadow: 0 0 0 3px rgba(65, 66, 47, .12);
}

.chip-name {
  font-size: 13px;
}

.chip-disc {
  font-size: 10px;
  font-weight: 700;
  color: var(--green);
}
```

---

## Badges

Pequenos indicadores de status ou categoria.

```html
<span class="badge badge-success">−15% aplicado</span>
<span class="badge badge-info">Novo</span>
<span class="badge badge-warning">Atenção</span>
```

```css
.badge {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid transparent;
}

.badge-success {
  background: #E2F0DC;
  color: var(--green);
}

.badge-info {
  background: #D4E9F7;
  color: var(--cyan);
}

.badge-warning {
  background: #FDF3E0;
  color: #D97706;
}
```

---

## Modals

Diálogos sobrepostos.

```html
<div class="overlay" id="modal">
  <div class="modal">
    <h3>Novo Ambiente</h3>
    <div class="field">...</div>
    <div class="modal-btns">
      <button class="btn btn-secondary">Cancelar</button>
      <button class="btn btn-primary">Adicionar</button>
    </div>
  </div>
</div>
```

```css
.overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(28, 26, 23, .5);
  z-index: 200;
  align-items: center;
  justify-content: center;
}

.overlay.open {
  display: flex;
}

.modal {
  background: var(--white);
  border-radius: var(--radius);
  padding: 28px;
  width: 420px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, .2);
  max-height: 90vh;
  overflow-y: auto;
}

.modal h3 {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  color: var(--brown-dark);
  margin-bottom: 18px;
}

.modal-btns {
  display: flex;
  gap: 10px;
  margin-top: 18px;
}

.modal-btns .btn {
  flex: 1;
  justify-content: center;
}
```

---

## Sidebar / Painel Lateral

```html
<div class="sidebar">
  <div class="sidebar-title">Resumo do Orçamento</div>
  <div id="sidebar-envs">
    <div class="sidebar-env-row">
      <span>Sala de Estar</span>
      <span>R$ 12.600</span>
    </div>
  </div>
  <div class="sidebar-total-big">
    <div class="label">Investimento Total</div>
    <div class="valor">R$ 12.600,00</div>
  </div>
</div>
```

```css
.sidebar {
  position: sticky;
  top: 70px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
  margin-left: 20px;
}

.sidebar-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.sidebar-env-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 5px 0;
  color: var(--text-muted);
  border-bottom: 1px solid var(--cream-dark);
}

.sidebar-total-big {
  background: var(--olive);
  color: #EBE6DD;
  border-radius: 8px;
  padding: 16px;
  margin: 14px 0;
  text-align: center;
}

.sidebar-total-big .label {
  font-size: 10px;
  opacity: .7;
  text-transform: uppercase;
  letter-spacing: .08em;
}

.sidebar-total-big .valor {
  font-family: 'Playfair Display', serif;
  font-size: 26px;
  margin-top: 4px;
}
```

---

**Última revisão:** 11/06/2026 | **Responsável:** TM · Sempre Tecnologia
