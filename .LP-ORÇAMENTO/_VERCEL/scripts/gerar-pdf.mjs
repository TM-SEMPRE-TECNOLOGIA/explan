// Gera PDF do editor-proposta com cores perfeitas
// Uso: node scripts/gerar-pdf.mjs
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const EDITOR_URL = 'file:///C:/Users/thiag/Desktop/Explan/.LP-OR%C3%87AMENTO/_VERCEL/v2/editor-proposta-v2.html';
const OUTPUT = 'C:/Users/thiag/Desktop/Orcamento-Explan.pdf';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Inject data from localStorage-like source
  // Read the last saved data from the painel
  await page.goto(EDITOR_URL, { waitUntil: 'networkidle' });

  // Wait for the page to render with the data from localStorage
  await page.waitForTimeout(2000);

  // Generate PDF with backgrounds preserved
  await page.pdf({
    path: OUTPUT,
    format: 'A4',
    printBackground: true,  // THIS is the key — forces all backgrounds
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    preferCSSPageSize: true,
  });

  console.log('✅ PDF salvo em:', OUTPUT);
  await browser.close();
})();
