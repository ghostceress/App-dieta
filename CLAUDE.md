# CLAUDE.md

Guida per Claude Code su questo repository.

## Cos'è

PWA statica per iPhone ("Dieta 1800 · senza legumi"): piano alimentare
settimanale da 1800 kcal senza legumi, lista della spesa, monitoraggio della
terapia Mounjaro e del peso. Niente build, niente dipendenze, niente server: HTML,
CSS e moduli ES serviti così come sono. I dati dell'utente stanno solo in
`localStorage`.

Codice, commenti, testi dell'interfaccia e messaggi di commit sono **in italiano**:
mantieni la stessa lingua e lo stesso stile.

## Comandi

```sh
python3 -m http.server 8000        # provare l'app su http://localhost:8000 (file:// non va)
node tools/verifica-piano.mjs      # controllo del piano: esce con 1 se un giorno è fuori tolleranza o c'è un legume
node tools/costruisci-singolo.mjs  # versione a file unico in dist/dieta-1800.html (dist/ è ignorata da git)
python3 tools/genera-icone.py      # rigenera le icone PNG in icons/
```

Non ci sono test automatici oltre a `verifica-piano.mjs`: lancialo dopo ogni
modifica a `js/piano.js` o `js/alimenti.js`.

## Struttura

- `index.html` — markup delle quattro viste (Piano, Spesa, Mounjaro, Peso).
- `js/alimenti.js` — catalogo alimenti: valori per 100 g/ml, reparto, unità.
- `js/piano.js` — il piano come **dati** (7 giorni × 5 pasti di `id` alimento +
  quantità) e le funzioni che ne calcolano totali e lista della spesa.
- `js/store.js` — persistenza in `localStorage` (chiave `app-dieta-1800`),
  esportazione/importazione JSON.
- `js/app.js` — rendering delle viste ed eventi; registra il service worker.
- `css/stile.css` — stile, con token di tema chiaro/scuro.
- `sw.js` — service worker cache-first per l'uso offline.
- `tools/` — script di supporto (verifica, build a file singolo, icone).

## Regole da rispettare

- **Niente legumi**: nel catalogo e nel piano non devono comparire fagioli,
  ceci, lenticchie, piselli, fave, soia, edamame, tofu, lupini né arachidi.
  `verifica-piano.mjs` lo controlla.
- **Totali calcolati, mai scritti a mano**: kcal e proteine derivano dal
  catalogo. Ogni giorno deve stare entro ±90 kcal da 1800 e sopra 120 g di
  proteine.
- **Alza `VERSIONE` in `sw.js`** a ogni modifica dei file dell'app, altrimenti
  gli iPhone che l'hanno installata continuano a servire la cache. Se aggiungi un
  file all'app, aggiungilo anche all'elenco `FILE` di `sw.js`.
- **Nuovi moduli JS**: aggiungili a `MODULI` in `tools/costruisci-singolo.mjs`
  nell'ordine delle dipendenze. Il codice che registra il service worker in
  `app.js` sta dopo il marcatore
  `// --- service worker (rimosso dalla versione a file singolo) ---`: non
  spostarlo.
- **Compatibilità dei dati salvati**: se cambi la forma dello stato in
  `store.js`, aggiorna `PREDEFINITO` in modo che `fondi()` continui a leggere i
  backup vecchi.
- Nessuna dipendenza esterna e nessuna chiamata di rete: i dati non devono
  uscire dal dispositivo.
- Dopo modifiche funzionali aggiorna il `README.md` (anche i numeri dello "Stato
  attuale" del piano, se cambiano).
