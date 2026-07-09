import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();

  const page = await ctx.newPage();
  await page.goto('about:blank');

  // Read any existing localstorage data by checking what patterns users would have
  // Also test for encoding issues
  const result = await page.evaluate(() => {
    const data = {};
    // Check all possible keys
    const keys = ['explan_projetos', 'explan_oc', 'explan_user_session', 'explan_perfil', 'explan_custom_catalog'];
    for (const k of keys) {
      const val = localStorage.getItem(k);
      if (val) {
        try { data[k] = JSON.parse(val); }
        catch { data[k] = val.substring(0, 200); }
      } else {
        data[k] = null;
      }
    }
    return data;
  });

  console.log('=== LOCALSTORAGE DATA ===');
  console.log(JSON.stringify(result, null, 2));
  
  // Check for encoding issues in existing data
  if (result.explan_oc) {
    const ambientes = result.explan_oc.ambientes || [];
    console.log('\n=== AMBIENTES ===");
    for (const a of ambientes) {
      console.log(`  Nome: "${a.nome}"`);
      // Check for encoding corruption
      const hasEncoding = /[âàáãäêèéëìíîïòóõöôùúûüñç]/i.test(a.nome);
      if (hasEncoding) console.log(`    ⚠️  Tem acentos (verificar se está correto)`);
    }
  }

  // Check for mock data
  if (result.explan_projetos && result.explan_projetos.length > 0) {
    console.log('\n=== PROJETOS SALVOS ===');
    for (const p of result.explan_projetos) {
      console.log(`  Projeto: ${p.ref || 'sem nome'} | Cliente: ${p.cliente?.nome || '—'} | Total: R$ ${p.total_geral || 0}`);
      const ambNames = (p.ambientes || []).map(a => a.nome);
      console.log(`  Ambientes: ${ambNames.join(', ')}`);
    }
  }

  await browser.close();
  console.log('\n✅ Verificação concluída');
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
