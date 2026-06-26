# Projeção do Futuro — Explan Orçamento Express

Ideias e funcionalidades para fases futuras. Nenhum item aqui está em desenvolvimento ativo — são registros para quando o projeto crescer.

---

## Notificações

### Email ao Ygor via EmailJS
Quando um orçamento for finalizado e o PDF gerado, enviar automaticamente um e-mail ao Ygor com:
- Nome do cliente
- Valor total do orçamento
- Referência (EXP-YYYY-MMDD)
- Link ou resumo dos ambientes

**Como implementar quando chegar a hora:**
- Criar conta em emailjs.com (plano gratuito: 200 emails/mês)
- Criar template de email no painel EmailJS
- Adicionar SDK: `<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js">`
- Chamar `emailjs.send(serviceId, templateId, dados)` dentro de `puGerarPDF()`
- Chaves públicas ficam no HTML (não há backend — ok para uso interno)

---

## WhatsApp (Evolution API) Vamos usar TYPEBOT e N8N

Envio automático de mensagem ao cliente via WhatsApp após geração do orçamento.

**Stack planejada:**
- [Evolution API](https://github.com/EvolutionAPI/evolution-api) — self-hosted, open source
- Hospedagem: Railway ou VPS própria (mínimo 512MB RAM)
- Autenticação: chave de API gerada no painel Evolution
- Fluxo: `puGerarPDF()` → POST `/message/sendText/{instance}` com número do cliente + mensagem personalizada

**Quando considerar:** quando o volume de orçamentos justificar automação (>20/mês).

---

## Supabase — Auth e Banco de Dados

Atualmente tudo está em localStorage (sem servidor). Migração planejada para quando precisar de:
- Múltiplos vendedores (cada um com sua conta)
- Histórico de orçamentos persistente (não apaga ao limpar navegador)
- Dashboard Ygor: ver todos os orçamentos gerados pela equipe

**Plano de migração detalhado:** ver `ARQUITETURA.md`

---

## Outras Ideias (adicionar aqui)

<!-- O usuário pode pedir para guardar novas ideias aqui -->
