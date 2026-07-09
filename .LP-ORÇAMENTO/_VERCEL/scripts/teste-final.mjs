import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = __dirname;
const OUTPUT_DIR = path.join(__dirname, 'screenshots-test');

const PAGES = [
  { name: 'orc-oliveira', file: 'orcamento-oliveira.html', desc: 'Orçamento #1 — Família Oliveira' },
  { name: 'orc-bem-estar', file: 'orcamento-bem-estar.html', desc: 'Orçamento #2 — Espaço Bem-Estar' },
  { name: 'v2-editor-proposta', file: 'editor-proposta-v2.html', desc: 'Editor Proposta v2 (FIXED)' },
  { name: 'v2-apresentacao', file: 'apresentacao-editor-v2.html', desc: 'Apresentação Editor v2 (FIXED)' },
  { name: 'v2-contrato', file: 'Contrato Oficial - Explan-v2.html', desc: 'Contrato v2 (FIXED)' },
];

const VIEWPORTS = [
  { name: 'desktop-1280', width: 1280, height: 800 },
  { name: 'tablet-768',   width: 768,  height: 1024 },
  { name: 'mobile-414',   width: 414,  height: 896 },
  { name: 'mobile-375',   width: 375,  height: 667 },
];

function startServer(root, port = 8920) {
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml' };
  const server = http.createServer((req, res) => {
    let filePath = path.join(root, req.url.split('?')[0] === '/' ? 'index.html' : req.url.split('?')[0]);
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('NF'); return; }
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise(resolve => server.listen(port, () => resolve({ server, port })));
}

async function main() {
  const { server, port } = await startServer(STATIC_DIR);
  const browser = await chromium.launch({ headless: true });

  console.log('\n═══════════════════════════════════════════════');
  console.log('📸 SCREENSHOTS & TESTES — ORÇAMENTOS + V2 FIXES');
  console.log('═══════════════════════════════════════════════\n');

  for (const pg of PAGES) {
    const filePath = path.join(STATIC_DIR, pg.file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${pg.file} não encontrado — pulando`);
      continue;
    }

    console.log(`\n📄 ${pg.desc} (${pg.file})`);

    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await ctx.newPage();
      const errors = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text().slice(0, 120)); });

      try {
        await page.goto(`http://localhost:${port}/${pg.file}`, { waitUntil: 'networkidle', timeout: 15000 });
        await page.waitForTimeout(500);

        // Check overflow
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 5);
        const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
        const viewW = vp.width;

        const sshot = path.join(OUTPUT_DIR, `${pg.name}_${vp.name}.png`);
        await page.screenshot({ path: sshot, fullPage: true });

        const statusIcon = overflow ? '🚨' : '✅';
        console.log(`   ${statusIcon} ${vp.name.padEnd(16)} | ${overflow ? `${scrollW}px > ${viewW}px` : 'OK'} | ${errors.length} JS errs`);
        if (overflow) {
          const wideEl = await page.evaluate(() => {
            const all = document.querySelectorAll('body *');
            for (const el of all) {
              const r = el.getBoundingClientRect();
              if (r.width > 0 && r.width > window.innerWidth + 20) {
                const tag = el.tagName.toLowerCase();
                const cls = (el.className || '').slice(0, 30);
                return `<${tag}${cls ? '.'+cls : ''}> ${Math.round(r.width)}px`;
              }
            }
            return '—';
          });
          console.log(`           ↳ ${wideEl}`);
        }
      } catch (err) {
        console.log(`   ❌ ${vp.name} — ERRO: ${err.message.slice(0, 100)}`);
      }

      await ctx.close();
    }
  }

  await browser.close();
  server.close();

  console.log('\n═══════════════════════════════════════════════');
  console.log('🏁 TESTE CONCLUÍDO');
  console.log('═══════════════════════════════════════════════\n');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
