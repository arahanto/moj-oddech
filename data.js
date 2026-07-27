/* ===== Mój Oddech — dane: zapis/odczyt localStorage, progi, oceny ===== */

const KLUCZ_DANYCH = "mojOddechDane";

const DOMYSLNE_DANE = {
  ustawienia: {
    imie: "",
    telefonPomoc: "",
    celRespiratoraMin: 8 * 60,
    glos: false,
    leki: [
      // { id: "l1", nazwa: "Prednizon", godziny: ["08:00"] }
    ],
    progi: {
      // Wartości ostrożne, ogólne — USTAW JE Z LEKARZEM w ustawieniach.
      spo2:  { alarm: 88, uwaga: 92 },          // % tlenu we krwi: poniżej "alarm" = czerwone
      puls:  { nisko: 50, wysoko: 110 },
      cisnienieSys: { nisko: 95, wysoko: 160 },
      przyrostWagiKg3Dni: 2                      // szybki przyrost = zatrzymywanie wody
    },
    github: { repo: "", token: "" }
  },
  dni: {},               // "2026-07-27": { ... }
  respiratorStart: null, // timestamp trwającej sesji albo null
  ostatniBackup: ""      // "2026-07-27"
};

let DANE = null;

function wczytajDane() {
  try {
    const surowe = localStorage.getItem(KLUCZ_DANYCH);
    DANE = surowe ? JSON.parse(surowe) : structuredClone(DOMYSLNE_DANE);
  } catch (e) {
    DANE = structuredClone(DOMYSLNE_DANE);
  }
  // uzupełnij brakujące pola po aktualizacji aplikacji
  DANE.ustawienia = Object.assign(structuredClone(DOMYSLNE_DANE.ustawienia), DANE.ustawienia || {});
  DANE.ustawienia.progi = Object.assign(structuredClone(DOMYSLNE_DANE.ustawienia.progi), DANE.ustawienia.progi || {});
  DANE.ustawienia.github = Object.assign({ repo: "", token: "" }, DANE.ustawienia.github || {});
  if (!DANE.dni) DANE.dni = {};
  return DANE;
}

function zapiszDane() {
  localStorage.setItem(KLUCZ_DANYCH, JSON.stringify(DANE));
}

function kluczDnia(data) {
  const d = data || new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dz = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dz}`;
}

function dzien(klucz) {
  const k = klucz || kluczDnia();
  if (!DANE.dni[k]) {
    DANE.dni[k] = {
      leki: {},          // "idLeku@08:00": timestamp wzięcia
      respirator: [],    // [{start, koniec}] w ms
      pomiary: { spo2: [], puls: [], waga: [], cisnienie: [] },
      posilki: {},       // { sniadanie: true, ... }
      woda: 0,
      apetyt: "",
      dziennik: null     // { oddech: 1-3, obrzeki: true/false, zmeczenie: 1-3 }
    };
  }
  return DANE.dni[k];
}

/* ---- respirator ---- */

function respiratorMinutyDzis() {
  const d = dzien();
  let ms = d.respirator.reduce((s, sesja) => s + (sesja.koniec - sesja.start), 0);
  if (DANE.respiratorStart) ms += Date.now() - DANE.respiratorStart;
  return Math.floor(ms / 60000);
}

function respiratorPrzelacz() {
  if (DANE.respiratorStart) {
    dzien().respirator.push({ start: DANE.respiratorStart, koniec: Date.now() });
    DANE.respiratorStart = null;
  } else {
    DANE.respiratorStart = Date.now();
  }
  zapiszDane();
}

/* ---- oceny pomiarów: zwracają {poziom: "ok"|"uwaga"|"alarm", zdanie} ---- */

function ocenSpo2(v) {
  const p = DANE.ustawienia.progi.spo2;
  if (v < p.alarm) return { poziom: "alarm", zdanie: `Tlen ${v}% — to za mało. Załóż respirator i odpocznij. Jeśli po pół godzinie nie będzie lepiej — zadzwoń do lekarza lub naciśnij POMOC.` };
  if (v < p.uwaga) return { poziom: "uwaga", zdanie: `Tlen ${v}% — trochę nisko. Usiądź spokojnie, oddychaj powoli i zmierz jeszcze raz za 15 minut.` };
  return { poziom: "ok", zdanie: `Tlen ${v}% — w porządku. Tak trzymaj!` };
}

function ocenPuls(v) {
  const p = DANE.ustawienia.progi.puls;
  if (v < p.nisko) return { poziom: "uwaga", zdanie: `Puls ${v} — dość wolny. Jeśli kręci Ci się w głowie, powiedz o tym lekarzowi.` };
  if (v > p.wysoko + 20) return { poziom: "alarm", zdanie: `Puls ${v} — bardzo szybki. Usiądź, odpocznij. Jeśli nie zwolni — zadzwoń do lekarza.` };
  if (v > p.wysoko) return { poziom: "uwaga", zdanie: `Puls ${v} — przyspieszony. Odpocznij chwilę i zmierz ponownie.` };
  return { poziom: "ok", zdanie: `Puls ${v} — w porządku.` };
}

function ocenCisnienie(sys, dia) {
  const p = DANE.ustawienia.progi.cisnienieSys;
  if (sys < p.nisko) return { poziom: "uwaga", zdanie: `Ciśnienie ${sys}/${dia} — niskie. Wstawaj powoli, nie zrywaj się z łóżka.` };
  if (sys > p.wysoko + 20) return { poziom: "alarm", zdanie: `Ciśnienie ${sys}/${dia} — wysokie. Odpocznij i zmierz za 15 minut. Jeśli nadal tak wysoko — zadzwoń do lekarza.` };
  if (sys > p.wysoko) return { poziom: "uwaga", zdanie: `Ciśnienie ${sys}/${dia} — podwyższone. Zmierz jeszcze raz po odpoczynku.` };
  return { poziom: "ok", zdanie: `Ciśnienie ${sys}/${dia} — w porządku.` };
}

function ocenWage(v) {
  // porównaj z pomiarem sprzed ~3 dni
  const historia = historiaPomiarow("waga", 7);
  const prog = DANE.ustawienia.progi.przyrostWagiKg3Dni;
  const stare = historia.filter(w => (Date.now() - w.t) > 2.5 * 86400000);
  if (stare.length) {
    const roznica = v - stare[stare.length - 1].v;
    if (roznica >= prog) {
      return { poziom: "alarm", zdanie: `Waga ${v} kg — przybyło ${roznica.toFixed(1)} kg w kilka dni. To może być woda w organizmie. Powiedz o tym lekarzowi jeszcze dziś.` };
    }
    if (roznica <= -prog) {
      return { poziom: "uwaga", zdanie: `Waga ${v} kg — ubyło ${Math.abs(roznica).toFixed(1)} kg. Jedz regularnie, powiedz o tym lekarzowi przy wizycie.` };
    }
  }
  return { poziom: "ok", zdanie: `Waga ${v} kg — zapisana. Dziękuję!` };
}

/* ---- historia do wykresów i raportu ---- */

function historiaPomiarow(typ, dniWstecz) {
  const wynik = [];
  const od = Date.now() - dniWstecz * 86400000;
  for (const [k, d] of Object.entries(DANE.dni)) {
    for (const p of (d.pomiary[typ] || [])) {
      if (p.t >= od) wynik.push(p);
    }
  }
  wynik.sort((a, b) => a.t - b.t);
  return wynik;
}

function statystykiRaportu(dniWstecz) {
  const od = new Date(Date.now() - dniWstecz * 86400000);
  let lekiWziete = 0, lekiPlan = 0, respMin = 0, respDni = 0;
  const samopoczucie = [], apetyty = [];
  for (const [k, d] of Object.entries(DANE.dni)) {
    if (k < kluczDnia(od)) continue;
    const plan = DANE.ustawienia.leki.reduce((s, l) => s + l.godziny.length, 0);
    lekiPlan += plan;
    lekiWziete += Object.keys(d.leki).length;
    const min = d.respirator.reduce((s, x) => s + (x.koniec - x.start), 0) / 60000;
    if (min > 0) { respMin += min; respDni++; }
    if (d.dziennik) samopoczucie.push(d.dziennik);
    if (d.apetyt) apetyty.push(d.apetyt);
  }
  return { lekiWziete, lekiPlan, respMin, respDni, samopoczucie, apetyty };
}

/* ---- eksport ---- */

function eksportujJson() {
  return JSON.stringify(DANE, null, 2);
}
