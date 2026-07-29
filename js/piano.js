/*
 * Piano alimentare settimanale ~1800 kcal, alto contenuto proteico, senza legumi.
 *
 * Criteri usati per costruirlo:
 *  - ~1800 kcal al giorno, distribuite su 5 occasioni (3 pasti + 2 spuntini):
 *    porzioni piccole e frequenti si tollerano meglio con il tirzepatide.
 *  - Proteine alte (circa 1,6-1,8 g per kg di peso corporeo per una persona di
 *    75-85 kg): durante un calo di peso rapido servono a limitare la perdita di
 *    massa magra. Sono la priorità del piano.
 *  - Grassi moderati e cotture semplici (forno, piastra, vapore): i pasti molto
 *    grassi o fritti peggiorano nausea e reflusso, effetti collaterali tipici.
 *  - Fibra da verdura, frutta e cereali integrali, distribuita in tutti i pasti,
 *    perché la stitichezza è comune con questi farmaci. Niente legumi: sono la
 *    fonte di fibra che di solito si userebbe, qui è sostituita da avena,
 *    verdure, frutta e cereali integrali.
 *
 * SENZA LEGUMI: nel piano non compaiono fagioli, ceci, lenticchie, piselli,
 * fave, soia/edamame/tofu, lupini né arachidi (botanicamente un legume).
 * Attenzione alle etichette: farina di legumi, proteine di soia e olio di
 * arachide si nascondono in molti prodotti confezionati.
 */

import { ALIMENTI, nutrienti, grammi } from './alimenti.js';

export const OBIETTIVO_KCAL = 1800;
export const OBIETTIVO_PROTEINE = 130;

export const GIORNI = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

const c = (id, q) => ({ id, q });

export const PIANO = [
  // ------------------------------------------------------------------- lunedì
  [
    {
      tipo: 'Colazione',
      nome: 'Yogurt greco con avena e mirtilli',
      ingredienti: [c('yogurt_greco', 200), c('avena', 45), c('mirtilli', 80), c('mandorle', 10)],
      note: "Mescola l'avena nello yogurt la sera prima e lasciala in frigo: al mattino è più cremosa e più facile da mandare giù se hai poca fame."
    },
    {
      tipo: 'Spuntino',
      nome: 'Mela e noci',
      ingredienti: [c('mela', 150), c('noci', 15)],
      note: 'Mangia la mela con la buccia, è lì che sta gran parte della fibra.'
    },
    {
      tipo: 'Pranzo',
      nome: 'Pollo al limone con riso basmati e zucchine',
      ingredienti: [c('pollo', 150), c('riso_basmati', 70), c('zucchine', 200), c('olio_evo', 10), c('limone', 20)],
      note: 'Il peso del riso è da crudo. Pollo in padella antiaderente, limone e origano a fine cottura.'
    },
    {
      tipo: 'Spuntino',
      nome: 'Yogurt greco e fragole',
      ingredienti: [c('yogurt_greco', 150), c('fragole', 120)],
      note: ''
    },
    {
      tipo: 'Cena',
      nome: 'Merluzzo al forno con patate e spinaci',
      ingredienti: [c('merluzzo', 200), c('patate', 200), c('spinaci', 200), c('olio_evo', 10), c('pane_integrale', 30)],
      note: 'Patate a fette sottili in forno a 200 °C, il merluzzo si aggiunge negli ultimi 12-15 minuti.'
    }
  ],

  // ------------------------------------------------------------------ martedì
  [
    {
      tipo: 'Colazione',
      nome: 'Uova strapazzate su pane integrale',
      ingredienti: [c('uova', 2), c('albume', 100), c('pane_integrale', 60), c('pomodorini', 100), c('olio_evo', 5)],
      note: "L'albume in più alza le proteine senza aggiungere quasi calorie."
    },
    {
      tipo: 'Spuntino',
      nome: 'Fiocchi di latte e kiwi',
      ingredienti: [c('fiocchi_latte', 150), c('kiwi', 100)],
      note: 'Il kiwi aiuta parecchio se il farmaco ti sta rallentando la digestione.'
    },
    {
      tipo: 'Pranzo',
      nome: 'Insalata di tonno e patate',
      ingredienti: [c('tonno_naturale', 120), c('patate', 250), c('insalata_mista', 100), c('pomodorini', 100), c('olio_evo', 10)],
      note: 'Patate lessate e raffreddate: il freddo forma amido resistente, che si comporta come fibra.'
    },
    {
      tipo: 'Spuntino',
      nome: 'Gallette e bresaola',
      ingredienti: [c('gallette_riso', 3), c('bresaola', 40)],
      note: ''
    },
    {
      tipo: 'Cena',
      nome: 'Tacchino alla piastra con quinoa e cavolfiore',
      ingredienti: [c('tacchino', 160), c('quinoa', 60), c('cavolfiore', 250), c('olio_evo', 10)],
      note: 'Sciacqua bene la quinoa prima di cuocerla. Cavolfiore al vapore o arrosto con paprika.'
    }
  ],

  // ---------------------------------------------------------------- mercoledì
  [
    {
      tipo: 'Colazione',
      nome: 'Porridge di avena con banana',
      ingredienti: [c('avena', 50), c('latte_scremato', 250), c('banana', 100), c('mandorle', 10)],
      note: 'Cannella abbondante: dà dolcezza senza zucchero.'
    },
    {
      tipo: 'Spuntino',
      nome: 'Yogurt greco e noci',
      ingredienti: [c('yogurt_greco', 170), c('noci', 12)],
      note: ''
    },
    {
      tipo: 'Pranzo',
      nome: 'Pasta integrale con ragù di tacchino',
      ingredienti: [c('pasta_integrale', 70), c('tacchino', 130), c('passata', 150), c('olio_evo', 10), c('parmigiano', 15), c('insalata_mista', 80)],
      note: 'Fesa di tacchino macinata al momento dal macellaio: stesso gusto del ragù, molti grassi in meno.'
    },
    {
      tipo: 'Spuntino',
      nome: 'Pera e mandorle',
      ingredienti: [c('pera', 170), c('mandorle', 12)],
      note: ''
    },
    {
      tipo: 'Cena',
      nome: 'Orata al cartoccio con verdure grigliate',
      ingredienti: [c('orata', 200), c('melanzane', 150), c('peperoni', 150), c('olio_evo', 10), c('pane_integrale', 40)],
      note: "Il peso dell'orata è del filetto pulito: se la compri intera, prendine circa il doppio."
    }
  ],

  // ------------------------------------------------------------------ giovedì
  [
    {
      tipo: 'Colazione',
      nome: 'Fette biscottate con ricotta e fragole',
      ingredienti: [c('fette_biscottate', 5), c('ricotta', 130), c('fragole', 100)],
      note: ''
    },
    {
      tipo: 'Spuntino',
      nome: 'Yogurt greco e mirtilli',
      ingredienti: [c('yogurt_greco', 170), c('mirtilli', 80)],
      note: ''
    },
    {
      tipo: 'Pranzo',
      nome: 'Straccetti di manzo con rucola e patate',
      ingredienti: [c('manzo_magro', 150), c('patate', 280), c('rucola', 60), c('olio_evo', 10), c('parmigiano', 10)],
      note: 'Girello a fette sottilissime, padella rovente, un minuto per lato: resta tenero.'
    },
    {
      tipo: 'Spuntino',
      nome: 'Mela e mandorle',
      ingredienti: [c('mela', 160), c('mandorle', 15)],
      note: ''
    },
    {
      tipo: 'Cena',
      nome: 'Frittata di albumi con funghi e mozzarella',
      ingredienti: [c('uova', 1), c('albume', 200), c('funghi', 200), c('mozzarella_light', 60), c('olio_evo', 8), c('pane_integrale', 50), c('insalata_mista', 80)],
      note: 'Funghi ripassati a parte e ben asciutti, altrimenti la frittata resta acquosa.'
    }
  ],

  // ------------------------------------------------------------------ venerdì
  [
    {
      tipo: 'Colazione',
      nome: 'Yogurt greco con avena e mela',
      ingredienti: [c('yogurt_greco', 200), c('avena', 45), c('mela', 120), c('noci', 10)],
      note: ''
    },
    {
      tipo: 'Spuntino',
      nome: 'Bresaola e gallette',
      ingredienti: [c('bresaola', 50), c('gallette_riso', 3)],
      note: ''
    },
    {
      tipo: 'Pranzo',
      nome: 'Gamberi e zucchine con cous cous',
      ingredienti: [c('gamberi', 180), c('cous_cous', 70), c('zucchine', 200), c('olio_evo', 10)],
      note: 'Il cous cous integrale si idrata in 5 minuti con acqua bollente pari peso.'
    },
    {
      tipo: 'Spuntino',
      nome: 'Fiocchi di latte e kiwi',
      ingredienti: [c('fiocchi_latte', 150), c('kiwi', 120)],
      note: ''
    },
    {
      tipo: 'Cena',
      nome: 'Salmone al forno con asparagi e patate',
      ingredienti: [c('salmone', 150), c('asparagi', 200), c('patate', 200), c('olio_evo', 5)],
      note: "Il salmone ha già i suoi grassi: qui l'olio serve solo per le verdure."
    }
  ],

  // -------------------------------------------------------------------- sabato
  [
    {
      tipo: 'Colazione',
      nome: 'Pane integrale, uova e pomodoro',
      ingredienti: [c('uova', 2), c('pane_integrale', 60), c('pomodorini', 120), c('olio_evo', 5), c('latte_scremato', 150)],
      note: ''
    },
    {
      tipo: 'Spuntino',
      nome: 'Banana e mandorle',
      ingredienti: [c('banana', 120), c('mandorle', 12)],
      note: 'Se hai allenamento, è lo spuntino da fare prima.'
    },
    {
      tipo: 'Pranzo',
      nome: 'Pollo alle verdure con riso basmati',
      ingredienti: [c('pollo', 160), c('riso_basmati', 55), c('broccoli', 200), c('carote', 100), c('olio_evo', 8)],
      note: 'Salta tutto in padella tipo wok: broccoli e carote devono restare croccanti.'
    },
    {
      tipo: 'Spuntino',
      nome: 'Yogurt greco e cioccolato fondente',
      ingredienti: [c('yogurt_greco', 150), c('cioccolato_fondente', 10)],
      note: 'Il quadratino di fondente è previsto dal piano: non è uno sgarro.'
    },
    {
      tipo: 'Cena',
      nome: 'Insalatona con mozzarella e tacchino',
      ingredienti: [c('mozzarella_light', 100), c('tacchino', 100), c('insalata_mista', 100), c('pomodorini', 150), c('cetrioli', 100), c('olio_evo', 10), c('pane_integrale', 40)],
      note: 'Cena leggera del sabato: se esci, tienila come schema da ordinare al ristorante.'
    }
  ],

  // ------------------------------------------------------------------ domenica
  [
    {
      tipo: 'Colazione',
      nome: 'Porridge proteico con fragole',
      ingredienti: [c('avena', 45), c('latte_scremato', 200), c('yogurt_greco', 100), c('fragole', 120), c('mandorle', 10)],
      note: "Lo yogurt va aggiunto a fuoco spento, altrimenti impazzisce."
    },
    {
      tipo: 'Spuntino',
      nome: 'Arancia e noci',
      ingredienti: [c('arancia', 200), c('noci', 15)],
      note: ''
    },
    {
      tipo: 'Pranzo',
      nome: 'Arrosto di manzo con zucca e patate',
      ingredienti: [c('manzo_magro', 160), c('zucca', 250), c('patate', 100), c('olio_evo', 10), c('rucola', 50)],
      note: 'Zucca e patate arrosto insieme, rosmarino e uno spicchio di aglio.'
    },
    {
      tipo: 'Spuntino',
      nome: 'Fiocchi di latte e ananas',
      ingredienti: [c('fiocchi_latte', 150), c('ananas', 150)],
      note: ''
    },
    {
      tipo: 'Cena',
      nome: 'Zuppa di verdure con pollo e crostini',
      ingredienti: [c('pollo', 150), c('zucchine', 150), c('carote', 100), c('sedano', 80), c('cipolla', 50), c('patate', 100), c('olio_evo', 8), c('pane_integrale', 40)],
      note: 'Fanne una pentola doppia e congela le porzioni: risolve le sere in cui non hai voglia di cucinare.'
    }
  ]
];

/** Totali { kcal, prot } di un singolo pasto. */
export function totaliPasto(pasto) {
  return pasto.ingredienti.reduce(
    (tot, ing) => {
      const n = nutrienti(ing.id, ing.q);
      return { kcal: tot.kcal + n.kcal, prot: tot.prot + n.prot };
    },
    { kcal: 0, prot: 0 }
  );
}

/** Totali { kcal, prot } di una giornata (indice 0 = lunedì). */
export function totaliGiorno(indiceGiorno) {
  return PIANO[indiceGiorno].reduce(
    (tot, pasto) => {
      const t = totaliPasto(pasto);
      return { kcal: tot.kcal + t.kcal, prot: tot.prot + t.prot };
    },
    { kcal: 0, prot: 0 }
  );
}

/**
 * Lista della spesa per i giorni indicati.
 * Restituisce [{ reparto, voci: [{ id, nome, grammi, etichetta }] }].
 */
export function listaSpesa(indiciGiorni) {
  const totali = new Map();

  for (const g of indiciGiorni) {
    for (const pasto of PIANO[g]) {
      for (const ing of pasto.ingredienti) {
        totali.set(ing.id, (totali.get(ing.id) || 0) + grammi(ing.id, ing.q));
      }
    }
  }

  const perReparto = new Map();
  for (const [id, g] of totali) {
    const a = ALIMENTI[id];
    if (!perReparto.has(a.reparto)) perReparto.set(a.reparto, []);
    perReparto.get(a.reparto).push({ id, nome: a.nome, grammi: g, etichetta: etichettaSpesa(a, g) });
  }

  for (const voci of perReparto.values()) {
    voci.sort((a, b) => a.nome.localeCompare(b.nome, 'it'));
  }
  return perReparto;
}

/** Quantità da comprare, arrotondata a qualcosa di sensato al supermercato. */
function etichettaSpesa(alimento, g) {
  if (alimento.unita === 'pz') {
    return `${Math.ceil(g / alimento.pesoPz)} pz`;
  }
  const unita = alimento.unita === 'ml' ? 'ml' : 'g';
  if (g >= 1000) return `${(Math.ceil(g / 50) * 50 / 1000).toFixed(2).replace('.', ',')} ${unita === 'ml' ? 'l' : 'kg'}`;
  if (g >= 100) return `${Math.ceil(g / 10) * 10} ${unita}`;
  return `${Math.ceil(g / 5) * 5} ${unita}`;
}
