# Dieta 1800 · senza legumi

App per iPhone (web app installabile, PWA) per seguire un piano alimentare da
1800 kcal al giorno senza legumi, pensato per chi è in terapia con Mounjaro
(tirzepatide).

Quattro schermate:

- **Piano** — il menu di ogni giorno della settimana: colazione, due spuntini,
  pranzo e cena, con kcal e proteine di ogni pasto, le quantità di ogni
  ingrediente e un consiglio di preparazione. Si apre sul giorno di oggi.
- **Spesa** — la lista della spesa generata dal piano, raggruppata per reparto
  del supermercato, con le voci spuntabili. Si possono scegliere quali giorni
  coprire, per fare la spesa per mezza settimana invece che per sette giorni.
- **Mounjaro** — giorno e dose della terapia, conto alla rovescia alla prossima
  iniezione, registro delle iniezioni fatte con la zona usata (l'app suggerisce
  di ruotare) e i promemoria pratici da tenere a mente.
- **Peso** — registro delle pesate con grafico dell'andamento, calo totale e
  media settimanale, più esportazione e importazione dei dati.

Tutti i dati restano sul telefono (`localStorage`): niente account, niente
server, niente dati che escono dal dispositivo. L'app funziona anche senza rete.

## Installarla sull'iPhone

L'app va servita via HTTPS (o da `localhost`). L'opzione più semplice è
**GitHub Pages**: nelle impostazioni del repository, *Pages* → *Deploy from a
branch*, scegli il branch e la cartella `/ (root)`. Dopo un paio di minuti avrai
un indirizzo tipo `https://<utente>.github.io/App-dieta/`.

Poi, sull'iPhone:

1. apri quell'indirizzo **con Safari** (non funziona da Chrome o da un browser
   dentro un'altra app);
2. tocca il pulsante *Condividi* (il quadrato con la freccia in su);
3. scegli **Aggiungi a Home**.

A quel punto c'è l'icona sulla schermata Home e si apre a schermo intero, senza
la barra degli indirizzi, esattamente come un'app installata dall'App Store.

## Provarla sul computer

Serve un server locale, perché il codice usa i moduli ES e un service worker che
da `file://` non funzionano:

```sh
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Modificare il piano

Il piano è dati, non codice: sta in [`js/piano.js`](js/piano.js), sette giorni
per cinque pasti, e ogni ingrediente è un `id` del catalogo in
[`js/alimenti.js`](js/alimenti.js) con la sua quantità. Calorie e proteine di
ogni pasto e di ogni giornata sono **calcolate** da lì, quindi cambiando una
quantità i totali si aggiornano da soli e restano coerenti.

Dopo una modifica, questo controllo ristampa tutti i totali e segnala i giorni
usciti dalla tolleranza (±90 kcal sull'obiettivo, minimo 120 g di proteine),
oltre a rifiutare eventuali legumi finiti nel catalogo:

```sh
node tools/verifica-piano.mjs
```

Stato attuale: media di **1803 kcal** e **142 g di proteine** al giorno, tutti e
sette i giorni entro la tolleranza.

Se cambi i file dell'app, alza `VERSIONE` in [`sw.js`](sw.js): altrimenti gli
iPhone che l'hanno già installata continuano a servire la copia in cache.

Le icone si rigenerano con `python3 tools/genera-icone.py` (nessuna dipendenza
esterna, il PNG è scritto a mano).

## Come è costruito il piano

- ~1800 kcal su cinque occasioni, perché porzioni piccole e frequenti si
  tollerano meglio con il tirzepatide;
- proteine alte (circa 140 g al giorno) per limitare la perdita di massa magra
  durante il calo di peso;
- grassi moderati e cotture semplici, che pesano meno su nausea e reflusso;
- fibra distribuita in tutti i pasti da avena, verdura, frutta e cereali
  integrali — che qui sostituiscono i legumi, di solito la fonte principale.

**Senza legumi**: nel catalogo e nel piano non compaiono fagioli, ceci,
lenticchie, piselli, fave, soia, edamame, tofu, lupini né arachidi (che
botanicamente sono un legume). Attenzione alle etichette dei prodotti
confezionati: farina di legumi, proteine di soia e olio di arachide sono più
diffusi di quanto sembri.

## Avvertenza

Questa app organizza un piano e tiene un registro: non è un dispositivo medico e
non sostituisce il parere di chi ti segue. Le calorie e le proteine sono
stimate da tabelle di composizione degli alimenti e possono discostarsi dai
valori del singolo prodotto. Dosaggio, cambi di dose ed effetti collaterali
vanno discussi con il medico.
