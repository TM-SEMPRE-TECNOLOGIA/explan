# 📝 Tipografia

**Fonte única do Projeto de Marca Explan:** Archivo

---

## Familia Tipográfica

### Archivo — Fonte Principal
Fonte sans-serif humanista, versátil. Única fonte utilizada no Projeto de Marca Explan (Morath Studio).

**Pesos disponíveis:** 300, 400, 500, 600, 700  
**Origem:** Google Fonts  
**Licença:** Open Source (SIL)

**Usos:**
- Títulos e cabeçalhos (todos os níveis)
- Corpos de texto
- Labels de formulários
- Botões e callouts
- Navegação
- Valores monetários
- Headlines

```css
font-family: 'Archivo', Arial, sans-serif;
```

---

## Escala Tipográfica

| Nome | Tamanho | Peso | Altura | Uso |
|------|---------|------|--------|-----|
| **H1** | 28px | 600 | 1.4 | Título principal (rare) |
| **H2** | 20px | 600 | 1.3 | Modal titles |
| **H3** | 16px | 600 | 1.3 | Card headers |
| **H4** | 14px | 600 | 1.2 | Subtítulos |
| **H5** | 11px | 700 | 1.1 | Labels (uppercase) |
| **Body** | 13px | 400 | 1.5 | Texto geral |
| **Small** | 12px | 400 | 1.4 | Descrições |
| **Tiny** | 11px | 400 | 1.3 | Captions |
| **Button** | 13px | 600 | 1.2 | Textos em botões |

---

## Exemplos de Uso

### H1 — Archivo 28px Semi-Bold
```html
<h1 style="font-family: 'Archivo', sans-serif; font-size: 28px; font-weight: 600;">
  Orçamento Express
</h1>
```
Raramente usado. Reservado para página de capa ou hero sections.

---

### H2 — Archivo 20px Semi-Bold
```html
<h2 style="font-family: 'Archivo', sans-serif; font-size: 20px; font-weight: 600;">
  Novo Ambiente
</h2>
```
Títulos de modais, seções principais.

---

### H3 — Archivo 16px Semi-Bold
```html
<h3 style="font-family: 'Archivo', sans-serif; font-size: 16px; font-weight: 600;">
  Dados do Cliente
</h3>
```
Cabeçalhos de cards, títulos de seções.

---

### H4 — Archivo 14px Semi-Bold
```html
<h4 style="font-family: 'Archivo', sans-serif; font-size: 14px; font-weight: 600;">
  Chapa
</h4>
```
Subtítulos, seções menores.

---

### Label — Archivo 10px Bold Uppercase
```html
<label style="font-family: 'Archivo', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em;">
  Nome completo
</label>
```
Labels de formulários, sempre uppercase com letter-spacing.

---

### Body — Archivo 13px Regular
```html
<p style="font-family: 'Archivo', sans-serif; font-size: 13px; font-weight: 400; line-height: 1.5;">
  Informações para o orçamento e contrato
</p>
```
Corpo de texto padrão, descrições.

---

### Small — Archivo 12px Regular
```html
<small style="font-family: 'Archivo', sans-serif; font-size: 12px; font-weight: 400;">
  m² / un / ml
</small>
```
Informações secundárias, unidades.

---

### Button — Archivo 13px Semi-Bold
```html
<button style="font-family: 'Archivo', sans-serif; font-size: 13px; font-weight: 600;">
  + Adicionar
</button>
```
Textos de botões, chamadas para ação.

---

### Valor Monetário — Archivo 26px Semi-Bold
```html
<div style="font-family: 'Archivo', sans-serif; font-size: 26px; font-weight: 600;">
  R$ 12.600,00
</div>
```
Totais, preços, valores importantes.

---

## Propriedades Recomendadas

### Letter Spacing
```css
/* Labels uppercase */
letter-spacing: 0.07em; /* 0.08em */

/* Headers */
letter-spacing: 0.01em;

/* Body regular */
letter-spacing: 0;
```

### Line Height
```css
/* Headers (H1-H3) */
line-height: 1.3;

/* Body (paragraphs) */
line-height: 1.5;

/* Small (captions) */
line-height: 1.4;

/* Labels */
line-height: 1.1;
```

### Truncate & Overflow
```css
/* Single line overflow */
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;

/* Multi-line (2 linhas max) */
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
```

---

## Implementação CSS

```css
:root {
  /* Archivo — Fonte única */
  --font-archivo: 'Archivo', Arial, sans-serif;
}

/* Headings */
h1 { font: 600 28px var(--font-archivo); line-height: 1.4; }
h2 { font: 600 20px var(--font-archivo); line-height: 1.3; }
h3 { font: 600 16px var(--font-archivo); line-height: 1.3; }
h4 { font: 600 14px var(--font-archivo); line-height: 1.2; }
h5 { font: 700 11px var(--font-archivo); text-transform: uppercase; letter-spacing: .07em; }

/* Body */
body { font: 400 13px var(--font-archivo); line-height: 1.5; }
small { font-size: 12px; line-height: 1.4; }

/* Buttons */
.btn { font: 600 13px var(--font-archivo); }

/* Labels */
label { font: 700 10px var(--font-archivo); text-transform: uppercase; letter-spacing: .07em; }

/* Values */
.valor { font: 600 26px var(--font-archivo); }
```

---

## Responsividade Tipográfica

Em dispositivos móveis, reduzir tamanhos de fonte para melhor legibilidade:

```css
@media (max-width: 480px) {
  h1 { font-size: 24px; }
  h2 { font-size: 18px; }
  h3 { font-size: 14px; }
  body { font-size: 12px; }
  .valor { font-size: 22px; }
}
```

---

## Import no HTML

Adicionar sempre no `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## Acessibilidade Tipográfica

- ✓ Mínimo 12px para corpo (body text)
- ✓ Contraste mínimo 4.5:1 (texto vs fundo)
- ✓ Line-height mínimo 1.4 para readability
- ✓ Letter-spacing para labels em uppercase
- ✓ Sem dependência de cor para significado

---

**Última revisão:** 11/06/2026 | **Responsável:** TM · Sempre Tecnologia
