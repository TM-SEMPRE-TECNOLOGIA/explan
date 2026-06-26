# 📏 Espaçamento & Sombras

## Escala de Espaçamento

Sistema baseado em incrementos de 4px, facilitando composição modular.

| Valor | Múltiplo | Uso |
|-------|----------|-----|
| **2px** | 0.5x | Gaps muito pequenos (raramente) |
| **4px** | 1x | Gaps internos, micro-espaçamentos |
| **8px** | 2x | Gaps entre elementos pequenos |
| **12px** | 3x | Espaçamento padrão leve |
| **16px** | 4x | Padding de card body, espaçamento padrão |
| **20px** | 5x | Margin entre cards |
| **24px** | 6x | Padding de sidebar, seções maiores |
| **28px** | 7x | Padding de modal |
| **32px** | 8x | Gaps em grid, espaçamento amplo |

---

## Espaçamento Interno (Padding)

### Cards
```css
.card {
  /* Espaçamento externo */
  margin-bottom: 20px;
}

.card-header {
  padding: 16px 20px;
}

.card-body {
  padding: 20px;
}
```

### Modais
```css
.modal {
  padding: 28px;
}
```

### Sidebar
```css
.sidebar {
  padding: 24px;
}
```

### Inputs e Campos
```css
input, select, textarea {
  padding: 10px 12px;
}

.field {
  gap: 5px; /* Label para input */
}
```

### Buttons
```css
.btn {
  padding: 11px 18px;
}

.btn-sm {
  padding: 7px 13px;
}
```

---

## Espaçamento Externo (Margin)

### Cards
```css
.card {
  margin-bottom: 20px;
}
```

### Seções
```css
.section {
  margin-bottom: 28px;
}
```

### Botões em Sequência
```css
.btn-primary {
  margin-bottom: 8px;
}
```

### Tabs/Headers
```css
.card-header {
  margin-bottom: 16px;
}
```

---

## Gaps em Grid/Flex

### Field Rows (2-4 colunas)
```css
.field-row {
  gap: 14px;
  margin-bottom: 14px;
}
```

### Chip Groups
```css
.chip-group {
  gap: 8px;
  flex-wrap: wrap;
}
```

### Mat Rows (Material selection)
```css
.mat-row {
  gap: 28px;
  flex-wrap: wrap;
}
```

### Modal Buttons
```css
.modal-btns {
  gap: 10px;
}
```

---

## Bordas e Linhas de Separação

Bordas usam 1px solid, com cores de `var(--border)` ou variações:

```css
border: 1px solid var(--border); /* Padrão */
border: 1px solid var(--cream-dark); /* Mais discreto */
border: 2px solid var(--cream-dark); /* Emphasis */
border-top: 1px solid var(--border); /* Top only */
border-bottom: 1px dashed var(--cream-dark); /* Dashed */
```

### Bordas Arredondadas (Border Radius)

```css
--radius: 10px; /* Cards, containers grandes */

border-radius: 10px; /* Cards, modais */
border-radius: 9px;  /* Env cards */
border-radius: 8px;  /* Sidebar, badges */
border-radius: 7px;  /* Inputs, chips */
border-radius: 6px;  /* Thumbnails, imagens */
border-radius: 5px;  /* Icons, small elements */
border-radius: 50px; /* Buttons (pill shape) */
border-radius: 20px; /* Badges, pills */
```

---

## Sombras (Box Shadows)

Sistema de 2 níveis de sombra para feedback visual.

### Shadow Padrão (Elevação baixa)
```css
--shadow: 0 2px 16px rgba(65, 66, 47, 0.10);
```

**Usos:**
- Cards em estado padrão
- Modais
- Dropdowns
- Elementos com elevação leve

```html
<div class="card">...</div>
```

### Shadow Hover (Elevação alta)
```css
--shadow-hover: 0 6px 24px rgba(65, 66, 47, 0.18);
```

**Usos:**
- Cards em hover
- Elementos elevados interativos
- Feedback visual de interação

```css
.card:hover {
  box-shadow: var(--shadow-hover);
}
```

### Shadow Focus (Outline sutil)
```css
box-shadow: 0 0 0 3px rgba(110, 193, 228, 0.15); /* Cyan focus */
```

**Usos:**
- Inputs em focus
- Botões em keyboard navigation
- Elementos ativos

```css
input:focus {
  box-shadow: 0 0 0 3px rgba(110, 193, 228, 0.15);
}
```

---

## Transições & Animações

### Duração Padrão
```css
transition: all 0.2s; /* Padrão para hover/active */
transition: all 0.25s; /* Cards */
transition: all 0.3s; /* Animações maiores */
transition: all 0.15s; /* Feedback rápido */
```

### Easing
```css
ease-out-cubic /* AOS animations */
ease-in-out /* Transições gerais */
ease-out /* Saída rápida */
ease-in /* Entrada lenta */
```

### Exemplos
```css
.card {
  transition: box-shadow .25s, transform .25s;
}

.card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-1px);
}

.chip:hover {
  border-color: var(--olive);
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(65, 66, 47, 0.12);
}

.btn {
  transition: all .2s;
}

.btn-primary:hover {
  background: var(--magenta);
}
```

---

## Implementação CSS Completa

```css
:root {
  /* ── ESPAÇAMENTO ── */
  --gap-xs: 4px;
  --gap-sm: 8px;
  --gap-md: 12px;
  --gap-lg: 16px;
  --gap-xl: 20px;
  --gap-2xl: 24px;
  --gap-3xl: 28px;
  --gap-4xl: 32px;
  
  /* ── BORDER RADIUS ── */
  --radius: 10px;
  --radius-lg: 10px;
  --radius-md: 8px;
  --radius-sm: 7px;
  --radius-xs: 5px;
  --radius-pill: 50px;
  
  /* ── SOMBRAS ── */
  --shadow: 0 2px 16px rgba(65, 66, 47, 0.10);
  --shadow-hover: 0 6px 24px rgba(65, 66, 47, 0.18);
  --shadow-focus: 0 0 0 3px rgba(110, 193, 228, 0.15);
  
  /* ── TRANSIÇÕES ── */
  --transition-fast: all 0.15s ease-in-out;
  --transition-base: all 0.2s ease-in-out;
  --transition-slow: all 0.3s ease-in-out;
}

/* Aplicar sombras padrão */
.card {
  box-shadow: var(--shadow);
  transition: var(--transition-slow);
}

.card:hover {
  box-shadow: var(--shadow-hover);
}

input:focus {
  box-shadow: var(--shadow-focus);
}
```

---

## Responsividade

Em mobile, reduzir espaçamentos para economizar espaço:

```css
@media (max-width: 860px) {
  .field-row {
    grid-template-columns: 1fr;
    gap: 12px; /* Ao invés de 14px */
  }
  
  .mat-row {
    flex-direction: column;
    gap: 16px; /* Ao invés de 28px */
  }
  
  .card-body {
    padding: 16px; /* Ao invés de 20px */
  }
  
  .modal {
    padding: 20px; /* Ao invés de 28px */
    width: 90%;
  }
}
```

---

**Última revisão:** 11/06/2026 | **Responsável:** TM · Sempre Tecnologia
