import { chromium } from 'playwright';

const HTML_PATH = 'file:///C:/Users/thiag/Desktop/Explan/.LP-OR%C3%87AMENTO/_VERCEL/v2/painel-v2.html';

const ambientes = [
  {
    nome: 'Quarto Master',
    emoji: '🛏️',
    itens: [
      { nome: 'Closet completo em MDF nas cores do projeto, ferragens Blum e 2 portas de espelho', unidade: 'un', preco: 49000, qtd: 1 },
      { nome: 'Painel de TV frisado com gaveteiro e prateleira', unidade: 'un', preco: 19800, qtd: 1 },
      { nome: 'Cabeceira da cama e criados nas cores do projeto', unidade: 'un', preco: 11750, qtd: 1 },
    ]
  },
  {
    nome: 'Hall de Entrada',
    emoji: '🚪',
    itens: [
      { nome: 'Painel com porta de correr, incluso fechadura elétrica, puxador metálico dourado, puxador em LED e fitas de LED', unidade: 'un', preco: 14150, qtd: 1 },
      { nome: 'Painel de espelho com fundo em MDF', unidade: 'un', preco: 9750, qtd: 1 },
    ]
  },
];

(async () => {
  const browser = await chromium.launch({ 
    headless: false, 
    args: ['--start-maximized', '--new-window'] 
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('dialog', async dialog => {
    console.log('Dialog:', dialog.message());
    await dialog.accept();
  });

  await page.goto(HTML_PATH, { waitUntil: 'networkidle' });
  console.log('Page loaded');

  await page.evaluate((data) => {
    document.querySelector('#nome-cliente').value = 'Alynne e Família';
    document.querySelector('#nome-cliente').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#cliente-prazo').value = '45 dias úteis';
    document.querySelector('#cliente-prazo-instalacao').value = '7 dias';
    document.querySelector('#cliente-observacoes').value = '7% de desconto à vista: R$ 97.138,50 | Cartão: 6x sem juros de R$ 17.408,33';

    const addBtn = document.querySelector('.add-env-btn');

    data.forEach((amb, ambIdx) => {
      const envId = 'env-a' + ambIdx;
      const sub = amb.itens.reduce((s, i) => s + (i.preco * i.qtd), 0);
      const subFmt = 'R$ ' + sub.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

      const itemsHTML = amb.itens.map(item => {
        const itemSub = (item.preco * item.qtd).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
        return `
    <div class="item-row manual-row" data-price="${item.preco}" data-manual="true">
      <img class="item-thumb" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><rect fill='%23B8D4B0' width='36' height='36' rx='5'/><text x='18' y='23' text-anchor='middle' fill='%236B8E5E' font-size='14'>M</text></svg>" alt="">
      <div class="item-name-cell"><div class="i-name">${item.nome} <span style="font-size:10px;color:var(--green);font-weight:600">manual</span></div><div class="i-unit">${item.unidade}</div></div>
      <div><input class="item-qty-inp" type="number" value="${item.qtd}" min="0" step="0.1" oninput="recalc()" data-price="${item.preco}"></div>
      <div class="item-unit-price">R$ ${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/${item.unidade}</div>
      <div class="item-subtotal">R$ ${itemSub}</div>
      <button class="btn-del" onclick="delItem(this)">×</button>
    </div>`;
      }).join('');

      const html = `
  <div class="env-card" data-env-id="${envId}">
    <div class="env-header" onclick="toggleEnv(this)">
      <span class="env-name">${amb.emoji} ${amb.nome}</span>
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
        <div class="mat-col"><h4>Chapa</h4>
          <div class="chip-group">
            <div class="chip selected" onclick="selChip(this,'chapa','18','${envId}')"><span class="chip-name">Chapa 18</span><span class="chip-disc" style="color:var(--text-muted)">padrão</span></div>
            <div class="chip" onclick="selChip(this,'chapa','15','${envId}')"><span class="chip-name">Chapa 15</span><span class="chip-disc">−10% MDF</span></div>
          </div>
        </div>
        <div class="mat-col"><h4>Ferragem</h4>
          <div class="chip-group">
            <div class="chip selected" onclick="selChip(this,'ferragem','blum','${envId}')"><span class="chip-name">Blum</span><span class="chip-disc" style="color:var(--text-muted)">padrão</span></div>
            <div class="chip" onclick="selChip(this,'ferragem','hafele','${envId}')"><span class="chip-name">Häfele</span><span class="chip-disc">−5%</span></div>
            <div class="chip" onclick="selChip(this,'ferragem','fgv','${envId}')"><span class="chip-name">FGV</span><span class="chip-disc">−15%</span></div>
          </div>
        </div>
        <div class="mat-col"><h4>Cor Interna</h4>
          <div class="chip-group">
            <div class="chip selected" onclick="selChip(this,'cor','cor','${envId}')"><span class="chip-name">Com cor</span><span class="chip-disc" style="color:var(--text-muted)">padrão</span></div>
            <div class="chip" onclick="selChip(this,'cor','branco','${envId}')"><span class="chip-name">Branco</span><span class="chip-disc">−5%</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="env-body" id="ebody-${envId}">
      <div class="items-header">
        <div>ITEM</div><div>QTD</div><div>UNITÁRIO</div><div>SUBTOTAL</div><div></div>
      </div>
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

      if (addBtn) {
        addBtn.insertAdjacentHTML('beforebegin', html);
      }
    });

    if (typeof recalc === 'function') recalc();

    return 'done';
  }, ambientes);

  console.log('All ambientes injected');
  await page.evaluate(() => { document.title = 'EXPLAN — Alynne e Família'; });
  console.log('Browser open — NAO FECHE ESTA JANELA');
  // Keep alive so browser stays open
  await new Promise(() => {});
})();
