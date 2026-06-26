import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = __dirname;
const OUTPUT_DIR = path.join(__dirname, 'screenshots-test');
const PAGES = [
  { name: 'index', file: 'index.html' },
  { name: 'painel', file: 'painel.html' },
  { name: 'editor-proposta', file: 'editor-proposta.html' },
  { name: 'ajuda', file: 'ajuda.html' },
  { name: 'suporte', file: 'suporte.html' },
  { name: 'apresentacao-editor', file: 'apresentacao-editor.html' },
  { name: 'contrato', file: 'Contrato Oficial - Explan.html' },
  { name: 'fix-localstorage', file: 'fix-localstorage.html' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile-375', width: 375, height: 667 },
  { name: 'mobile-414', width: 414, height: 896 },
  { name: 'tablet', width: 768, height: 1024 },
];

// ── Simple static file server ──
function startServer(root, port = 8899) {
  const mime = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.pdf': 'application/pdf',
  };
  const server = http.createServer((req, res) => {
    let filePath = path.join(root, req.url === '/' ? '/index.html' : req.url);
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        // Try without query params
        filePath = path.join(root, req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]);
        const ext2 = path.extname(filePath);
        fs.readFile(filePath, (err2, data2) => {
          if (err2) {
            res.writeHead(404);
            res.end('Not found: ' + req.url);
            return;
          }
          res.writeHead(200, { 'Content-Type': mime[ext2] || 'application/octet-stream' });
          res.end(data2);
        });
        return;
      }
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  return new Promise(resolve => {
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      resolve({ server, port });
    });
  });
}

// ── Check for responsive meta viewport ──
function checkViewportMeta(html) {
  return html.includes('name="viewport"') || html.includes("name='viewport'");
}

// ── Check for @media queries ──
function checkMediaQueries(html) {
  const matches = html.match(/@media\s*[^{]+\{[^}]*\}/gs);
  return matches || [];
}

// ── Check for fixed-width elements that could break mobile ──
function checkFixedWidths(html) {
  const issues = [];
  // Look for fixed px widths on containers
  const widthPx = html.match(/width\s*:\s*\d{3,4}px/gi);
  if (widthPx) issues.push(...widthPx);
  return issues;
}

async function main() {
  // Clean output dir
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Start server
  const { server, port } = await startServer(STATIC_DIR);
  const BASE = `http://localhost:${port}`;

  // Launch browser
  const browser = await chromium.launch({ headless: true });

  const results = [];

  for (const page of PAGES) {
    const url = `${BASE}/${page.file}`;
    const html = fs.readFileSync(path.join(STATIC_DIR, page.file), 'utf-8');

    const pageResult = {
      name: page.name,
      file: page.file,
      hasViewport: checkViewportMeta(html),
      mediaQueries: checkMediaQueries(html),
      fixedWidthIssues: checkFixedWidths(html),
      screenshots: {},
      errors: [],
      consoleLogs: [],
    };

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const p = await context.newPage();

      // Collect console messages
      const logs = [];
      p.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));
      p.on('pageerror', err => logs.push({ type: 'pageerror', text: err.message }));

      try {
        await p.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
        await p.waitForTimeout(1000); // let animations settle

        const screenshotPath = path.join(OUTPUT_DIR, `${page.name}_${vp.name}.png`);
        await p.screenshot({ path: screenshotPath, fullPage: true });

        // Check for layout issues via JS
        const layoutIssues = await p.evaluate(() => {
          const issues = [];
          // Check for horizontal overflow
          if (document.documentElement.scrollWidth > window.innerWidth + 5) {
            issues.push(`Horizontal overflow: ${document.documentElement.scrollWidth}px > ${window.innerWidth}px viewport`);
          }
          // Check for elements sticking out
          const allEls = document.querySelectorAll('*');
          for (const el of allEls) {
            const rect = el.getBoundingClientRect();
            if (rect.width > window.innerWidth + 5 && rect.width > 0 && el.children.length === 0) {
              // Only flag if it's a visible, non-body, non-html element
              if (!['HTML', 'BODY', 'HEAD', 'SCRIPT', 'STYLE', 'IMG'].includes(el.tagName)) {
                const style = window.getComputedStyle(el);
                if (style.overflow !== 'hidden' && style.display !== 'none' && rect.width > window.innerWidth + 20) {
                  issues.push(`Wide element: <${el.tagName.toLowerCase()}> ${rect.width}px wide (viewport: ${window.innerWidth}px) - class: "${el.className}"`);
                }
              }
            }
          }
          return issues.slice(0, 10);
        });

        pageResult.screenshots[vp.name] = screenshotPath;
        if (layoutIssues.length > 0) {
          pageResult.errors.push(...layoutIssues);
        }

      } catch (err) {
        pageResult.errors.push(`[${vp.name}] Navigation error: ${err.message}`);
      }

      pageResult.consoleLogs.push(...logs);
      await context.close();
    }

    results.push(pageResult);
  }

  await browser.close();
  server.close();

  // ── Generate report ──
  console.log('\n══════════════════════════════════════════════════');
  console.log('📱 RELATÓRIO DE RESPONSIVIDADE — Explan Vercel');
  console.log('══════════════════════════════════════════════════\n');

  let totalErrors = 0;
  let totalFixedWidthIssues = 0;

  for (const r of results) {
    console.log(`\n📄 ${r.file} (${r.name})`);
    console.log(`   Viewport meta: ${r.hasViewport ? '✅' : '❌'}`);
    console.log(`   Media Queries: ${r.mediaQueries.length} bloco(s)`);
    if (r.fixedWidthIssues.length > 0) {
      console.log(`   ⚠️  Possíveis larguras fixas problemáticas:`);
      for (const fw of r.fixedWidthIssues) {
        console.log(`       - ${fw}`);
        totalFixedWidthIssues++;
      }
    }

    // Separate real errors from layout issues
    const layoutIssues = r.errors.filter(e => !e.includes('Navigation error'));
    const navErrors = r.errors.filter(e => e.includes('Navigation error'));

    if (layoutIssues.length > 0) {
      console.log(`   🚨 Problemas de layout:`);
      for (const e of layoutIssues) {
        console.log(`       ${e}`);
        totalErrors++;
      }
    }

    if (navErrors.length > 0) {
      console.log(`   ❌ Erros de navegação:`);
      for (const e of navErrors) {
        console.log(`       ${e}`);
        totalErrors++;
      }
    }

    // JS console errors
    const jsErrors = r.consoleLogs.filter(l => l.type === 'error' || l.type === 'pageerror');
    if (jsErrors.length > 0) {
      console.log(`   🔴 Erros JS no console (${jsErrors.length}):`);
      for (const e of jsErrors.slice(0, 5)) {
        console.log(`       [${e.type}] ${e.text.slice(0, 200)}`);
      }
    }

    if (layoutIssues.length === 0 && navErrors.length === 0 && jsErrors.length === 0) {
      console.log(`   ✅ Sem erros críticos`);
    }

    console.log(`   📸 Screenshots:`);
    for (const [vp, sp] of Object.entries(r.screenshots)) {
      console.log(`       ${vp}: ${sp}`);
    }
  }

  console.log('\n────────────────────────────────────────────');
  console.log(`📊 TOTAL: ${results.length} páginas, ${totalErrors} problemas, ${totalFixedWidthIssues} larguras fixas`);
  console.log('────────────────────────────────────────────\n');

  return results;
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
