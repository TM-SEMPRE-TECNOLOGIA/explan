// Insere orçamento Alynne no seu Chrome via Playwright
import { chromium } from 'playwright';

const URL = 'http://localhost:3000/painel';

const stateData = {
  state: {
    cliente: {
      nome: "Alynne e Família",
      whatsapp: "",
      email: "",
      cpf: "",
      pagamento: "À vista — 7% de desconto (PIX / transferência)",
      prazo: "45 dias úteis",
      instalacao: "7 dias",
      endereco: "",
      observacoes: ""
    },
    ambientes: [
      {
        nome: "Suíte Master",
        itens: [
          { nome: "Closet completo em MDF nas cores do projeto, ferragens Blum e 2 portas de espelho", unidade: "un", preco: 49000, qtd: 1, subtotal: 49000 },
          { nome: "Painel de TV frisado com gaveteiro e prateleira", unidade: "un", preco: 19800, qtd: 1, subtotal: 19800 },
          { nome: "Cabeceira da cama e criados nas cores do projeto", unidade: "un", preco: 11750, qtd: 1, subtotal: 11750 }
        ],
        total: 80550,
        materiais: { chapa: "18", ferragem: "blum", cor: "cor" }
      },
      {
        nome: "Hall de Entrada",
        itens: [
          { nome: "Painel com porta de correr, incluso fechadura elétrica, puxador metálico dourado, puxador em LED e fitas de LED", unidade: "un", preco: 14150, qtd: 1, subtotal: 14150 },
          { nome: "Painel de espelho com fundo em MDF", unidade: "un", preco: 9750, qtd: 1, subtotal: 9750 }
        ],
        total: 23900,
        materiais: { chapa: "18", ferragem: "blum", cor: "cor" }
      }
    ],
    variaveis: { frete: 0, comissaoVendedor: 0, comissaoArquiteto: 0, acrescimos: 0 }
  },
  version: 0
};

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--start-maximized'] });
  const page = await browser.newPage();
  
  // Navega pro painel
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  // Injeta o localStorage
  const injected = await page.evaluate((data) => {
    localStorage.setItem('explan-v3-orcamento', JSON.stringify(data));
    
    // Também adiciona aos projetos salvos
    const projetos = JSON.parse(localStorage.getItem('explan-v3-orcamento-projetos') || '[]');
    const total = data.state.ambientes.reduce((t, a) => t + a.total, 0);
    projetos.push({
      cliente: data.state.cliente,
      ambientes: data.state.ambientes,
      total_geral: total,
      data: new Date().toLocaleDateString('pt-BR')
    });
    localStorage.setItem('explan-v3-orcamento-projetos', JSON.stringify(projetos));
    
    return 'OK';
  }, stateData);
  
  console.log(`LocalStorage: ${injected}`);
  
  // Recarrega pra refletir os dados
  await page.reload({ waitUntil: 'networkidle' });
  
  console.log('\n🎉 Alynne e Família carregado!');
  console.log('R$ 104.450,00 — 2 ambientes, 5 itens manuais');
  console.log('Navegador aberto. Feche quando quiser.');
  
  // Mantém aberto
  await new Promise(() => {});
})();
