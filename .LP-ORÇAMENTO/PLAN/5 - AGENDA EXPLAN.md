# Agenda Explan — Plano de Produto

> Origem: ideia surgida durante o desenvolvimento do login.html · 12/06/2026  
> Status: **Conceito** — não iniciado

---

## Visão Geral

Módulo de gestão de agenda e relacionamento com clientes integrado ao ecossistema Explan. Acessível via dashboard pós-login, ao lado do Orçamento Express.

**Problema que resolve:** hoje o vendedor não tem onde registrar follow-ups, datas de visita, histórico de contato e próximos passos com cada cliente — essa informação fica em papel, WhatsApp ou memória.

---

## Público-alvo

Vendedores da Explan Móveis Planejados — usuários do mesmo login do Orçamento Express.

---

## Funcionalidades Planejadas

### Fase 1 — MVP de Agenda
- [ ] Calendário mensal/semanal com visitas agendadas
- [ ] Cadastro rápido de cliente (nome, telefone, e-mail)
- [ ] Registro de visita: data, hora, endereço, observações
- [ ] Status do contato: `Novo` → `Em proposta` → `Fechado` → `Perdido`
- [ ] Lista de follow-ups do dia (painel "Hoje")

### Fase 2 — Integração com Orçamento Express
- [ ] Vincular orçamento salvo ao cadastro do cliente
- [ ] Histórico de orçamentos por cliente
- [ ] Botão "Abrir Orçamento" direto do card do cliente
- [ ] Notificação visual de proposta pendente há X dias

### Fase 3 — Comunicação
- [ ] Link de WhatsApp pré-preenchido com nome do cliente
- [ ] Modelo de mensagem de follow-up personalizável
- [ ] Exportar resumo do cliente em PDF (histórico + orçamentos)

---

## Stack Sugerida

| Camada | Tecnologia |
|---|---|
| Frontend | HTML + CSS + JS puro (mesmo padrão do ecossistema) |
| Backend | Supabase (já previsto na arquitetura atual) |
| Autenticação | Reutilizar login.html existente |
| Calendário | Biblioteca leve — FullCalendar (CDN) ou CSS puro |
| Dados | Tabelas `clientes`, `visitas`, `followups` no Supabase |

---

## Design

- Seguir o **Design System v2.0** do ecossistema Explan
- Paleta: Olive `#41422F`, Green `#6B8E5E`, Cream `#EBE6DD`, Archivo
- Card no dashboard: ícone 🗓️, nome "Agenda Explan", badge "Em breve" → virar "Disponível"
- Layout: sidebar de clientes à esquerda + calendário central (desktop) / abas (mobile)

---

## Integrações Futuras

- **Google Calendar** — sincronizar visitas com a agenda pessoal do vendedor
- **CRM Explan** — se houver sistema legado, importar base de clientes
- **Relatório gerencial** — visão do gestor com agenda de toda a equipe

---

## Próximos Passos

1. Validar prioridade com Ygor: Agenda ou outra feature primeiro?
2. Definir schema do Supabase para `clientes` e `visitas`
3. Criar `sprint-10.html` como protótipo da tela de agenda
4. Atualizar card no dashboard de `pointer-events: none` para funcional

---

> **Nota:** O card de "Agenda Explan" já está reservado visualmente no dashboard do `login.html` (desabilitado/translúcido). Basta remover o `opacity: .55; pointer-events: none` e apontar para o novo módulo quando pronto.
