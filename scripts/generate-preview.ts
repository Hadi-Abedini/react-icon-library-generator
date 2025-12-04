import path from "path";
import { readSvgFiles, writePrettyFile } from "./utils/svg.ts";

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, "src", "icons");
const OUT_FILE = path.join(ROOT, "iconPack", "preview.html");

async function run() {
  const svgs = await readSvgFiles(INPUT_DIR);
  const cards = svgs
    .map((s) => {
      const safeSvg = s.content.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
      return `
<div class="card">
  <div class="icon-preview">${s.content.replace("<svg", '<svg fill="currentColor"')}</div>
  <p class="icon-name">${s.base}</p>
  <div class="buttons">
    <button onclick="copyToClipboard(this)" data-copy-text='${safeSvg}'>Copy SVG</button>
    <button onclick="copyToClipboard(this)" data-copy-text="${s.base}">Copy Name</button>
  </div>
</div>
`;
    })
    .join("\n");

  const html = `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Icon Preview</title>
<style>
body{font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#f8f9fa;padding:2rem}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1.5rem}
.card{background:#fff;border:1px solid #e9ecef;border-radius:8px;padding:1rem;display:flex;flex-direction:column;align-items:center}
.icon-preview svg{width:48px;height:48px}
.icon-name{font-family:monospace;margin:8px 0;color:#6c757d}
.buttons{display:flex;gap:8px}
button{padding:8px 10px;border-radius:6px;border:1px solid #ced4da;background:#f1f3f5;cursor:pointer}
button.copied{background:#111;color:#fff;border-color:#111}
</style>
</head>
<body>
<h1 style="text-align:center">Icon Library (${svgs.length} icons)</h1>
<div style="text-align:center;margin-bottom:16px"><input id="search" placeholder="Search" style="padding:10px;width:320px"></div>
<div class="grid">
${cards}
</div>
<script>
function copyToClipboard(btn){ const txt = btn.getAttribute('data-copy-text'); navigator.clipboard.writeText(txt).then(()=>{ const orig = btn.innerHTML; btn.innerHTML='Copied!'; btn.classList.add('copied'); setTimeout(()=>{ btn.innerHTML = orig; btn.classList.remove('copied'); },1200); }); }
const input = document.getElementById('search'); input.addEventListener('input', (e)=>{ const q = e.target.value.toLowerCase(); document.querySelectorAll('.card').forEach(card=>{ const name = card.querySelector('.icon-name').textContent.toLowerCase(); card.style.display = name.includes(q) ? 'flex' : 'none'; }); });
</script>
</body>
</html>
`;
  await writePrettyFile(OUT_FILE, html, "html");
  console.log("✅ preview.html generated");
}

run().catch(console.error);
