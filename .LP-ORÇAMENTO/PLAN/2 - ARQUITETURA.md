# Arquitetura — Explan Orçamento Express

---

## Stack Atual (Fase 1 — Em produção)

```
Browser
  └── HTML/CSS/JS puro
        ├── localStorage (dados do orçamento, perfil, clientes, projetos)
        └── window.open() (comunicação entre páginas)

Hospedagem: GitHub Pages (estático, gratuito)
Autenticação: simulada em localStorage (sem servidor)
```

**Páginas:**
| Arquivo | Função |
|---|---|
| `login.html` | Tela de login (auth simulada) |
| `sprint-{N}.html` | App principal — orçamento |
| `pdf-preview.html` | Preview/geração do PDF de orçamento |
| `apresentacao-editor.html` | Editor de apresentação visual por ambiente |
| `contrato-servico.html` | Template do contrato auto-preenchido |

**Fluxo de dados atual:**
```
login.html
  → [localStorage: explan_user_session]
  → sprint-09.html
      → [localStorage: explan_oc]       (dados do orçamento)
      → [localStorage: explan_perfil]   (perfil do vendedor)
      → [localStorage: explan_clientes] (lista de clientes)
      → [localStorage: explan_projetos] (orçamentos salvos)
      ├── pdf-preview.html              (lê explan_oc)
      ├── apresentacao-editor.html      (lê explan_oc)
      └── contrato-servico.html         (lê explan_oc)
```

---

## Stack Futura (Fase 2 — Quando escalar)

```
Browser
  └── HTML/CSS/JS puro (mesma interface)
        └── Supabase JS SDK

Supabase (BaaS)
  ├── Auth: email/senha ou magic link
  ├── PostgreSQL: clientes, orçamentos, ambientes, itens
  └── Storage: imagens de ambientes (opcional)

WhatsApp (Evolution API)
  └── Self-hosted em Railway/VPS
        └── POST /message após geração de orçamento
```

### Tabelas Supabase Planejadas

```sql
users           -- vendedores (gerenciado pelo Supabase Auth)
clientes        -- id, nome, email, whatsapp, cpf, criado_em, user_id
orcamentos      -- id, ref, cliente_id, total, status, dados_json, criado_em, user_id
ambientes       -- id, orcamento_id, nome, total, config_materiais_json
itens           -- id, ambiente_id, nome, unidade, qtd, preco_unit, subtotal
```

### Migração Gradual

1. **Passo 1 (atual):** localStorage apenas
2. **Passo 2:** Adicionar Supabase Auth — substituir login simulado por autenticação real, manter dados em localStorage
3. **Passo 3:** Migrar `explan_clientes` e `explan_projetos` para Supabase (dupla escrita localStorage + banco)
4. **Passo 4:** Remover localStorage como fonte de verdade — apenas Supabase
5. **Passo 5:** Evolution API para notificações WhatsApp

### Como Integrar o Login (Passo 2)

Em `login.html`, substituir `handleLogin()`:

```javascript
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient('SUPABASE_URL', 'SUPABASE_ANON_KEY')

async function handleLogin(event) {
  event.preventDefault()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  })
  if (error) return showAlert(error.message, 'error')
  localStorage.setItem('explan_user_session', JSON.stringify(data.session))
  window.location.href = 'sprint-09.html'
}
```

---

## Evolution API — Integração WhatsApp

**Endpoint de envio:**
```
POST https://{seu-servidor}/message/sendText/{instance}
Authorization: Bearer {apikey}
Content-Type: application/json

{
  "number": "5562999999999",
  "text": "Olá {nome}, seu orçamento Explan está pronto! Valor: R$ {total}. Ref: {ref}"
}
```

**Onde chamar:** dentro de `puGerarPDF()`, após `localStorage.setItem('explan_oc', ...)`

**Custo:** Evolution API é open source. Hospedagem Railway ~$5/mês.

---

## GitHub Pages — Deploy

```
Repositório: github.com/{usuario}/explan-orcamento
Branch: main
Pasta raiz: .LP-ORÇAMENTO/EM DESENVOLVIMENTO/
URL: {usuario}.github.io/explan-orcamento/login.html
```

**Para subir:**
```bash
git init
git add .
git commit -m "feat: Explan Orçamento Express v1"
git remote add origin https://github.com/{usuario}/explan-orcamento.git
git push -u origin main
# Ativar GitHub Pages em Settings > Pages > Branch: main
```
