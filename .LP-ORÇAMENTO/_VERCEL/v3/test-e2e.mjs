// Testa todas as páginas da V3 no Next.js
import { chromium } from 'playwright';

const BASE = 'http://localhost:3000';

async function testarPagina(page, rota, checks) {
  console.log(`\n📄 Testando: ${rota}`);
  const erros = [];
  
  try {
    await page.goto(BASE + rota, { waitUntil: 'networkidle', timeout: 15000 });
    const title = await page.title();
    console.log(`   Title: "${title}"`);
    
    for (const check of checks) {
      try {
        const el = await page.waitForSelector(check.selector, { timeout: 5000 });
        if (el) console.log(`   ✅ ${check.label}`);
      } catch {
        console.log(`   ❌ ${check.label} — NÃO ENCONTRADO`);
        erros.push(`${rota}: ${check.label}`);
      }
    }
    
    // Check console errors
    const consoleErros = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErros.push(msg.text()); });
    await page.waitForTimeout(1000);
    
    if (consoleErros.length > 0) {
      console.log(`   ⚠️ Console errors: ${consoleErros.length}`);
      consoleErros.forEach(e => console.log(`      ${e.substring(0, 120)}`));
    }
    
    return erros;
  } catch (e) {
    console.log(`   💥 ERRO: ${e.message.substring(0, 100)}`);
    return [`${rota}: ${e.message.substring(0, 100)}`];
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('dialog', async d => await d.accept());
  
  let todosErros = [];
  
  // 1. LOGIN
  todosErros.push(...await testarPagina(page, '/', [
    { label: 'Logo visível', selector: '.auth-logo img' },
    { label: 'Form de login', selector: 'form' },
    { label: 'Features icons (Lucide)', selector: '[data-lucide]' },
  ]));
  
  // 2. PAINEL
  todosErros.push(...await testarPagina(page, '/painel', [
    { label: 'Sidebar nav', selector: 'nav' },
    { label: 'Campo nome cliente', selector: 'input[placeholder*="Alessandro"]' },
    { label: 'Prazo Produção', selector: 'input[value*="45"]' },
    { label: 'Prazo Instalação', selector: 'input[value*="7"]' },
    { label: 'Forma pagamento select', selector: 'select' },
    { label: 'Botão Adicionar Ambiente', selector: 'button' },
    { label: 'Sidebar resumo', selector: '.sidebar' },
  ]));
  
  // 3. EDITOR
  todosErros.push(...await testarPagina(page, '/editor', [
    { label: 'Toolbar', selector: 'div[class*="toolbar"]' },
    { label: 'Botão Voltar', selector: 'a[href*="painel"]' },
  ]));
  
  // 4. CONTRATO
  todosErros.push(...await testarPagina(page, '/contrato', [
    { label: 'Header contrato', selector: 'div[class*="page"]' },
    { label: 'Botão Voltar', selector: 'a[href*="painel"]' },
  ]));
  
  // 5. APRESENTAÇÃO
  todosErros.push(...await testarPagina(page, '/apresentacao', [
    { label: 'Toolbar', selector: 'div[class*="toolbar"]' },
    { label: 'Botão Voltar', selector: 'a[href*="painel"]' },
  ]));
  
  // 6. AJUDA
  todosErros.push(...await testarPagina(page, '/ajuda', [
    { label: 'Header FAQ', selector: 'header' },
    { label: 'Botão Voltar', selector: 'a[href*="painel"]' },
    { label: 'Chips categoria', selector: 'button[class*="cat-chip"]' },
    { label: 'FAQ items', selector: 'div[class*="faq-item"]' },
  ]));
  
  // 7. SUPORTE
  todosErros.push(...await testarPagina(page, '/suporte', [
    { label: 'Header suporte', selector: 'div[class*="header"]' },
    { label: 'Radio Bug/Erro', selector: 'label:has(input[value="Bug/Erro"])' },
    { label: 'Botão WhatsApp', selector: 'button' },
    { label: 'Botão Voltar', selector: 'a[href*="painel"]' },
  ]));
  
  await browser.close();
  
  // Relatório
  console.log('\n' + '='.repeat(60));
  console.log('  TM-TESTES V3 — RESULTADO');
  console.log('='.repeat(60));
  
  if (todosErros.length === 0) {
    console.log('  ✅ TODAS AS 7 PÁGINAS PASSARAM!');
  } else {
    console.log(`  ❌ ${todosErros.length} falhas:`);
    todosErros.forEach(e => console.log(`     ${e}`));
  }
  console.log('='.repeat(60));
  
  process.exit(todosErros.length > 0 ? 1 : 0);
})();
