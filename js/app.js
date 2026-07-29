/*
 * Logica dell'interfaccia: le quattro schermate (Piano, Spesa, Mounjaro, Peso),
 * la navigazione fra schede e il disegno dei dati salvati.
 */

import { ALIMENTI, REPARTI, formattaQuantita } from './alimenti.js';
import {
  PIANO, GIORNI, totaliPasto, totaliGiorno, listaSpesa,
  OBIETTIVO_KCAL, OBIETTIVO_PROTEINE
} from './piano.js';
import { getStato, aggiorna, esporta, importa } from './store.js';

const SITI = ['Addome', 'Coscia', 'Braccio'];
const GIORNI_SETTIMANA = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ------------------------------------------------------------------- date */

/** Indice nel piano (0 = lunedì) del giorno di oggi. */
function indiceOggi() {
  return (new Date().getDay() + 6) % 7;
}

/** 'AAAA-MM-GG' in ora locale: toISOString userebbe UTC e sbaglierebbe giorno la sera. */
function isoLocale(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function daIso(iso) {
  const [a, m, g] = iso.split('-').map(Number);
  return new Date(a, m - 1, g);
}

function dataEstesa(d) {
  return d.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
}

function dataBreve(iso) {
  return daIso(iso).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

/** Giorni interi fra due date, ignorando l'orario. */
function giorniTra(da, a) {
  const g = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.round((g(a) - g(da)) / 86400000);
}

function numero(n, decimali = 0) {
  return n.toLocaleString('it-IT', { minimumFractionDigits: decimali, maximumFractionDigits: decimali });
}

/* --------------------------------------------------------------- messaggi */

let timerNotifica;
function avvisa(testo) {
  const n = $('#notifica');
  n.textContent = testo;
  n.classList.add('visibile');
  clearTimeout(timerNotifica);
  timerNotifica = setTimeout(() => n.classList.remove('visibile'), 2200);
}

/* --------------------------------------------------------------- schermate */

const INTESTAZIONI = {
  piano: ['Piano', '1800 kcal · senza legumi'],
  spesa: ['Spesa', 'Ingredienti della settimana'],
  mounjaro: ['Mounjaro', 'Terapia settimanale'],
  peso: ['Peso', 'Andamento nel tempo']
};

function mostraVista(nome) {
  $$('.vista').forEach((v) => { v.hidden = v.id !== `vista-${nome}`; });
  $$('.tab').forEach((t) => {
    const attiva = t.dataset.vista === nome;
    t.classList.toggle('attiva', attiva);
    t.setAttribute('aria-selected', String(attiva));
  });
  const [titolo, sottotitolo] = INTESTAZIONI[nome];
  $('#titolo-vista').textContent = titolo;
  $('#sottotitolo-vista').textContent = sottotitolo;
  window.scrollTo({ top: 0 });

  if (nome === 'piano') aggiornaSottotitoloPiano();
  if (nome === 'spesa') disegnaSpesa();
  if (nome === 'mounjaro') disegnaMounjaro();
  if (nome === 'peso') disegnaPeso();
}

/* -------------------------------------------------------------- 1. piano  */

let giornoSelezionato = indiceOggi();

function disegnaSelettoreGiorni() {
  const cont = $('#selettore-giorni');
  cont.innerHTML = '';
  GIORNI.forEach((g, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'giorno' + (i === giornoSelezionato ? ' attivo' : '');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(i === giornoSelezionato));
    b.innerHTML = `${g.slice(0, 3)}<small>${i === indiceOggi() ? 'oggi' : `${Math.round(totaliGiorno(i).kcal)} kcal`}</small>`;
    b.addEventListener('click', () => {
      giornoSelezionato = i;
      disegnaPiano();
      b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
    cont.appendChild(b);
  });
}

function disegnaRiepilogo() {
  const t = totaliGiorno(giornoSelezionato);
  const pKcal = Math.min(100, (t.kcal / OBIETTIVO_KCAL) * 100);
  const pProt = Math.min(100, (t.prot / OBIETTIVO_PROTEINE) * 100);
  $('#riepilogo-giorno').innerHTML = `
    <div class="metrica">
      <p class="etichetta">Energia</p>
      <p class="valore">${numero(Math.round(t.kcal))} <span>/ ${OBIETTIVO_KCAL} kcal</span></p>
      <div class="barra-avanzamento"><i style="width:${pKcal}%"></i></div>
    </div>
    <div class="metrica">
      <p class="etichetta">Proteine</p>
      <p class="valore">${numero(Math.round(t.prot))} <span>/ ${OBIETTIVO_PROTEINE} g</span></p>
      <div class="barra-avanzamento"><i style="width:${pProt}%"></i></div>
    </div>`;
}

function disegnaPasti() {
  const cont = $('#elenco-pasti');
  cont.innerHTML = '';

  PIANO[giornoSelezionato].forEach((pasto) => {
    const t = totaliPasto(pasto);
    const d = document.createElement('details');
    d.className = 'pasto';

    const righe = pasto.ingredienti
      .map((ing) => `<li><span>${ALIMENTI[ing.id].nome}</span><span class="quantita">${formattaQuantita(ing.id, ing.q)}</span></li>`)
      .join('');

    d.innerHTML = `
      <summary>
        <div class="pasto-testo">
          <div class="pasto-tipo">${pasto.tipo}</div>
          <div class="pasto-nome">${pasto.nome}</div>
        </div>
        <div class="pasto-macro"><b>${Math.round(t.kcal)} kcal</b>${Math.round(t.prot)} g prot</div>
        <span class="freccia" aria-hidden="true"></span>
      </summary>
      <div class="pasto-dettaglio">
        <ul class="ingredienti">${righe}</ul>
        ${pasto.note ? `<p class="consiglio">${pasto.note}</p>` : ''}
      </div>`;
    cont.appendChild(d);
  });
}

function aggiornaSottotitoloPiano() {
  $('#sottotitolo-vista').textContent =
    `${GIORNI[giornoSelezionato]}${giornoSelezionato === indiceOggi() ? ' · oggi' : ''} · senza legumi`;
}

function disegnaPiano() {
  disegnaSelettoreGiorni();
  disegnaRiepilogo();
  disegnaPasti();
  aggiornaSottotitoloPiano();
}

/* -------------------------------------------------------------- 2. spesa  */

function disegnaSelettoreSpesa() {
  const cont = $('#selettore-spesa');
  const scelti = getStato().spesa.giorni;
  cont.innerHTML = '';

  GIORNI.forEach((g, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (scelti.includes(i) ? ' attivo' : '');
    b.textContent = g.slice(0, 3);
    b.setAttribute('aria-pressed', String(scelti.includes(i)));
    b.addEventListener('click', () => {
      aggiorna((s) => {
        s.spesa.giorni = s.spesa.giorni.includes(i)
          ? s.spesa.giorni.filter((x) => x !== i)
          : [...s.spesa.giorni, i].sort((a, b2) => a - b2);
      });
      disegnaSpesa();
    });
    cont.appendChild(b);
  });
}

function disegnaSpesa() {
  disegnaSelettoreSpesa();

  const stato = getStato();
  const cont = $('#elenco-spesa');
  cont.innerHTML = '';

  if (stato.spesa.giorni.length === 0) {
    cont.innerHTML = '<div class="scheda"><p class="vuoto">Scegli almeno un giorno per generare la lista.</p></div>';
    return;
  }

  const perReparto = listaSpesa(stato.spesa.giorni);

  for (const reparto of REPARTI) {
    const voci = perReparto.get(reparto);
    if (!voci || voci.length === 0) continue;

    const sez = document.createElement('section');
    sez.className = 'reparto';
    sez.innerHTML = `<h2>${reparto}</h2><div class="voci"></div>`;
    const lista = sez.querySelector('.voci');

    for (const voce of voci) {
      const spuntato = stato.spesa.spuntati.includes(voce.id);
      const l = document.createElement('label');
      l.className = 'voce';
      l.innerHTML = `
        <input type="checkbox" ${spuntato ? 'checked' : ''}>
        <span class="casella" aria-hidden="true"></span>
        <span class="voce-nome"></span>
        <span class="voce-quantita">${voce.etichetta}</span>`;
      l.querySelector('.voce-nome').textContent = voce.nome;

      l.querySelector('input').addEventListener('change', (e) => {
        aggiorna((s) => {
          s.spesa.spuntati = e.target.checked
            ? [...new Set([...s.spesa.spuntati, voce.id])]
            : s.spesa.spuntati.filter((x) => x !== voce.id);
        });
        aggiornaContatoreSpesa();
      });
      lista.appendChild(l);
    }
    cont.appendChild(sez);
  }

  aggiornaContatoreSpesa();
}

function aggiornaContatoreSpesa() {
  const caselle = $$('#elenco-spesa input[type="checkbox"]');
  const presi = caselle.filter((c) => c.checked).length;
  $('#sottotitolo-vista').textContent = `${presi} di ${caselle.length} articoli presi`;
}

/* ----------------------------------------------------------- 3. mounjaro  */

/** Prossima data di iniezione a partire da oggi, dato il giorno scelto (0-6, domenica=0). */
function prossimaIniezione(giorno) {
  const oggi = new Date();
  const delta = (giorno - oggi.getDay() + 7) % 7;
  const d = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate() + delta);
  return d;
}

function ultimaIniezione() {
  const iniezioni = getStato().mounjaro.iniezioni;
  if (iniezioni.length === 0) return null;
  return iniezioni.reduce((max, i) => (i.data > max.data ? i : max));
}

function sitoSuggerito() {
  const ultima = ultimaIniezione();
  if (!ultima) return SITI[0];
  const i = SITI.indexOf(ultima.sito);
  return SITI[(i + 1) % SITI.length];
}

function disegnaProssima() {
  const m = getStato().mounjaro;
  const card = $('#prossima-iniezione');

  if (m.giornoIniezione === null) {
    card.innerHTML = `
      <p class="etichetta">Prossima iniezione</p>
      <p class="grande">Da impostare</p>
      <p class="nota">Scegli qui sotto il giorno in cui fai l'iniezione settimanale.</p>`;
    return;
  }

  const prossima = prossimaIniezione(m.giornoIniezione);
  const mancano = giorniTra(new Date(), prossima);
  const fattaOggi = getStato().mounjaro.iniezioni.some((i) => i.data === isoLocale());

  let quando;
  if (mancano === 0) quando = fattaOggi ? 'Fatta oggi' : 'Oggi';
  else if (mancano === 1) quando = 'Domani';
  else quando = `Tra ${mancano} giorni`;

  card.innerHTML = `
    <p class="etichetta">Prossima iniezione</p>
    <p class="grande">${quando}</p>
    <p class="nota">${dataEstesa(prossima)}${m.dose ? ` · ${m.dose}` : ''}</p>`;
}

function disegnaStoricoIniezioni() {
  const iniezioni = [...getStato().mounjaro.iniezioni].sort((a, b) => b.data.localeCompare(a.data));
  const cont = $('#storico-iniezioni');

  if (iniezioni.length === 0) {
    cont.innerHTML = '<p class="vuoto">Nessuna iniezione registrata.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'elenco';

  iniezioni.slice(0, 12).forEach((iniezione) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="principale">${dataBreve(iniezione.data)}</span>
      <span class="secondario">${iniezione.sito}</span>
      <span class="badge">${iniezione.dose || '—'}</span>
      <button class="bottone bottone-riga" type="button">Elimina</button>`;
    li.querySelector('button').addEventListener('click', () => {
      aggiorna((s) => {
        s.mounjaro.iniezioni = s.mounjaro.iniezioni.filter(
          (x) => !(x.data === iniezione.data && x.sito === iniezione.sito && x.dose === iniezione.dose)
        );
      });
      disegnaMounjaro();
      avvisa('Iniezione eliminata');
    });
    ul.appendChild(li);
  });

  cont.innerHTML = '';
  cont.appendChild(ul);

  if (iniezioni.length > 12) {
    const p = document.createElement('p');
    p.className = 'nota';
    p.textContent = `Mostrate le ultime 12 di ${iniezioni.length}.`;
    cont.appendChild(p);
  }
}

function disegnaMounjaro() {
  const m = getStato().mounjaro;

  const select = $('#giorno-iniezione');
  if (select.options.length === 1) {
    GIORNI_SETTIMANA.forEach((nome, i) => select.add(new Option(nome, String(i))));
  }
  select.value = m.giornoIniezione === null ? '' : String(m.giornoIniezione);
  $('#dose-attuale').value = m.dose || '';

  if (!$('#data-iniezione').value) $('#data-iniezione').value = isoLocale();
  $('#sito-iniezione').value = sitoSuggerito();

  const ultima = ultimaIniezione();
  $('#suggerimento-sito').textContent = ultima
    ? `Ultima volta: ${ultima.sito}, il ${dataBreve(ultima.data)}. Cambia zona a ogni iniezione.`
    : 'Alterna la zona a ogni iniezione per non irritare sempre lo stesso punto.';

  disegnaProssima();
  disegnaStoricoIniezioni();
}

/* --------------------------------------------------------------- 4. peso  */

function pesateOrdinate() {
  return [...getStato().peso].sort((a, b) => a.data.localeCompare(b.data));
}

function disegnaRiepilogoPeso() {
  const p = pesateOrdinate();
  const card = $('#riepilogo-peso');

  if (p.length === 0) {
    card.innerHTML = `
      <p class="etichetta">Peso attuale</p>
      <p class="grande">—</p>
      <p class="nota">Registra la prima pesata per iniziare a vedere l'andamento.</p>`;
    return;
  }

  const attuale = p[p.length - 1];
  const iniziale = p[0];
  const delta = attuale.kg - iniziale.kg;
  const segno = delta > 0 ? '+' : delta < 0 ? '−' : '';

  let riga = `Prima pesata: ${numero(iniziale.kg, 1)} kg il ${dataBreve(iniziale.data)}`;
  if (p.length > 1) {
    riga = `${segno}${numero(Math.abs(delta), 1)} kg dal ${dataBreve(iniziale.data)}`;
    const settimane = giorniTra(daIso(iniziale.data), daIso(attuale.data)) / 7;
    if (settimane >= 1) riga += ` · ${segno}${numero(Math.abs(delta) / settimane, 2)} kg a settimana`;
  }

  card.innerHTML = `
    <p class="etichetta">Peso attuale</p>
    <p class="grande">${numero(attuale.kg, 1)} kg</p>
    <p class="nota">${riga}</p>`;
}

function disegnaGrafico() {
  const p = pesateOrdinate();
  const cont = $('#grafico-peso');

  if (p.length < 2) {
    cont.innerHTML = '<p class="vuoto">Servono almeno due pesate per disegnare la curva.</p>';
    return;
  }

  const L = 320, A = 150, M = { alto: 12, basso: 22, sx: 34, dx: 8 };
  const t = p.map((v) => daIso(v.data).getTime());
  const kg = p.map((v) => v.kg);

  const tMin = Math.min(...t), tMax = Math.max(...t);
  // Un po' di margine sopra e sotto, e un minimo di 1 kg di scala per non
  // trasformare oscillazioni da mezzo etto in montagne russe.
  const kgMin = Math.min(...kg), kgMax = Math.max(...kg);
  const meta = (kgMin + kgMax) / 2;
  const ampiezza = Math.max(kgMax - kgMin, 1) * 1.25;
  const basso = meta - ampiezza / 2, alto = meta + ampiezza / 2;

  const x = (i) => M.sx + ((t[i] - tMin) / Math.max(tMax - tMin, 1)) * (L - M.sx - M.dx);
  const y = (v) => M.alto + (1 - (v - basso) / (alto - basso)) * (A - M.alto - M.basso);

  const punti = kg.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
  const area = `M ${x(0).toFixed(1)},${(A - M.basso).toFixed(1)} L ${punti.join(' L ')} L ${x(kg.length - 1).toFixed(1)},${(A - M.basso).toFixed(1)} Z`;

  const griglia = [alto, meta, basso]
    .map((v) => `<line class="griglia" x1="${M.sx}" y1="${y(v).toFixed(1)}" x2="${L - M.dx}" y2="${y(v).toFixed(1)}"/>
                 <text x="0" y="${(y(v) + 3.5).toFixed(1)}">${numero(v, 1)}</text>`)
    .join('');

  const pallini = kg
    .map((v, i) => `<circle class="punto" cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="${i === kg.length - 1 ? 4 : 2.5}"/>`)
    .join('');

  cont.innerHTML = `
    <svg class="grafico" viewBox="0 0 ${L} ${A}" role="img"
         aria-label="Andamento del peso da ${numero(kg[0], 1)} a ${numero(kg[kg.length - 1], 1)} kg">
      ${griglia}
      <path class="area" d="${area}"/>
      <polyline class="linea" points="${punti.join(' ')}"/>
      ${pallini}
      <text x="${M.sx}" y="${A - 6}">${dataBreve(p[0].data)}</text>
      <text x="${L - M.dx}" y="${A - 6}" text-anchor="end">${dataBreve(p[p.length - 1].data)}</text>
    </svg>`;
}

function disegnaStoricoPeso() {
  const p = pesateOrdinate().reverse();
  const cont = $('#storico-peso');

  if (p.length === 0) {
    cont.innerHTML = '<p class="vuoto">Nessuna pesata registrata.</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'elenco';

  p.slice(0, 15).forEach((pesata, i) => {
    const precedente = p[i + 1];
    const delta = precedente ? pesata.kg - precedente.kg : null;
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="principale">${numero(pesata.kg, 1)} kg</span>
      <span class="secondario">${dataBreve(pesata.data)}</span>
      ${delta === null ? '' : `<span class="badge ${delta > 0 ? 'attenzione' : ''}">${delta > 0 ? '+' : delta < 0 ? '−' : ''}${numero(Math.abs(delta), 1)}</span>`}
      <button class="bottone bottone-riga" type="button">Elimina</button>`;
    li.querySelector('button').addEventListener('click', () => {
      aggiorna((s) => { s.peso = s.peso.filter((x) => x.data !== pesata.data); });
      disegnaPeso();
      avvisa('Pesata eliminata');
    });
    ul.appendChild(li);
  });

  cont.innerHTML = '';
  cont.appendChild(ul);

  if (p.length > 15) {
    const nota = document.createElement('p');
    nota.className = 'nota';
    nota.textContent = `Mostrate le ultime 15 di ${p.length}.`;
    cont.appendChild(nota);
  }
}

function disegnaPeso() {
  if (!$('#data-peso').value) $('#data-peso').value = isoLocale();
  disegnaRiepilogoPeso();
  disegnaGrafico();
  disegnaStoricoPeso();
}

/* ------------------------------------------------------------------ eventi */

function collegaEventi() {
  $$('.tab').forEach((t) => t.addEventListener('click', () => mostraVista(t.dataset.vista)));

  $('#azzera-spesa').addEventListener('click', () => {
    aggiorna((s) => { s.spesa.spuntati = []; });
    disegnaSpesa();
    avvisa('Spunte azzerate');
  });

  $('#giorno-iniezione').addEventListener('change', (e) => {
    aggiorna((s) => { s.mounjaro.giornoIniezione = e.target.value === '' ? null : Number(e.target.value); });
    disegnaProssima();
  });

  $('#dose-attuale').addEventListener('change', (e) => {
    aggiorna((s) => { s.mounjaro.dose = e.target.value; });
    disegnaProssima();
  });

  $('#salva-iniezione').addEventListener('click', () => {
    const data = $('#data-iniezione').value;
    if (!data) return avvisa('Scegli una data');

    const nuova = { data, dose: getStato().mounjaro.dose, sito: $('#sito-iniezione').value };
    aggiorna((s) => {
      s.mounjaro.iniezioni = [...s.mounjaro.iniezioni.filter((x) => x.data !== data), nuova];
      // La prima iniezione registrata fissa anche il giorno della settimana,
      // così non c'è da impostarlo a mano.
      if (s.mounjaro.giornoIniezione === null) s.mounjaro.giornoIniezione = daIso(data).getDay();
    });
    disegnaMounjaro();
    avvisa('Iniezione registrata');
  });

  $('#salva-peso').addEventListener('click', () => {
    const data = $('#data-peso').value;
    const grezzo = $('#valore-peso').value.replace(',', '.');
    const kg = Number.parseFloat(grezzo);

    if (!data) return avvisa('Scegli una data');
    if (!Number.isFinite(kg) || kg < 30 || kg > 300) return avvisa('Inserisci un peso fra 30 e 300 kg');

    aggiorna((s) => {
      // Una sola pesata per giorno: la nuova sostituisce quella dello stesso giorno.
      s.peso = [...s.peso.filter((x) => x.data !== data), { data, kg: Math.round(kg * 10) / 10 }];
    });
    $('#valore-peso').value = '';
    disegnaPeso();
    avvisa('Pesata salvata');
  });

  $('#esporta-dati').addEventListener('click', () => {
    const blob = new Blob([esporta()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dieta-1800-${isoLocale()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $('#importa-dati').addEventListener('click', () => $('#file-importa').click());

  $('#file-importa').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ok = importa(await file.text());
    e.target.value = '';
    if (!ok) return avvisa('File non valido');
    disegnaPeso();
    disegnaSpesa();
    disegnaMounjaro();
    avvisa('Dati importati');
  });
}

/* ------------------------------------------------------------------- avvio */

let giornoDisegnato = indiceOggi();

disegnaPiano();
collegaEventi();

// Un'app aggiunta alla schermata Home resta aperta per giorni: al rientro
// controllo se nel frattempo è cambiato il giorno e riporto il piano su oggi.
document.addEventListener('visibilitychange', () => {
  if (document.hidden || indiceOggi() === giornoDisegnato) return;
  giornoDisegnato = indiceOggi();
  giornoSelezionato = giornoDisegnato;
  disegnaPiano();
  if (!$('#vista-mounjaro').hidden) disegnaMounjaro();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('Service worker non registrato', e));
  });
}
