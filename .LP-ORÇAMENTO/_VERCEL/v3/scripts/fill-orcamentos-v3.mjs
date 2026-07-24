/** Gera 6 orçamentos na V3 via Zustand persist */
import { chromium } from 'playwright';

const URL = 'http://localhost:3000/painel';

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
      { nome: 'Sala de Estar', chapa: '18', ferragem: 'blum', cor: 'cor', itens: [
        { nome: 'Painel Ripado com nichos e LED embutido', un: 'un', preco: 28500, qtd: 1 },
        { nome: 'Estante modular com 6 módulos', un: 'un', preco: 22000, qtd: 1 },
        { nome: 'Rack flutuante 3,5m com gavetas', un: 'un', preco: 12500, qtd: 1 },
      ]},
      { nome: 'Cozinha', chapa: '18', ferragem: 'blum', cor: 'cor', itens: [
        { nome: 'Cozinha completa planejada 4,5m bancada Silestone', un: 'un', preco: 38000, qtd: 1 },
        { nome: 'Ilha central com cooktop e banquetas', un: 'un', preco: 16500, qtd: 1 },
      ]},
      { nome: 'Área Gourmet', chapa: '18', ferragem: 'blum', cor: 'cor', itens: [
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
      { nome: 'Sala de Estar', chapa: '18', ferragem: 'fgv', cor: 'branco', itens: [
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
      { nome: 'Banheiro Suíte', chapa: '18', ferragem: 'hafele', cor: 'branco', itens: [
        { nome: 'Gabinete duplo 2,4m bancada em porcelanato', un: 'un', preco: 18500, qtd: 1 },
        { nome: 'Nicho espelhado com LED e prateleiras', un: 'un', preco: 7500, qtd: 1 },
      ]},
      { nome: 'Closet', chapa: '18', ferragem: 'hafele', cor: 'branco', itens: [
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
      { nome: 'Área Gourmet', chapa: '18', ferragem: 'fgv', cor: 'branco', itens: [
        { nome: 'Bar molhado com bancada granito 3m', un: 'un', preco: 25000, qtd: 1 },
        { nome: 'Adega climatizada embutida 48 garrafas', un: 'un', preco: 16000, qtd: 1 },
        { nome: 'Mesa bistrô e banquetas sob medida', un: 'un', preco: 9500, qtd: 1 },
      ]},
    ]
  },
];

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--start-maximized'] });
  const context = await browser.newContext();

  for (let i = 0; i < orcamentos.length; i++) {
    const data = orcamentos[i];
    const page = await context.newPage();
    
    page.on('dialog', async d => { await d.accept(); });
    
    await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Preencher através do Zustand persist direto no localStorage
    // Formato: zustand armazena como 'explan-v3-orcamento'
    const stateData = {
      state: {
        cliente: {
          nome: data.cliente,
          whatsapp: data.whatsapp,
          email: '',
          cpf: '',
          pagamento: data.pagamento,
          prazo: data.prazo,
          instalacao: data.instalacao,
          endereco: data.endereco,
          observacoes: data.obs || '',
          responsavelNome: '',
          responsavelCpf: '',
        },
        ambientes: data.ambientes.map((amb, ambIdx) => ({
          id: 'env-' + Date.now() + '-' + ambIdx,
          nome: amb.nome,
          itens: amb.itens.map(item => {
            const subtotal = item.preco * item.qtd;
            return {
              nome: item.nome,
              unidade: item.un,
              preco: item.preco,
              qtd: item.qtd,
              subtotal,
            };
          }),
          total: amb.itens.reduce((s, item) => s + item.preco * item.qtd, 0),
          desconto_pct: 0,
          materiais: { chapa: amb.chapa, ferragem: amb.ferragem, cor: amb.cor },
        })),
        variaveis: { frete: 0, comissaoVendedor: 0, comissaoArquiteto: 0, acrescimos: 0 },
      },
      version: 0,
    };

    await page.evaluate((payload) => {
      localStorage.setItem('explan-v3-orcamento', JSON.stringify(payload));
      
      // Also add to projetos salvos
      const projetos = JSON.parse(localStorage.getItem('explan-v3-orcamento-projetos') || '[]');
      const state = payload.state;
      const total = state.ambientes.reduce((t, a) => t + a.total, 0);
      projetos.push({
        cliente: state.cliente,
        ambientes: state.ambientes,
        total_geral: total,
        data: new Date().toLocaleDateString('pt-BR'),
      });
      localStorage.setItem('explan-v3-orcamento-projetos', JSON.stringify(projetos));
    }, stateData);

    // Reload to reflect data
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);
    
    // Salvar projeto no painel
    await page.evaluate(() => {
      // Trigger recalc and save
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent?.includes('Salvar')) {
          btn.click();
          break;
        }
      }
    });
    
    await page.waitForTimeout(500);
    
    console.log(`✅ ${i+1}/6 — ${data.cliente}`);
    if (i < orcamentos.length - 1) await page.close();
  }

  context.addCookies([{ name: 'debug', value: 'done', domain: 'localhost', path: '/' }]);
  console.log('\n🎉 6 orçamentos salvos no localStorage!');
  console.log('Feche o navegador quando quiser (Ctrl+C no terminal).');
  await new Promise(() => {});
})();
