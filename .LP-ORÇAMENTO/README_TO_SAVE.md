# Guia de Organização de Arquivos — Explan LP-ORÇAMENTO

> Use este guia sempre que precisar salvar um novo arquivo no projeto. Cada tipo de arquivo tem uma pasta definida.

---

## Estrutura de Pastas

```
.LP-ORÇAMENTO/
├── EM DESENVOLVIMENTO/          ← Arquivos ativos do app
│   ├── sprint-{N}.html          ← App principal (versão corrente)
│   ├── login.html               ← Tela de login (nome fixo)
│   ├── pdf-preview.html         ← Preview/geração de PDF
│   ├── apresentacao-editor.html ← Editor visual de apresentação
│   ├── contrato-servico.html    ← Template do contrato HTML
│   └── Legado/                  ← Versões antigas do app
│       └── sprint-{N-1}.html
│
├── plan/                        ← Documentos de planejamento e arquitetura
│   ├── PLANO.md                 ← README geral do projeto (visão, features, stack)
│   ├── ROADMAP.md               ← Fases e status de cada funcionalidade
│   ├── ARQUITETURA.md           ← Stack atual + futura (Supabase, Evolution API)
│   └── Projeção do Futuro.md    ← Ideias e funcionalidades planejadas
│
├── design-system/               ← Documentação do Design System v2.0
│   ├── 01-PALETA-CORES.md
│   ├── 02-TIPOGRAFIA.md
│   ├── design-system.css
│   └── README.md
│
├── imagens-ambientes/           ← Fotos de referência para orçamentos
│   └── *.jpg / *.png
│
├── Relatórios/                  ← Relatórios gerados (análises, testes, auditorias)
│   └── relatorio-YYYY-MM-DD.md
│
├── catalogo-itens.json          ← Fonte de dados do catálogo (edite aqui)
├── catalogo-itens.xlsx          ← Planilha gerada a partir do JSON (não edite, regere)
└── README_TO_SAVE.md            ← Este arquivo
```

---

## Onde Salvar Cada Tipo de Arquivo

| Tipo de arquivo | Pasta |
|---|---|
| Novo HTML do app (sprint atual) | `EM DESENVOLVIMENTO/sprint-{N}.html` |
| Versão antiga do app | `EM DESENVOLVIMENTO/Legado/` |
| Login, PDF preview, contrato, apresentação | `EM DESENVOLVIMENTO/` (nome descritivo fixo) |
| Plano de sprint / decisão de arquitetura | `plan/` |
| Ideia futura / funcionalidade planejada | `plan/Projeção do Futuro.md` |
| Documentação do roadmap | `plan/ROADMAP.md` |
| Documentação de stack / infra | `plan/ARQUITETURA.md` |
| Relatório de análise / auditoria | `Relatórios/relatorio-YYYY-MM-DD.md` |
| Imagem de ambiente para orçamento | `imagens-ambientes/` |
| Atualização do catálogo de itens | `catalogo-itens.json` (e regere o .xlsx) |
| CSS/tokens do design system | `design-system/` |

---

## Convenções de Nomenclatura

- **sprint-{N}.html** — número sequencial, sem zeros à esquerda (sprint-9, sprint-10…)
- **login.html** — nome fixo, nunca renomear
- **Relatórios** — prefixo de data: `relatorio-2026-06-11-analise-catalogo.md`
- **Legado** — mover versão anterior APÓS o novo sprint estar funcional

---

## Regras Gerais

1. **Nunca editar** `catalogo-itens.xlsx` diretamente — sempre editar o `.json` e regenerar
2. **Nunca commitar** arquivos com segredos (API keys, senhas) — usar variáveis de ambiente
3. **Mover para Legado/** antes de excluir qualquer sprint anterior
4. **Atualizar** `plan/ROADMAP.md` ao concluir cada sprint
5. **Imagens** do app (logo, etc.) ficam em `C:\Users\thiag\Desktop\Explan\Imagens\`
