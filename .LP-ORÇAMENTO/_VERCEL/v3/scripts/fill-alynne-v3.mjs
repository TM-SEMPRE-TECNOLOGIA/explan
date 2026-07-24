// Insere orçamento Alynne e salva via clique real no botão
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
  const browser = await chromium.launch({ channel: 'chrome', headless: false });
  const page = await browser.newPage();
  
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000); // espera o dynamic carregar
  
  // Injeta no localStorage
  await page.evaluate((data) => {
    localStorage.setItem('explan-v3-orcamento', JSON.stringify(data));
  }, stateData);
  
  // Recarrega para o Zustand ler o localStorage
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Clica no botão "Salvar Projeto Atual"
  const clicked = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      if (btn.textContent?.includes('Salvar') || btn.textContent?.includes('Projeto')) {
        btn.click();
        return 'clicou: ' + btn.textContent;
      }
    }
    return 'botão não encontrado';
  });
  
  console.log('Salvar:', clicked);
  
  // Verifica se salvou
  const verificado = await page.evaluate(() => {
    const p = JSON.parse(localStorage.getItem('explan-v3-orcamento-projetos') || '[]');
    return `Projetos salvos: ${p.length} — ` + p.map(x => x.cliente.nome).join(', ');
  });
  console.log(verificado);
  
  console.log('\n🎉 Alynne salva! Pode fechar o navegador.');
  
  await new Promise(() => {});
})();
