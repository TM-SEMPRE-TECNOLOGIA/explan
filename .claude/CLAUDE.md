# CLAUDE.md — Explan Orçamento Express
> Instruções obrigatórias para o Claude Code neste projeto.
> Lidas automaticamente em toda sessão.

---

## REGRA 1 — VERSIONAMENTO OBRIGATÓRIO (nunca sobrescrever)

**Antes de editar QUALQUER arquivo HTML, JS, CSS ou JSON do projeto:**

1. Copiar o arquivo original para `EM DESENVOLVIMENTO/Legado/Versões/`
2. Nomear com sufixo de versão: `nome-arquivo-VN.html` (ex: `sprint-09-V2.html`)
3. Verificar qual é o próximo número de versão consultando o que já existe em `Legado/Versões/`
4. Só então editar o arquivo na raiz do projeto

**Exemplo correto:**
```
# Antes de editar orçamento-editor.html:
Legado/Versões/orçamento-editor-V1.html  ← já existe
→ copiar atual como orçamento-editor-V2.html
→ editar orçamento-editor.html na raiz
```

**Por quê:** Permite reverter para qualquer versão anterior sem depender de git.
Arquivos grandes com layouts complexos podem quebrar — o backup garante recuperação imediata.

**Nunca pular esta etapa**, mesmo para edições pequenas (1 linha de CSS, 1 atributo HTML).

---

## REGRA 2 — SERVIDOR HTTP (porta fixa 8181)

- Porta **8181 FIXA** — nunca mudar
- Server root: `.LP-ORÇAMENTO/` (não `EM DESENVOLVIMENTO/`)
- localStorage é scoped por origin — mudar porta = perder dados do cliente
- Assets (imagens, logos) devem estar DENTRO de `.LP-ORÇAMENTO/` para serem servidos

---

## REGRA 3 — DESIGN SYSTEM v2.0

- **Fonte:** Archivo apenas (300–700) — nunca Playfair Display, Inter, Arial
- **Verde musgo:** `#6B8E5E`
- **Olive:** `#41422F`
- **Cream:** `#EBE6DD`
- **Sem magenta:** nunca usar `#CC3366` ou `rgba(204,51,102,...)`

---

## REGRA 4 — RODAPÉ DO PDF (cliente não vê crédito TM)

- Rodapés dos documentos PDF entregues ao cliente: usar "Explan Móveis Planejados"
- Referência "TM · Sempre Tecnologia" só aparece em páginas internas/admin, nunca no PDF final

---

## STACK & ESTRUTURA

- HTML/CSS/JS puro — sem frameworks
- localStorage keys: `explan_oc`, `explan_projetos`, `explan_auth`, `explan_perfil`
- Playwright (Python) para automação E2E: `entrada_karla_luiz.py`
- Backup de projetos: `karla_luiz_backup.json`

## ARQUIVOS PRINCIPAIS

| Arquivo | Função |
|---------|--------|
| `sprint-09.html` | App principal (orçamento) |
| `login.html` | Login (nome fixo, nunca renomear) |
| `orçamento-editor.html` | PDF do orçamento (portrait A4) |
| `apresentacao-editor.html` | Apresentação visual (landscape A4) |
| `catalogo-itens.json` | Catálogo de itens e preços |
