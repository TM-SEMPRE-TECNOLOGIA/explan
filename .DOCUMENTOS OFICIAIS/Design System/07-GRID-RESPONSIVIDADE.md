# 📱 Grid & Responsividade

Sistema responsivo mobile-first para garantir funcionalidade em todos os dispositivos.

---

## Breakpoints

| Dispositivo | Range | Colunas | Max Width | Uso |
|-------------|-------|---------|-----------|-----|
| **Mobile XS** | 0 - 359px | 1 | 100% | Smartphones pequenos |
| **Mobile SM** | 360 - 479px | 1 | 100% | Smartphones padrão |
| **Mobile MD** | 480 - 599px | 1 | 100% | Smartphones grandes |
| **Tablet** | 600 - 860px | 2 | 90% | Tablets |
| **Desktop** | 861px+ | 3+ | 1100px | Desktops |

---

## Implementação

### Mobile-First (Padrão)
Começar com estilos mobile, depois adicionar media queries:

```css
/* Base: Mobile (360px - 479px) */
.layout {
  display: block;
  padding: 16px;
}

.card {
  margin-bottom: 20px;
}

/* Tablet (600px+) */
@media (min-width: 600px) {
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}

/* Desktop (861px+) */
@media (min-width: 861px) {
  .layout {
    max-width: 1100px;
    margin: 0 auto;
    grid-template-columns: 1fr 300px;
  }
}
```

---

## Grid Layout

### Layout Principal (Página Única)
Página que foi desenvolvida com grid 2 colunas (main + sidebar).

```css
/* Desktop: 2 colunas */
@media (min-width: 861px) {
  .layout {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 0;
    max-width: 1100px;
    margin: 0 auto;
    padding: 28px 16px 40px;
  }
}

/* Tablet: 1 coluna */
@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .sidebar {
    margin-left: 0;
    position: static; /* Remove sticky */
  }
}
```

### Field Row (Formulários)
Campos lado a lado em desktop, empilhados em mobile:

```css
/* Desktop: 2 colunas */
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

/* Desktop: 3 colunas */
.field-row.col3 {
  grid-template-columns: 1fr 1fr 1fr;
}

/* Desktop: 4 colunas */
.field-row.col4 {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

/* Mobile: 1 coluna */
@media (max-width: 860px) {
  .field-row,
  .field-row.col3,
  .field-row.col4 {
    grid-template-columns: 1fr;
  }
}
```

### Items Table (Tabelas Responsivas)
Desktop: tabela normal | Mobile: cards empilhados

```css
/* Desktop: tabela */
@media (min-width: 861px) {
  .items-header {
    display: grid;
    grid-template-columns: 44px 1fr 90px 90px 110px 32px;
    gap: 8px;
  }
  
  .item-row {
    display: grid;
    grid-template-columns: 44px 1fr 90px 90px 110px 32px;
  }
}

/* Tablet/Mobile: cards */
@media (max-width: 860px) {
  .items-header {
    display: none; /* Esconder headers */
  }
  
  .item-row {
    grid-template-columns: 40px 1fr 72px 28px;
    gap: 6px;
  }
  
  .item-unit-price,
  .item-subtotal {
    display: none; /* Esconder colunas menos importantes */
  }
}
```

---

## Navegação Responsiva

### Header Sticky
Sempre visível, mas ajusta-se ao viewport:

```css
header {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 14px 32px;
}

@media (max-width: 480px) {
  header {
    padding: 12px 16px;
  }
  
  .logo-text {
    font-size: 13px;
  }
}
```

### Sidebar Sticky
Fica fixa até certa altura, depois scroll normal:

```css
/* Desktop */
@media (min-width: 861px) {
  .sidebar {
    position: sticky;
    top: 70px; /* Abaixo do header */
  }
}

/* Mobile: static */
@media (max-width: 860px) {
  .sidebar {
    position: static;
  }
}
```

---

## Tipografia Responsiva

### Tamanhos por Breakpoint
Reduzir font-size em mobile para legibilidade:

```css
/* Base (Mobile) */
h1 { font-size: 24px; }
h2 { font-size: 18px; }
h3 { font-size: 14px; }
body { font-size: 12px; }

/* Tablet */
@media (min-width: 600px) {
  h1 { font-size: 26px; }
  h2 { font-size: 19px; }
  h3 { font-size: 15px; }
  body { font-size: 13px; }
}

/* Desktop */
@media (min-width: 861px) {
  h1 { font-size: 28px; }
  h2 { font-size: 20px; }
  h3 { font-size: 16px; }
  body { font-size: 13px; }
}
```

---

## Espaçamento Responsivo

### Padding & Margin
Aumentar espaçamento em desktops:

```css
/* Mobile */
.card {
  padding: 16px;
  margin-bottom: 16px;
}

.card-header {
  padding: 12px 14px;
}

/* Desktop */
@media (min-width: 861px) {
  .card {
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .card-header {
    padding: 16px 20px;
  }
}
```

### Gaps em Grid/Flex
Reduzir gaps em mobile:

```css
/* Mobile */
.field-row {
  gap: 12px;
}

.chip-group {
  gap: 6px;
}

/* Desktop */
@media (min-width: 861px) {
  .field-row {
    gap: 14px;
  }
  
  .chip-group {
    gap: 8px;
  }
}
```

---

## Imagens Responsivas

### IMG Responsivo
Adaptar tamanho ao container:

```css
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Photo preview em ambiente */
.env-photo-preview {
  width: 100%;
  max-height: 180px;
  border-radius: 6px;
  object-fit: cover;
  margin-bottom: 10px;
}

/* Em mobile, fazer menor */
@media (max-width: 600px) {
  .env-photo-preview {
    max-height: 120px;
  }
}
```

### Picture Element (Múltiplas Resoluções)
Para otimizar por resolução:

```html
<picture>
  <source media="(min-width: 861px)" srcset="large.jpg">
  <source media="(min-width: 600px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Descrição">
</picture>
```

---

## Visibilidade Responsiva

### Mostrar/Esconder Elementos
Alguns elementos não aparecem em mobile:

```css
/* Esconder em mobile */
@media (max-width: 860px) {
  .items-header {
    display: none;
  }
  
  .item-unit-price,
  .item-subtotal {
    display: none;
  }
}

/* Mostrar apenas em mobile */
.mobile-only {
  display: block;
}

@media (min-width: 861px) {
  .mobile-only {
    display: none;
  }
}
```

---

## Modais Responsivos

### Modal Width
Adaptar tamanho do modal:

```css
/* Mobile: quase full width */
.modal {
  width: 90%;
  padding: 20px;
}

/* Tablet/Desktop: fixed width */
@media (min-width: 600px) {
  .modal {
    width: 420px;
    padding: 28px;
  }
}
```

---

## Checklist de Responsividade

### Desktop (861px+)
- [ ] Layout 2+ colunas
- [ ] Sidebar sticky
- [ ] Todos os detalhes visíveis
- [ ] Espaçamento amplo
- [ ] Tipografia grande

### Tablet (600px - 860px)
- [ ] Layout 2 colunas (quando relevante)
- [ ] Campos ainda lado a lado
- [ ] Sidebar em baixo ou como accordion
- [ ] Espaçamento moderado
- [ ] Tipografia ajustada

### Mobile (< 600px)
- [ ] Layout 1 coluna
- [ ] Campos empilhados
- [ ] Botões full-width
- [ ] Espaçamento reduzido
- [ ] Tipografia pequena mas legível
- [ ] Touch targets ≥ 44x44px
- [ ] Sem scroll horizontal

---

## CSS Variables para Responsividade

```css
:root {
  /* Mobile first */
  --container-width: 100%;
  --padding: 16px;
  --gap-base: 12px;
  --font-base: 12px;
}

@media (min-width: 600px) {
  :root {
    --padding: 20px;
    --gap-base: 14px;
    --font-base: 13px;
  }
}

@media (min-width: 861px) {
  :root {
    --container-width: 1100px;
    --padding: 28px;
    --gap-base: 16px;
    --font-base: 13px;
  }
}

/* Usar variáveis no CSS */
body {
  padding: var(--padding);
  font-size: var(--font-base);
}

.field-row {
  gap: var(--gap-base);
}
```

---

## Ferramentas de Teste

### Browsers
- Chrome DevTools (F12)
- Firefox Responsive Mode
- Safari Responsive Design Mode

### Dispositivos Reais
Testar em:
- iPhone SE (375px)
- iPhone 12 (390px)
- iPhone 14 Pro Max (430px)
- Samsung Galaxy S10 (360px)
- iPad (768px)
- iPad Pro (1024px)

### Validadores
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Última revisão:** 11/06/2026 | **Responsável:** TM · Sempre Tecnologia
