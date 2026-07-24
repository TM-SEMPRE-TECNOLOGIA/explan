# README — Imagens de Ambientes · Explan

Todas as imagens desta pasta são utilizadas na landing page, nos cards de seleção de ambiente e na pré-visualização do PDF de orçamento.  
As imagens atuais foram geradas com IA (Manus / Stitch) para fins de prototipagem. Quando a Explan tiver fotos reais dos projetos executados, basta substituir os arquivos mantendo **exatamente o mesmo nome**.

---

## Índice por arquivo

| Arquivo | Origem | Usado em | Descrição |
|---|---|---|---|
| `hero-principal.jpg` | Manus | Hero da LP (tela cheia) | Imagem de impacto da página principal — ambiente integrado planejado |
| `hero-ambientes.jpg` | Manus | Seção "Escolha seus ambientes" | Banner de fundo da seção de seleção de ambientes |
| `hero-fechamento.jpg` | Manus | Seção de fechamento / CTA final | Imagem motivacional antes do botão de orçamento |
| `card-sala-estar.jpg` | Stitch | Card de seleção — Sala de Estar | Thumbnail clicável do wizard de orçamento |
| `card-cozinha.jpg` | Stitch | Card de seleção — Cozinha | Thumbnail clicável do wizard de orçamento |
| `card-dormitorio.jpg` | Stitch | Card de seleção — Dormitório | Thumbnail clicável do wizard de orçamento |
| `card-banheiro.jpg` | Stitch | Card de seleção — Banheiro | Thumbnail clicável do wizard de orçamento |
| `card-closet.jpg` | Stitch | Card de seleção — Closet | Thumbnail clicável do wizard de orçamento |
| `card-home-office.jpg` | Stitch | Card de seleção — Home Office | Thumbnail clicável do wizard de orçamento |
| `pdf-capa-generica.jpg` | Manus | Capa do PDF de orçamento | Imagem de capa padrão quando o cliente não especificou ambiente principal |
| `pdf-sala-estar.jpg` | Manus | PDF — página do ambiente Sala de Estar | Foto de referência do ambiente no relatório de orçamento |
| `pdf-sala-jantar.jpg` | Manus | PDF — página do ambiente Sala de Jantar | Foto de referência do ambiente no relatório de orçamento |
| `pdf-cozinha.jpg` | Manus | PDF — página do ambiente Cozinha | Foto de referência do ambiente no relatório de orçamento |
| `pdf-dormitorio-casal.jpg` | Manus | PDF — página do ambiente Dormitório Casal | Foto de referência do ambiente no relatório de orçamento |
| `pdf-dormitorio-master.jpg` | Manus | PDF — página do ambiente Dormitório Master | Foto de referência do ambiente no relatório de orçamento |
| `pdf-dormitorio-filho.jpg` | Manus | PDF — página do ambiente Dormitório Filho | Foto de referência do ambiente no relatório de orçamento |
| `pdf-banheiro.jpg` | Manus | PDF — página do ambiente Banheiro | Foto de referência do ambiente no relatório de orçamento |
| `pdf-closet.jpg` | Manus | PDF — página do ambiente Closet | Foto de referência do ambiente no relatório de orçamento |
| `pdf-closet-alt.jpg` | Manus | PDF — variação alternativa de Closet | Imagem alternativa usada quando há dois closets no orçamento |
| `pdf-home-office.jpg` | Manus | PDF — página do ambiente Home Office | Foto de referência do ambiente no relatório de orçamento |
| `pdf-home-office-alt.jpg` | Manus | PDF — variação alternativa de Home Office | Imagem alternativa para home office secundário |
| `pdf-lavanderia.jpg` | Manus | PDF — página do ambiente Lavanderia | Foto de referência do ambiente no relatório de orçamento |
| `pdf-area-gourmet.jpg` | Manus | PDF — página do ambiente Área Gourmet | Foto de referência do ambiente no relatório de orçamento |

---

## Como substituir por fotos reais da Explan

1. Tire fotos dos projetos executados com boa iluminação (preferencialmente 16:9 horizontal para heroes, 3:2 para cards e PDFs).
2. Exporte em JPG, qualidade alta (recomendado: 1200–1920px de largura, entre 200KB e 1.5MB por imagem).
3. Salve o arquivo com **exatamente o mesmo nome** do arquivo que deseja substituir (ex: `pdf-cozinha.jpg`).
4. Cole na pasta `imagens-ambientes/` sobrescrevendo o arquivo anterior.
5. Teste abrindo `prototipo-wizard.html` e `pdf-preview.html` no navegador para conferir como ficaram.

Nenhuma alteração de código é necessária — as imagens são referenciadas pelo nome exato nos HTMLs.

---

## Observações

- Imagens com prefixo `card-` aparecem nos cards de seleção do wizard. Devem ser quadradas ou 4:3 para não distorcer no layout.
- Imagens com prefixo `pdf-` aparecem dentro do PDF de orçamento. Proporção recomendada: 16:9 ou 3:2.
- Imagens com prefixo `hero-` ocupam largura total da tela. Devem ter no mínimo 1440px de largura.
- Os arquivos `*-alt.jpg` são variações secundárias — úteis quando o cliente seleciona mais de um ambiente do mesmo tipo.
