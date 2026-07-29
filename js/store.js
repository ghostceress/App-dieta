/*
 * Persistenza locale.
 *
 * Tutto resta su questo iPhone, in localStorage: nessun account, nessun server,
 * nessun dato che esce dal telefono. Il rovescio della medaglia è che se
 * cancelli i dati di Safari per questo sito perdi lo storico: per questo c'è
 * l'esportazione in JSON nella schermata Peso.
 */

const CHIAVE = 'app-dieta-1800';

const PREDEFINITO = {
  versione: 1,
  spesa: {
    giorni: [0, 1, 2, 3, 4, 5, 6], // indici di GIORNI da coprire con la spesa
    spuntati: [] // id degli alimenti già presi
  },
  mounjaro: {
    giornoIniezione: null, // 0 = domenica ... 6 = sabato, come Date.getDay()
    dose: '',
    iniezioni: [] // [{ data: 'AAAA-MM-GG', dose: '5 mg', sito: 'Addome' }]
  },
  peso: [] // [{ data: 'AAAA-MM-GG', kg: 92.4 }]
};

/** Unisce i dati salvati sui valori predefiniti, così i vecchi backup restano leggibili. */
function fondi(base, salvato) {
  if (!salvato || typeof salvato !== 'object') return structuredClone(base);
  const out = structuredClone(base);
  for (const k of Object.keys(base)) {
    if (!(k in salvato)) continue;
    const v = salvato[k];
    out[k] = v && typeof v === 'object' && !Array.isArray(v) ? fondi(base[k], v) : v;
  }
  return out;
}

let stato = leggi();

function leggi() {
  try {
    return fondi(PREDEFINITO, JSON.parse(localStorage.getItem(CHIAVE)));
  } catch {
    return structuredClone(PREDEFINITO);
  }
}

function scrivi() {
  try {
    localStorage.setItem(CHIAVE, JSON.stringify(stato));
  } catch (e) {
    // Safari in navigazione privata non concede spazio: l'app continua a
    // funzionare, semplicemente non ricorda nulla dopo la chiusura.
    console.warn('Salvataggio non riuscito', e);
  }
}

export function getStato() {
  return stato;
}

/** Applica una modifica allo stato e salva subito. */
export function aggiorna(modifica) {
  modifica(stato);
  scrivi();
}

export function esporta() {
  return JSON.stringify(stato, null, 2);
}

/** Reimporta un backup prodotto da esporta(). Restituisce true se il file è valido. */
export function importa(testo) {
  try {
    const dati = JSON.parse(testo);
    if (!dati || typeof dati !== 'object') return false;
    stato = fondi(PREDEFINITO, dati);
    scrivi();
    return true;
  } catch {
    return false;
  }
}
