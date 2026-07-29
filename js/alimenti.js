/*
 * Catalogo alimenti.
 *
 * Valori nutrizionali per 100 g (o 100 ml per i liquidi), riferiti all'alimento
 * crudo/così come si acquista. Sono valori medi di tabelle di composizione
 * (CREA / USDA): vanno benissimo per costruire un piano, non sono un'analisi di
 * laboratorio del singolo prodotto che compri.
 *
 * NIENTE LEGUMI in tutto il catalogo: nessun fagiolo, cece, lenticchia, pisello,
 * fava, soia, edamame, lupino o arachide (l'arachide è un legume, non una frutta
 * secca). Vedi js/piano.js per la nota completa.
 *
 * Campi:
 *   nome     etichetta mostrata a schermo
 *   reparto  usato per raggruppare la lista della spesa
 *   kcal     kcal per 100 g/ml
 *   prot     proteine (g) per 100 g/ml
 *   unita    'g' (default), 'ml' oppure 'pz'
 *   pesoPz   peso in grammi di un pezzo, obbligatorio quando unita === 'pz'
 */

export const REPARTI = [
  'Frutta e verdura',
  'Carne e pesce',
  'Latticini e uova',
  'Pane e cereali',
  'Dispensa'
];

export const ALIMENTI = {
  // ---------------------------------------------------------------- latticini
  yogurt_greco: { nome: 'Yogurt greco 0%', reparto: 'Latticini e uova', kcal: 57, prot: 10.3 },
  fiocchi_latte: { nome: 'Fiocchi di latte magri', reparto: 'Latticini e uova', kcal: 98, prot: 12.5 },
  ricotta: { nome: 'Ricotta vaccina', reparto: 'Latticini e uova', kcal: 140, prot: 10.5 },
  mozzarella_light: { nome: 'Mozzarella light', reparto: 'Latticini e uova', kcal: 185, prot: 20 },
  parmigiano: { nome: 'Parmigiano Reggiano', reparto: 'Latticini e uova', kcal: 392, prot: 33 },
  latte_scremato: { nome: 'Latte scremato', reparto: 'Latticini e uova', kcal: 34, prot: 3.4, unita: 'ml' },
  uova: { nome: 'Uova', reparto: 'Latticini e uova', kcal: 143, prot: 12.6, unita: 'pz', pesoPz: 55 },
  albume: { nome: "Albume d'uovo", reparto: 'Latticini e uova', kcal: 48, prot: 11, unita: 'ml' },

  // ------------------------------------------------------------ carne e pesce
  pollo: { nome: 'Petto di pollo', reparto: 'Carne e pesce', kcal: 110, prot: 23 },
  tacchino: { nome: 'Fesa di tacchino', reparto: 'Carne e pesce', kcal: 107, prot: 24 },
  manzo_magro: { nome: 'Girello di manzo', reparto: 'Carne e pesce', kcal: 130, prot: 22 },
  salmone: { nome: 'Filetto di salmone', reparto: 'Carne e pesce', kcal: 185, prot: 20 },
  merluzzo: { nome: 'Filetto di merluzzo', reparto: 'Carne e pesce', kcal: 82, prot: 18 },
  orata: { nome: 'Orata', reparto: 'Carne e pesce', kcal: 121, prot: 20 },
  gamberi: { nome: 'Gamberi', reparto: 'Carne e pesce', kcal: 85, prot: 18 },
  tonno_naturale: { nome: 'Tonno al naturale (sgocciolato)', reparto: 'Carne e pesce', kcal: 103, prot: 24 },
  bresaola: { nome: 'Bresaola', reparto: 'Carne e pesce', kcal: 151, prot: 32 },

  // ---------------------------------------------------------- pane e cereali
  pane_integrale: { nome: 'Pane integrale', reparto: 'Pane e cereali', kcal: 240, prot: 9 },
  fette_biscottate: { nome: 'Fette biscottate integrali', reparto: 'Pane e cereali', kcal: 385, prot: 11, unita: 'pz', pesoPz: 8.5 },
  gallette_riso: { nome: 'Gallette di riso', reparto: 'Pane e cereali', kcal: 380, prot: 8, unita: 'pz', pesoPz: 8 },
  avena: { nome: "Fiocchi d'avena", reparto: 'Pane e cereali', kcal: 380, prot: 13 },
  riso_basmati: { nome: 'Riso basmati (crudo)', reparto: 'Pane e cereali', kcal: 350, prot: 8 },
  pasta_integrale: { nome: 'Pasta integrale (cruda)', reparto: 'Pane e cereali', kcal: 340, prot: 13 },
  cous_cous: { nome: 'Cous cous integrale (crudo)', reparto: 'Pane e cereali', kcal: 350, prot: 12 },
  quinoa: { nome: 'Quinoa (cruda)', reparto: 'Pane e cereali', kcal: 368, prot: 14 },

  // -------------------------------------------------------- frutta e verdura
  zucchine: { nome: 'Zucchine', reparto: 'Frutta e verdura', kcal: 17, prot: 1.3 },
  spinaci: { nome: 'Spinaci', reparto: 'Frutta e verdura', kcal: 23, prot: 2.9 },
  pomodorini: { nome: 'Pomodorini', reparto: 'Frutta e verdura', kcal: 18, prot: 1 },
  insalata_mista: { nome: 'Insalata mista', reparto: 'Frutta e verdura', kcal: 15, prot: 1.4 },
  rucola: { nome: 'Rucola', reparto: 'Frutta e verdura', kcal: 25, prot: 2.6 },
  broccoli: { nome: 'Broccoli', reparto: 'Frutta e verdura', kcal: 34, prot: 2.8 },
  cavolfiore: { nome: 'Cavolfiore', reparto: 'Frutta e verdura', kcal: 25, prot: 1.9 },
  melanzane: { nome: 'Melanzane', reparto: 'Frutta e verdura', kcal: 25, prot: 1 },
  peperoni: { nome: 'Peperoni', reparto: 'Frutta e verdura', kcal: 26, prot: 1 },
  carote: { nome: 'Carote', reparto: 'Frutta e verdura', kcal: 41, prot: 0.9 },
  asparagi: { nome: 'Asparagi', reparto: 'Frutta e verdura', kcal: 20, prot: 2.2 },
  funghi: { nome: 'Funghi champignon', reparto: 'Frutta e verdura', kcal: 22, prot: 3.1 },
  cetrioli: { nome: 'Cetrioli', reparto: 'Frutta e verdura', kcal: 15, prot: 0.7 },
  zucca: { nome: 'Zucca', reparto: 'Frutta e verdura', kcal: 26, prot: 1 },
  sedano: { nome: 'Sedano', reparto: 'Frutta e verdura', kcal: 16, prot: 0.7 },
  cipolla: { nome: 'Cipolla', reparto: 'Frutta e verdura', kcal: 40, prot: 1.1 },
  patate: { nome: 'Patate', reparto: 'Frutta e verdura', kcal: 80, prot: 2 },
  limone: { nome: 'Limone', reparto: 'Frutta e verdura', kcal: 29, prot: 1.1 },
  mela: { nome: 'Mele', reparto: 'Frutta e verdura', kcal: 52, prot: 0.3 },
  pera: { nome: 'Pere', reparto: 'Frutta e verdura', kcal: 57, prot: 0.4 },
  banana: { nome: 'Banane', reparto: 'Frutta e verdura', kcal: 89, prot: 1.1 },
  fragole: { nome: 'Fragole', reparto: 'Frutta e verdura', kcal: 32, prot: 0.7 },
  mirtilli: { nome: 'Mirtilli', reparto: 'Frutta e verdura', kcal: 57, prot: 0.7 },
  kiwi: { nome: 'Kiwi', reparto: 'Frutta e verdura', kcal: 61, prot: 1.1 },
  arancia: { nome: 'Arance', reparto: 'Frutta e verdura', kcal: 47, prot: 0.9 },
  ananas: { nome: 'Ananas', reparto: 'Frutta e verdura', kcal: 50, prot: 0.5 },

  // ------------------------------------------------------------------ dispensa
  olio_evo: { nome: "Olio extravergine d'oliva", reparto: 'Dispensa', kcal: 900, prot: 0, unita: 'ml' },
  mandorle: { nome: 'Mandorle', reparto: 'Dispensa', kcal: 600, prot: 21 },
  noci: { nome: 'Noci sgusciate', reparto: 'Dispensa', kcal: 654, prot: 15 },
  passata: { nome: 'Passata di pomodoro', reparto: 'Dispensa', kcal: 32, prot: 1.4 },
  cioccolato_fondente: { nome: 'Cioccolato fondente 85%', reparto: 'Dispensa', kcal: 600, prot: 10 }
};

/** Grammi effettivi di una voce, anche quando è espressa in pezzi. */
export function grammi(idAlimento, quantita) {
  const a = ALIMENTI[idAlimento];
  if (!a) throw new Error(`Alimento sconosciuto: ${idAlimento}`);
  return a.unita === 'pz' ? quantita * a.pesoPz : quantita;
}

/** Quantità formattata per la UI, es. "150 g", "250 ml", "2 pz". */
export function formattaQuantita(idAlimento, quantita) {
  const a = ALIMENTI[idAlimento];
  const unita = a.unita || 'g';
  const q = Math.round(quantita * 10) / 10;
  return `${q} ${unita}`;
}

/** { kcal, prot } di una singola voce di un pasto. */
export function nutrienti(idAlimento, quantita) {
  const a = ALIMENTI[idAlimento];
  const g = grammi(idAlimento, quantita);
  return { kcal: (a.kcal * g) / 100, prot: (a.prot * g) / 100 };
}
