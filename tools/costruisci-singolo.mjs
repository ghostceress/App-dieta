/*
 * Costruisce una versione dell'app in un unico file HTML, con CSS, JavaScript e
 * icona incorporati.
 *
 *   node tools/costruisci-singolo.mjs
 *
 * Serve per pubblicare l'app dove si può caricare una pagina sola (o per aprirla
 * con un doppio clic, senza mettere in piedi un server). Rispetto alla versione
 * completa manca il service worker, quindi niente funzionamento offline: per
 * quello va servita la cartella intera, vedi README.
 *
 * Il markup non è duplicato: viene estratto da index.html, così questa versione
 * non può divergere dall'originale.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RADICE = join(dirname(fileURLToPath(import.meta.url)), '..');
const leggi = (...parti) => readFileSync(join(RADICE, ...parti), 'utf8');

// I moduli vanno concatenati nell'ordine delle dipendenze: uniti in un unico
// script condividono lo stesso ambito, quindi import ed export vanno tolti.
const MODULI = ['js/alimenti.js', 'js/piano.js', 'js/store.js', 'js/app.js'];
const TAGLIA_DA = '// --- service worker (rimosso dalla versione a file singolo) ---';

function ripulisciModulo(codice) {
  return codice
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];[ \t]*\r?\n/gm, '')
    .replace(/^export\s+(?=(const|let|function|class)\b)/gm, '')
    .trim();
}

const indice = leggi('index.html');

const corpo = indice.match(/<body>([\s\S]*)<\/body>/)[1]
  .replace(/<script[\s\S]*?<\/script>\s*/g, '')
  .trim();

const titolo = indice.match(/<title>([\s\S]*?)<\/title>/)[1];

const script = MODULI.map((m) => {
  let codice = leggi(m);
  const taglio = codice.indexOf(TAGLIA_DA);
  if (taglio !== -1) codice = codice.slice(0, taglio);
  return `/* ===== ${m} ===== */\n${ripulisciModulo(codice)}`;
}).join('\n\n');

const icona = readFileSync(join(RADICE, 'icons/icona-180.png')).toString('base64');

const pagina = `<title>${titolo}</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Dieta 1800">
<link rel="apple-touch-icon" href="data:image/png;base64,${icona}">

<style>
${leggi('css/stile.css').trim()}
</style>

${corpo}

<script type="module">
${script}
</script>
`;

mkdirSync(join(RADICE, 'dist'), { recursive: true });
writeFileSync(join(RADICE, 'dist/dieta-1800.html'), pagina);
console.log(`scritto dist/dieta-1800.html (${Math.round(pagina.length / 1024)} kB)`);
