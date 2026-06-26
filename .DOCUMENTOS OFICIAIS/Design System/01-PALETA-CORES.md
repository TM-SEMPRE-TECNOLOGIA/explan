# 🎨 Paleta de Cores

## Cores Base (Neutras)

Formam a identidade visual principal da Explan. Usadas em backgrounds, textos e componentes estruturais.

### Olive — #41422F
Cor corporativa principal. Marrom-oliva com tom sofisticado.

**Usos:**
- Header (fundo)
- Sidebar (fundo)
- Footer (fundo)
- Botões primários (estado padrão)
- Chips selecionados
- Bordas em destaques

**Contraste:**
- Com Cream (#EBE6DD): ✓ 8.2:1 (AAA)
- Com White (#FFFFFF): ✓ 10.1:1 (AAA)

```css
--olive: #41422F;
--olive-rgb: 65, 66, 47;
```

---

### Cream — #EBE6DD
Fundo principal. Cálido, acessível, reduz fadiga ocular.

**Usos:**
- Background geral da aplicação
- Fundo de cards
- Campos de formulário (padrão)
- Espaço negativo

**Contraste:**
- Com Olive (#41422F): ✓ 8.2:1 (AAA)
- Com texto (#212121): ✓ 12.5:1 (AAA)

```css
--cream: #EBE6DD;
--cream-rgb: 235, 230, 221;
```

---

### Cream Alt — #F5F2ED
Fundo secundário. Mais claro que Cream, para diferenciação sutil.

**Usos:**
- Cabeçalhos de cards (header)
- Linhas alternadas em tabelas
- Backgrounds de seções
- Hover em elementos neutros

**Contraste:**
- Com texto (#212121): ✓ 13.8:1 (AAA)

```css
--cream-alt: #F5F2ED;
```

---

### Cream Dark — #D8D4CC
Fundo terciário. Mais escuro, para bordas e detalhes.

**Usos:**
- Bordas de cards
- Divisórias (borders)
- Backgrounds de placeholders
- Linhas de separação

```css
--cream-dark: #D8D4CC;
```

---

## Cores de Texto

### Text — #212121 (Quase preto)
Texto principal. Alto contraste, legível em fundos claros.

**Usos:**
- Títulos
- Corpos de texto
- Labels principais
- Elementos com alta importância

```css
--text: #212121;
```

---

### Text Body — #4A4A4A (Cinza escuro)
Texto secundário. Confortável para leitura prolongada.

**Usos:**
- Parágrafos
- Descrições
- Conteúdo de cards
- Textos informativos

```css
--text-body: #4A4A4A;
```

---

### Text Muted — #797979 (Cinza médio)
Texto terciário. Para informações menos importantes.

**Usos:**
- Labels de campo
- Hints e placeholders
- Textos desabilitados (parcial)
- Créditos e rodapé
- Descrições secundárias

```css
--text-muted: #797979;
```

---

## Cores Semânticas

Indicam significado, ação ou estado. Seguem convenções globais.

### Green — #6B8E5E
Sucesso, confirmação, progresso positivo. Verde musgo alinhado ao Projeto de Marca Explan (Morath Studio).

**Usos:**
- Descontos aplicados (badges)
- Botões de ação positiva ("Gerar", "Salvar", "Confirmar")
- Indicadores de sucesso
- Checkmarks
- Progresso completo

**Contraste:**
- Com White: ✓ 6.8:1 (AAA)
- Com Cream: ✓ 8.2:1 (AAA)

```css
--green: #6B8E5E;
```

---

### Red — #C0392B
Erro, perigo, exclusão.

**Usos:**
- Botões de deletar
- Mensagens de erro
- Estados críticos
- Avisos
- Hover em ação destrutiva

**Contraste:**
- Com White: ✓ 5.2:1 (AAA)
- Com Cream: ✓ 6.1:1 (AAA)

```css
--red: #C0392B;
```

---

## Cores de Estrutura

### White — #FFFFFF
Branco puro. Máximo contraste.

**Usos:**
- Fundos de cards/modais
- Inputs e selects
- Botões secundários
- Espaço em branco estratégico

```css
--white: #FFFFFF;
```

---

### Black — #000000
Preto puro. Máximo contraste.

**Usos:**
- Botões primários (estado padrão)
- Textos críticos
- Linhas de separação forte
- Backgrounds contrastantes

```css
--black: #000000;
```

---

### Border — #CCD6DF
Cor para bordas de formulários e linhas de separação suave.

**Usos:**
- Bordas de inputs
- Separadores entre elementos
- Linhas de tabelas
- Divisórias suaves

```css
--border: #CCD6DF;
```

---

## Combinações Recomendadas

### Pares de Alto Contraste (AAA)
- Olive + Cream: 8.2:1 ✓
- Olive + White: 10.1:1 ✓
- Cream + Text: 12.5:1 ✓
- Text + White: 21:1 ✓

### Pares Moderados (AA)
- Red + Cream: 6.1:1 ✓
- Green + White: 6.8:1 ✓

---

## Implementação CSS

```css
:root {
  /* ── NEUTRAS ── */
  --olive:        #41422F;
  --cream:        #EBE6DD;
  --cream-alt:    #F5F2ED;
  --cream-dark:   #D8D4CC;
  
  /* ── TEXTO ── */
  --text:         #212121;
  --text-body:    #4A4A4A;
  --text-muted:   #797979;
  
  /* ── SEMÂNTICAS ── */
  --green:        #6B8E5E;
  --red:          #C0392B;
  
  /* ── ESTRUTURA ── */
  --white:        #FFFFFF;
  --black:        #000000;
  --border:       #CCD6DF;
}
```

---

## Variações e Tints

Para casos especiais, usar rgba() ao invés de criar novas cores:

```css
/* Hover com transparência */
background: rgba(65, 66, 47, 0.08); /* Olive 8% */

/* Focus states */
box-shadow: 0 0 0 3px rgba(110, 193, 228, 0.15); /* Cyan 15% */

/* Backgrounds alterados */
background: rgba(59, 94, 39, 0.08); /* Green 8% */
```

---

## Exportação para Outras Plataformas

### Figma
Copiar direto para variáveis do Figma:
- Collections > Colors
- Paste: `#41422F` (Olive), `#EBE6DD` (Cream), etc.

### Tailwind CSS
```js
module.exports = {
  theme: {
    colors: {
      olive: '#41422F',
      cream: '#EBE6DD',
      cream-alt: '#F5F2ED',
      // ... resto
    }
  }
}
```

### SCSS
```scss
$olive: #41422F;
$cream: #EBE6DD;
// ...
```

---

**Última revisão:** 11/06/2026 | **Responsável:** TM · Sempre Tecnologia
