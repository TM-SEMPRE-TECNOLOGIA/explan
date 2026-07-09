// Gera 6 orçamentos premium (>R$70k) com materiais e pagamentos variados
import { chromium } from 'playwright';

const URL = 'file:///C:/Users/thiag/Desktop/Explan/.LP-OR%C3%87AMENTO/_VERCEL/v2/painel-v2.html';

const orcamentos = [
  {
    cliente: 'Família Carvalho',
    whatsapp: '(62) 98123-4567',
    prazo: '60 dias',
    instalacao: '10 dias',
    pagamento: 'À vista — 7% de desconto (PIX / transferência)',
    endereco: 'Rua das Acácias, 450 — Setor Marista, Goiânia/GO',
    obs: 'Cliente indicou pressa na entrega. Preferência por MDF 15mm para reduzir peso.',
    ambientes: [
      { nome: 'Sala de Estar', chapa: '15', ferragem: 'blum', cor: 'cor', itens: [
        { nome: 'Painel Ripado com nichos e LED embutido', un: 'un', preco: 28500, qtd: 1 },
        { nome: 'Estante modular com 6 módulos', un: 'un', preco: 22000, qtd: 1 },
        { nome: 'Rack flutuante 3,5m com gavetas', un: 'un', preco: 12500, qtd: 1 },
      ]},
      { nome: 'Cozinha', chapa: '18', ferragem: 'blum', cor: 'cor', itens: [
        { nome: 'Cozinha completa planejada 4,5m bancada Silestone', un: 'un', preco: 38000, qtd: 1 },
        { nome: 'Ilha central com cooktop e banquetas', un: 'un', preco: 16500, qtd: 1 },
      ]},
      { nome: 'Área Gourmet', chapa: '15', ferragem: 'blum', cor: 'cor', itens: [
        { nome: 'Churrasqueira embutida com bancada e armários', un: 'un', preco: 24000, qtd: 1 },
      ]},
    ]
  },
  {
    cliente: 'Dr. Ricardo Mendes',
    whatsapp: '(62) 99111-2233',
    prazo: '45 dias',
    instalacao: '5 dias',
    pagamento: '50% assinatura + 50% conclusão',
    endereco: 'Av. T-63, 1200 — Setor Bueno, Goiânia/GO',
    ambientes: [
      { nome: 'Escritório / Home Office', chapa: '18', ferragem: 'hafele', cor: 'cor', itens: [
        { nome: 'Biblioteca do chão ao teto 4m lineares', un: 'un', preco: 32000, qtd: 1 },
        { nome: 'Mesa executiva 2,20m com gaveteiro', un: 'un', preco: 18000, qtd: 1 },
        { nome: 'Painel acústico ripado atrás da mesa', un: 'un', preco: 9500, qtd: 1 },
      ]},
      { nome: 'Closet', chapa: '18', ferragem: 'hafele', cor: 'branco', itens: [
        { nome: 'Closet completo 6m lineares com portas espelho', un: 'un', preco: 42000, qtd: 1 },
        { nome: 'Sapateira giratória e cabideiro deslizante', un: 'un', preco: 8500, qtd: 1 },
      ]},
    ]
  },
  {
    cliente: 'Condomínio Vista Bella',
    whatsapp: '(62) 99888-7766',
    prazo: '90 dias',
    instalacao: '15 dias',
    pagamento: 'Cartão de crédito — até 6x sem juros',
    endereco: 'Rua das Palmeiras, 100 — Alphaville, Goiânia/GO',
    ambientes: [
      { nome: 'Hall de Entrada', chapa: '18', ferragem: 'blum', cor: 'cor', itens: [
        { nome: 'Painel monumental com porta oculta e LED', un: 'un', preco: 35000, qtd: 1 },
        { nome: 'Balcão de recepção em mármore e MDF', un: 'un', preco: 28000, qtd: 1 },
        { nome: 'Espelho d\'água com deck de madeira', un: 'un', preco: 15000, qtd: 1 },
      ]},
      { nome: 'Sala de Estar', chapa: '15', ferragem: 'fgv', cor: 'branco', itens: [
        { nome: 'Painel TV 5m com nichos assimétricos', un: 'un', preco: 22000, qtd: 1 },
        { nome: 'Buffet lateral 3m com porta palha', un: 'un', preco: 16500, qtd: 1 },
      ]},
    ]
  },
  {
    cliente: 'Família Albuquerque',
    whatsapp: '(62) 98456-7890',
    prazo: '75 dias',
    instalacao: '12 dias',
    pagamento: '60% entrada + 40% em 4 boletos mensais',
    endereco: 'Alameda dos Buritis, 780 — Jardim Goiás, Goiânia/GO',
    ambientes: [
      { nome: 'Quarto Master', chapa: '18', ferragem: 'blum', cor: 'cor', itens: [
        { nome: 'Closet completo 10m lineares — Blum + portas espelho', un: 'un', preco: 58000, qtd: 1 },
        { nome: 'Painel TV frisado com gaveteiro e prateleira', un: 'un', preco: 22000, qtd: 1 },
        { nome: 'Cabeceira estofada + criados-mudos laterais', un: 'un', preco: 14000, qtd: 1 },
      ]},
      { nome: 'Banheiro Suíte', chapa: '15', ferragem: 'hafele', cor: 'branco', itens: [
        { nome: 'Gabinete duplo 2,4m bancada em porcelanato', un: 'un', preco: 18500, qtd: 1 },
        { nome: 'Nicho espelhado com LED e prateleiras', un: 'un', preco: 7500, qtd: 1 },
      ]},
      { nome: 'Closet', chapa: '15', ferragem: 'hafele', cor: 'branco', itens: [
        { nome: 'Closet infantil com módulos coloridos', un: 'un', preco: 12000, qtd: 1 },
      ]},
    ]
  },
  {
    cliente: 'Clínica Serenity',
    whatsapp: '(62) 3300-1122',
    prazo: '60 dias',
    instalacao: '10 dias',
    pagamento: 'À vista — 7% de desconto (PIX / transferência)',
    endereco: 'Av. 136, 890 — Setor Sul, Goiânia/GO',
    ambientes: [
      { nome: 'Sala de Estar', chapa: '18', ferragem: 'blum', cor: 'cor', itens: [
        { nome: 'Balcão recepção curvo 5m com pastilhas', un: 'un', preco: 35000, qtd: 1 },
        { nome: 'Painel acústico decorativo 8m²', un: 'un', preco: 16000, qtd: 1 },
        { nome: 'Sofá modular embutido com nichos', un: 'un', preco: 22000, qtd: 1 },
      ]},
      { nome: 'Escritório / Home Office', chapa: '18', ferragem: 'blum', cor: 'cor', itens: [
        { nome: 'Estação de trabalho para 4 pessoas', un: 'un', preco: 28000, qtd: 1 },
        { nome: 'Arquivo deslizante 3m lineares', un: 'un', preco: 18000, qtd: 1 },
        { nome: 'Armário alto 4 portas com chave', un: 'un', preco: 14000, qtd: 1 },
      ]},
    ]
  },
  {
    cliente: 'Alexandre Torres',
    whatsapp: '(62) 98555-3344',
    prazo: '50 dias',
    instalacao: '8 dias',
    pagamento: '50% assinatura + 50% conclusão',
    endereco: 'Condomínio Terras Alpha, Rua 3, Casa 22 — Goiânia/GO',
    ambientes: [
      { nome: 'Sala de Estar', chapa: '18', ferragem: 'blum', cor: 'cor', itens: [
        { nome: 'Home Theater completo com painel acústico 6m', un: 'un', preco: 42000, qtd: 1 },
        { nome: 'Estante iluminada para coleção de vinhos', un: 'un', preco: 18000, qtd: 1 },
      ]},
      { nome: 'Área Gourmet', chapa: '15', ferragem: 'fgv', cor: 'branco', itens: [
        { nome: 'Bar molhado com bancada granito 3m', un: 'un', preco: 25000, qtd: 1 },
        { nome: 'Adega climatizada embutida 48 garrafas', un: 'un', preco: 16000, qtd: 1 },
        { nome: 'Mesa bistrô e banquetas sob medida', un: 'un', preco: 9500, qtd: 1 },
      ]},
    ]
  },
];

async function criarOrcamento(page, data) {
  // Preencher dados do cliente
  await page.evaluate(d => {
    const set = (id, val) => { const el = document.getElementById(id); if (el) { el.value = val; el.dispatchEvent(new Event('input', {bubbles:true})); } };
    set('nome-cliente', d.cliente);
    set('cliente-wpp', d.whatsapp);
    set('cliente-prazo', d.prazo);
    set('cliente-prazo-instalacao', d.instalacao);
    set('cliente-endereco', d.endereco);
    set('cliente-observacoes', d.obs || '');

    // Selecionar pagamento
    const pgtoSel = document.getElementById('cliente-pagamento');
    if (pgtoSel) {
      for (let o of pgtoSel.options) {
        if (o.textContent.trim() === d.pagamento) { o.selected = true; break; }
      }
    }
  }, data);

  // Criar ambientes com itens e materiais
  await page.evaluate(data => {
    const addBtn = document.querySelector('.add-env-btn');

    data.ambientes.forEach((amb, ambIdx) => {
      const envId = 'env-' + Date.now() + '-' + ambIdx;
      const sub = amb.itens.reduce((s, i) => s + (i.preco * i.qtd), 0);
      const subFmt = 'R$ ' + sub.toLocaleString('pt-BR', {minimumFractionDigits: 2});

      const itemsHTML = amb.itens.map(item => {
        const itemSub = (item.preco * item.qtd).toLocaleString('pt-BR', {minimumFractionDigits: 2});
        return `<div class="item-row manual-row" data-price="${item.preco}" data-manual="true">
      <img class="item-thumb" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect fill='%23B8D4B0' width='36' height='36' rx='5'/><text x='18' y='23' text-anchor='middle' fill='%236B8E5E' font-size='14'>M</text></svg>" alt="">
      <div class="item-name-cell"><div class="i-name">${item.nome} <span style="font-size:10px;color:var(--green);font-weight:600">manual</span></div><div class="i-unit">${item.un}</div></div>
      <div><input class="item-qty-inp" type="number" value="${item.qtd}" min="0" step="0.1" oninput="recalc()" data-price="${item.preco}"></div>
      <div class="item-unit-price">R$ ${item.preco.toLocaleString('pt-BR',{minimumFractionDigits:2})}/${item.un}</div>
      <div class="item-subtotal">R$ ${itemSub}</div>
      <button class="btn-del" onclick="delItem(this)">×</button>
    </div>`;
      }).join('');

      // Chapa chips
      const chapa18sel = amb.chapa === '18' ? ' selected' : '';
      const chapa15sel = amb.chapa === '15' ? ' selected' : '';
      // Ferragem chips
      const blumSel = amb.ferragem === 'blum' ? ' selected' : '';
      const hafeleSel = amb.ferragem === 'hafele' ? ' selected' : '';
      const fgvSel = amb.ferragem === 'fgv' ? ' selected' : '';
      // Cor chips
      const corSel = amb.cor === 'cor' ? ' selected' : '';
      const brancoSel = amb.cor === 'branco' ? ' selected' : '';

      const html = `<div class="env-card" data-env-id="${envId}">
    <div class="env-header" onclick="toggleEnv(this)">
      <span class="env-name">${amb.nome}</span>
      <div class="env-actions">
        <span class="env-disc-badge" id="discbadge-${envId}">Sem desconto</span>
        <span class="env-total-badge" id="etotal-${envId}">${subFmt}</span>
        <button class="btn-icon" onclick="toggleMaterials(event,'${envId}')" title="Configurar materiais">⚙</button>
        <button class="btn-del btn-danger" onclick="deleteEnv(event, this)" title="Excluir">✕</button>
        <span style="color:var(--text-muted)">▾</span>
      </div>
    </div>
    <div class="env-materials" id="envmat-${envId}" style="display:none">
      <div class="mat-header">Configuração de Materiais — ${amb.nome}</div>
      <div class="mat-row">
        <div class="mat-col"><h4>Chapa</h4><div class="chip-group">
          <div class="chip${chapa18sel}" onclick="selChip(this,'chapa','18','${envId}')"><span class="chip-name">Chapa 18</span><span class="chip-disc" style="color:var(--text-muted)">padrão</span></div>
          <div class="chip${chapa15sel}" onclick="selChip(this,'chapa','15','${envId}')"><span class="chip-name">Chapa 15</span><span class="chip-disc">−10% MDF</span></div>
        </div></div>
        <div class="mat-col"><h4>Ferragem</h4><div class="chip-group">
          <div class="chip${blumSel}" onclick="selChip(this,'ferragem','blum','${envId}')"><span class="chip-name">Blum</span><span class="chip-disc" style="color:var(--text-muted)">padrão</span></div>
          <div class="chip${hafeleSel}" onclick="selChip(this,'ferragem','hafele','${envId}')"><span class="chip-name">Häfele</span><span class="chip-disc">−5%</span></div>
          <div class="chip${fgvSel}" onclick="selChip(this,'ferragem','fgv','${envId}')"><span class="chip-name">FGV</span><span class="chip-disc">−15%</span></div>
        </div></div>
        <div class="mat-col"><h4>Cor Interna</h4><div class="chip-group">
          <div class="chip${corSel}" onclick="selChip(this,'cor','cor','${envId}')"><span class="chip-name">Com cor</span><span class="chip-disc" style="color:var(--text-muted)">padrão</span></div>
          <div class="chip${brancoSel}" onclick="selChip(this,'cor','branco','${envId}')"><span class="chip-name">Branco</span><span class="chip-disc">−5%</span></div>
        </div></div>
      </div>
    </div>
    <div class="env-body" id="ebody-${envId}">
      <div class="items-header"><div>ITEM</div><div>QTD</div><div>UNITÁRIO</div><div>SUBTOTAL</div><div></div></div>
      ${itemsHTML}
      <div class="add-row">
        <button class="btn btn-sm btn-secondary" onclick="toggleManualForm(this)">+ Manual</button>
      </div>
      <div class="manual-form">
        <div class="field"><label>Nome</label><input class="manual-nome" placeholder="Descrição do item"></div>
        <div class="field"><label>Un.</label><select class="manual-unidade"><option>un</option><option>m²</option><option>ml</option><option>hr</option><option>cj</option></select></div>
        <div class="field"><label>Preço R$</label><input class="manual-preco" type="number" step="0.01" placeholder="0,00"></div>
        <div class="field"><label>Qtd</label><input class="manual-qtd" type="number" step="0.1" value="1"></div>
        <button class="btn btn-sm btn-green" onclick="addManualItem(this)">✓ Adicionar</button>
      </div>
    </div>
  </div>`;

      if (addBtn) addBtn.insertAdjacentHTML('beforebegin', html);
    });

    // Recalcular totais
    if (typeof recalc === 'function') recalc();
  }, data);

  // Salvar projeto (via JS pra evitar clique bloqueado pela sidebar)
  await page.evaluate(() => { if (typeof salvarProjeto === 'function') salvarProjeto(); });
  await page.waitForTimeout(800);
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--start-maximized'] });
  const context = await browser.newContext();

  for (let i = 0; i < orcamentos.length; i++) {
    const data = orcamentos[i];
    const page = await context.newPage();
    
    page.on('dialog', async d => { await d.accept(); });
    
    await page.goto(URL, { waitUntil: 'networkidle' });
    
    await criarOrcamento(page, data);
    
    console.log(`✅ ${i+1}/6 — ${data.cliente}`);
    // Close tab but keep last one open
    if (i < orcamentos.length - 1) await page.close();
  }

  // Keep browser open on last page
  console.log('\n🎉 6 orçamentos salvos no seu Chrome!');
  console.log('Feche o navegador quando quiser.');
  await new Promise(() => {}); // keep alive
})();
