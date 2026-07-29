/*
 * Controllo del piano settimanale: stampa kcal e proteine di ogni pasto e di
 * ogni giornata, e segnala gli scostamenti fuori tolleranza dall'obiettivo.
 *
 *   node tools/verifica-piano.mjs
 *
 * Esce con codice 1 se un giorno esce dalla tolleranza, così può essere usato
 * anche come controllo automatico dopo una modifica al piano.
 */

import { PIANO, GIORNI, totaliGiorno, totaliPasto, OBIETTIVO_KCAL, OBIETTIVO_PROTEINE } from '../js/piano.js';
import { ALIMENTI } from '../js/alimenti.js';

const TOLLERANZA_KCAL = 90; // ±5% circa
const PROTEINE_MINIME = 120;

// Un errore di battitura in un id alimento renderebbe il piano incoerente in
// silenzio: meglio accorgersene qui.
const LEGUMI = ['fagiol', 'cece', 'ceci', 'lenticch', 'pisell', 'fava', 'soia', 'edamame', 'tofu', 'lupin', 'arachid'];
for (const [id, a] of Object.entries(ALIMENTI)) {
  const testo = `${id} ${a.nome}`.toLowerCase();
  if (LEGUMI.some((l) => testo.includes(l))) {
    console.error(`LEGUME nel catalogo: ${a.nome}`);
    process.exit(1);
  }
}

let problemi = 0;
let sommaKcal = 0;
let sommaProt = 0;

PIANO.forEach((giorno, i) => {
  const t = totaliGiorno(i);
  sommaKcal += t.kcal;
  sommaProt += t.prot;

  const scarto = t.kcal - OBIETTIVO_KCAL;
  const fuori = Math.abs(scarto) > TOLLERANZA_KCAL || t.prot < PROTEINE_MINIME;
  if (fuori) problemi++;

  console.log(
    `\n${GIORNI[i].padEnd(10)} ${Math.round(t.kcal).toString().padStart(4)} kcal  ` +
      `${Math.round(t.prot).toString().padStart(3)} g prot  ` +
      `(${scarto >= 0 ? '+' : ''}${Math.round(scarto)} kcal)${fuori ? '  <-- FUORI TOLLERANZA' : ''}`
  );

  giorno.forEach((pasto) => {
    const p = totaliPasto(pasto);
    console.log(
      `   ${pasto.tipo.padEnd(10)} ${Math.round(p.kcal).toString().padStart(4)} kcal  ` +
        `${Math.round(p.prot).toString().padStart(3)} g   ${pasto.nome}`
    );
  });
});

console.log(
  `\nMedia settimanale: ${Math.round(sommaKcal / 7)} kcal, ${Math.round(sommaProt / 7)} g di proteine al giorno.`
);
console.log(`Obiettivo: ${OBIETTIVO_KCAL} kcal, ${OBIETTIVO_PROTEINE} g di proteine.`);

if (problemi) {
  console.error(`\n${problemi} giorno/i fuori tolleranza.`);
  process.exit(1);
}
console.log('\nTutti i giorni rientrano nella tolleranza.');
