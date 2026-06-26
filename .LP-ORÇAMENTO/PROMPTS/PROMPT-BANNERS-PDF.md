# Prompts para Geração de Imagens — Banners PDF Explan

**Uso:** Cole estes prompts no Higgsfield, Midjourney, DALL-E 3, ou Stable Diffusion.
**Formato alvo:** 1600×1040px (proporcional a 800×520 com 2× para alta resolução)
**Estilo geral:** interior design photography, editorial lifestyle, warm natural lighting, no people

---

## Diretrizes Gerais de Estilo

Todas as imagens devem seguir esta paleta e atmosfera:
- **Tons quentes**: madeira natural, bege, off-white, pedra natural
- **Iluminação**: luz natural difusa vinda da janela, sem sombras duras
- **Composição**: ângulo em perspectiva (45°), mostrando o ambiente com profundidade
- **Acabamento**: fotografia profissional de alto padrão, foco nítido, sem distorção de lente
- **Sem pessoas** em nenhuma imagem
- **Integração com a marca**: os tons devem funcionar bem sob um overlay `rgba(65,66,47,0.75)` (oliva escuro)

---

## PROMPT 01 — Capa Genérica (hero da capa do PDF)

```
High-end Brazilian furniture showroom interior, wide angle shot, 
modern planned furniture kitchen and living room in background, 
warm wood tones, natural light from large windows, 
soft bokeh depth of field, beige and olive color palette,
editorial photography style, architectural photography,
luxury residential interior design Brazil,
no people, sharp details, photorealistic,
16:10 aspect ratio, ultra high resolution
```

**Uso:** Fundo full-bleed da página de capa. Recebe overlay olive 78%.

---

## PROMPT 02 — Cozinha

```
Modern planned kitchen, Brazilian interior design, 
upper and lower cabinets in warm wood veneer and matte white,
quartz countertop, integrated appliances,
soft morning light, natural materials,
wide angle perspective shot showing full kitchen layout,
olive green and beige color accents,
professional architectural photography,
no people, photorealistic, ultra sharp,
800x520px landscape
```

---

## PROMPT 03 — Dormitório Master

```
Luxury master bedroom with planned wardrobe, Brazilian interior,
built-in closet with sliding doors in warm wood tone,
bed panel headboard integrated with storage,
warm ambient lighting, neutral palette beige and wood,
editorial interior photography, wide angle,
showing full bedroom layout with high ceiling,
no people, photorealistic, soft natural light
```

---

## PROMPT 04 — Dormitório Filho / Infantil

```
Modern children's bedroom with planned furniture,
colorful accent wall, built-in desk and wardrobe,
white and wood combination, fun but sophisticated,
Brazilian interior design, natural light,
wide angle showing full room, organized and clean,
no toys scattered, editorial style photography,
no people, photorealistic
```

---

## PROMPT 05 — Dormitório Casal

```
Elegant couple's bedroom, Brazilian contemporary design,
built-in wardrobe with dark wood and matte finish,
floating bed panel with integrated lighting,
warm white and wood tones, sophisticated atmosphere,
natural morning light, editorial photography,
wide angle room shot, no people, photorealistic
```

---

## PROMPT 06 — Sala de Estar

```
Contemporary Brazilian living room,
built-in TV panel with floating shelves,
warm wood ribbed wall panel behind sofa area,
integrated storage cabinets, neutral beige and wood palette,
natural light from large windows, editorial interior photography,
wide angle showing full living room,
no people, photorealistic, ultra sharp
```

---

## PROMPT 07 — Home Office

```
Modern home office with planned furniture,
built-in desk and shelving unit in wood and matte white,
organized cables, monitor setup on clean desk,
warm ambient lighting, plant accent,
Brazilian contemporary interior design,
editorial photography, wide angle showing full office,
no people, photorealistic, natural light
```

---

## PROMPT 08 — Lavanderia

```
Organized laundry room with planned cabinets,
upper storage cabinets in white and wood,
clean countertop for folding, hidden appliances,
warm lighting, small but functional space,
Brazilian interior design, editorial photography,
wide angle, no people, photorealistic
```

---

## PROMPT 09 — Banheiro

```
Luxury bathroom with planned furniture,
floating vanity cabinet in wood veneer and white,
integrated mirror cabinet with LED lighting,
marble-look countertop, warm bathroom lighting,
Brazilian contemporary design, editorial photography,
wide angle showing full bathroom,
no people, photorealistic, clean and organized
```

---

## PROMPT 10 — Closet

```
Walk-in closet, Brazilian luxury interior design,
built-in wardrobe with drawers, shelves and hanging rods,
wood and matte white combination, LED strip lighting,
organized and elegant, editorial photography style,
wide angle showing full closet layout,
no people, photorealistic, warm ambient light
```

---

## PROMPT 11 — Área Gourmet

```
Outdoor Brazilian gourmet area with planned kitchen,
built-in barbecue island with wood cabinets,
pendant lights, stone countertop,
warm evening lighting, plants in background,
editorial architectural photography,
wide angle showing full gourmet area,
no people, photorealistic
```

---

## PROMPT 12 — Sala de Jantar

```
Modern Brazilian dining room,
built-in sideboard and china cabinet in warm wood,
integrated wine rack and display shelves,
ambient pendant lighting, elegant atmosphere,
editorial interior photography, wide angle,
no people, photorealistic, warm neutral palette
```

---

## Notas de Uso

### Ajuste de prompt para DALL-E 3
Adicione no início: `"Photorealistic interior design photography:"` e no final `"--ar 16:10 --style raw"`

### Ajuste para Midjourney
Adicione no final: `--ar 16:10 --style raw --v 6 --q 2`

### Ajuste para Higgsfield (generate_image)
Use o prompt com: `style: "photorealistic"`, `aspect_ratio: "16:10"`, `quality: "high"`

### Após gerar as imagens
1. Salve em `LP-ORÇAMENTO/imagens-ambientes/[nome-ambiente].jpg`
2. Substitua as URLs do Unsplash no `pdf-preview.html` pelo caminho local
3. Teste com `window.print()` para verificar que a imagem carrega corretamente no PDF

---

*Prompts criados por TM · Sempre Tecnologia para o projeto Explan Orçamento Express*
