# AGENTS.md

Istruzioni per gli agenti di programmazione (Codex, Claude Code e simili) che
lavorano su questo repository. Per la descrizione dell'app rivolta alle persone
vedi [`README.md`](README.md).

## Il progetto in breve

PWA per iPhone che segue un piano alimentare da 1800 kcal al giorno **senza
legumi**, per chi è in terapia con Mounjaro (tirzepatide). Quattro schede: Piano,
Spesa, Mounjaro, Peso.

- HTML, CSS e JavaScript puri, moduli ES nativi: **nessun framework, nessun
  bundler, nessun `package.json`, nessuna dipendenza esterna** (neanche font o
  CDN: l'app deve funzionare offline). Non introdurne senza una richiesta
  esplicita.
- Tutti i dati restano sul dispositivo, in `localStorage`. Niente server, niente
  account, niente chiamate di rete.
- Lingua: interfaccia, commenti, nomi di variabili e funzioni, messaggi di
  commit sono **in italiano**. Mantieni questa convenzione.

## Struttura

| Percorso | Contenuto |
| --- | --- |
| `index.html` | markup di tutte e quattro le viste e della barra a schede |
| `css/stile.css` | tutto lo stile; i colori sono token su `:root` |
| `js/alimenti.js` | catalogo alimenti (kcal e proteine per 100 g/ml, reparto) e helper `nutrienti`, `grammi` |
| `js/piano.js` | il piano: 7 giorni × 5 pasti, ingredienti come `{ id, q }`; totali calcolati |
| `js/store.js` | persistenza in `localStorage` con schema predefinito e fusione dei backup |
| `js/app.js` | rendering delle viste ed eventi; in fondo la registrazione del service worker |
| `sw.js` | service worker cache-first con elenco esplicito dei file |
| `manifest.webmanifest`, `icons/` | manifest della PWA e icone generate |
| `tools/verifica-piano.mjs` | controllo di kcal, proteine e assenza di legumi |
| `tools/costruisci-singolo.mjs` | build a file singolo in `dist/dieta-1800.html` (ignorata da git) |
| `tools/genera-icone.py` | rigenera le icone PNG senza dipendenze |

## Comandi

```sh
python3 -m http.server 8000          # servire l'app: http://localhost:8000
node tools/verifica-piano.mjs        # controllo del piano, esce con 1 se fallisce
node tools/costruisci-singolo.mjs    # genera dist/dieta-1800.html
python3 tools/genera-icone.py        # rigenera icons/*.png
```

Non c'è una suite di test: il controllo automatico è `verifica-piano.mjs`. Per
modifiche all'interfaccia, servi l'app e verificala nel browser (Chromium e
Playwright sono preinstallati negli ambienti cloud), a larghezza da telefono e
in tema sia chiaro sia scuro.

## Regole da rispettare

1. **Niente legumi, mai.** Fagioli, ceci, lenticchie, piselli, fave, soia,
   edamame, tofu, lupini, arachidi (e derivati come farina di legumi o olio di
   arachide) non devono comparire né nel catalogo né nel piano.
   `verifica-piano.mjs` rifiuta i nomi sospetti, ma controlla anche tu.
2. **Il piano è dati.** Modifica quantità e ingredienti in `js/piano.js`; gli
   alimenti nuovi vanno aggiunti a `js/alimenti.js` con valori per 100 g da
   tabelle CREA/USDA (alimento crudo, come si acquista). Non scrivere mai a mano
   kcal o proteine di un pasto: sono calcolate.
3. Dopo ogni modifica al piano o al catalogo esegui
   `node tools/verifica-piano.mjs` e deve passare: ogni giorno entro ±90 kcal
   da 1800 e con almeno 120 g di proteine. Se cambiano le medie, aggiorna la
   riga «Stato attuale» nel README.
4. **Service worker.** Se modifichi un file servito dall'app, alza `VERSIONE`
   in `sw.js` (es. `dieta-1800-v1` → `dieta-1800-v2`). Se aggiungi un file,
   inseriscilo anche nell'array `FILE` di `sw.js`.
5. **Build a file singolo.** Se aggiungi un modulo JS, aggiungilo a `MODULI` in
   `tools/costruisci-singolo.mjs` nell'ordine delle dipendenze. Tutto ciò che
   riguarda il service worker in `js/app.js` deve stare dopo il commento
   `// --- service worker (rimosso dalla versione a file singolo) ---`.
   Esegui la build per verificare che funzioni ancora; `dist/` non va
   committata.
6. **Dati salvati.** `js/store.js` fonde i dati salvati su `PREDEFINITO`:
   aggiungere campi è sicuro, rinominarli o cambiarne il tipo rompe i dati e i
   backup degli utenti. In quel caso alza `versione` e scrivi una migrazione.
7. **Tema.** Usa solo le variabili CSS (`--verde`, `--sfondo`, `--testo`, …),
   mai colori scritti nei componenti. Un nuovo token va definito in tutti e
   quattro i blocchi: `:root`, la media query `prefers-color-scheme: dark`,
   `:root[data-theme="dark"]` e `:root[data-theme="light"]`.
8. **iPhone prima di tutto.** Rispetta le safe area (`--sicura-alto`,
   `--sicura-basso`), aree tattili di almeno 44 px, nessuno scorrimento
   orizzontale.
9. **Non è un dispositivo medico.** Non aggiungere consigli su dosi o
   modifiche della terapia: l'app organizza e registra, le decisioni cliniche
   restano al medico.

## Stile del codice

- Due spazi di indentazione, apici singoli, punto e virgola.
- `const`/`let`, funzioni piccole con nomi verbali in italiano
  (`disegnaSpesa`, `aggiornaContatoreSpesa`).
- Commenti che spiegano il *perché*, non il *cosa*.
- Date in formato ISO locale `AAAA-MM-GG` tramite gli helper in `js/app.js`
  (`isoLocale`, `daIso`), mai `toISOString()` che passa a UTC.

## Commit

Messaggi in italiano, al presente indicativo, con un titolo breve
(«Aggiunge…», «Corregge…») e un corpo che spiega cosa cambia e perché.
