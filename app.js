/* ===== Mój Oddech — logika aplikacji ===== */

const DNI_TYGODNIA = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];
const MIESIACE = ["stycznia", "lutego", "marca", "kwietnia", "maja", "czerwca",
  "lipca", "sierpnia", "września", "października", "listopada", "grudnia"];

let ekranAktywny = "ekran-dzis";
let wpisStan = null;               // { typ, etap, wartosc, sys }
let powiadomioneDawki = {};        // "id@08:00@2026-07-27" -> timestamp ostatniego przypomnienia

/* ---------- nawigacja ---------- */

function pokaz(id) {
  document.querySelectorAll(".ekran").forEach(e => e.classList.remove("aktywny"));
  document.getElementById(id).classList.add("aktywny");
  ekranAktywny = id;
  window.scrollTo(0, 0);
  const rysuj = {
    "ekran-dzis": rysujDzis,
    "ekran-leki": rysujLeki,
    "ekran-respirator": rysujRespirator,
    "ekran-dieta": rysujDiete,
    "ekran-dziennik": rysujDziennik,
    "ekran-raport": rysujRaport,
    "ekran-wykresy": rysujWykresy,
    "ekran-ustawienia": rysujUstawienia
  }[id];
  if (rysuj) rysuj();
}

/* ---------- mowa ---------- */

function mow(tekst, zawsze) {
  if (!zawsze && !DANE.ustawienia.glos) return;
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(tekst);
  u.lang = "pl-PL";
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

/* ---------- zegar i „co teraz" ---------- */

function tykniecie() {
  const t = new Date();
  document.getElementById("naglowek-data").textContent =
    `${DNI_TYGODNIA[t.getDay()]}, ${t.getDate()} ${MIESIACE[t.getMonth()]}`;
  document.getElementById("naglowek-zegar").textContent =
    `${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}`;
  document.getElementById("co-teraz").textContent = coTeraz(t);
  if (ekranAktywny === "ekran-respirator") rysujRespirator();
  sprawdzPrzypomnienia(t);
}

function coTeraz(t) {
  if (DANE.respiratorStart) {
    return `😮‍💨 Respirator włączony — już ${formatujMinuty(respiratorMinutyDzis())}. Dobrze!`;
  }
  const zalegly = najblizszaDawka(t, true);
  if (zalegly) return `💊 Czas na lek: ${zalegly.nazwa} (${zalegly.godzina})`;
  const nastepny = najblizszaDawka(t, false);
  if (nastepny && nastepny.zaMin <= 60) return `💊 Za ${nastepny.zaMin} min lek: ${nastepny.nazwa}`;
  const min = respiratorMinutyDzis();
  const cel = DANE.ustawienia.celRespiratoraMin;
  if (t.getHours() >= 18 && min < cel) {
    return `😮‍💨 Do celu respiratora brakuje ${formatujMinuty(cel - min)}. Może teraz?`;
  }
  const imie = DANE.ustawienia.imie;
  return imie ? `Dzień dobry, ${imie}! Wszystko pod kontrolą.` : "Wszystko pod kontrolą.";
}

function formatujMinuty(min) {
  const h = Math.floor(min / 60), m = min % 60;
  if (h === 0) return `${m} min`;
  return `${h} h ${String(m).padStart(2, "0")} min`;
}

/* ---------- leki ---------- */

function dawkiDnia() {
  const d = dzien();
  const wynik = [];
  for (const lek of DANE.ustawienia.leki) {
    for (const g of lek.godziny) {
      wynik.push({ id: lek.id, nazwa: lek.nazwa, godzina: g, wziety: !!d.leki[`${lek.id}@${g}`] });
    }
  }
  wynik.sort((a, b) => a.godzina.localeCompare(b.godzina));
  return wynik;
}

function najblizszaDawka(t, tylkoZalegle) {
  const teraz = t.getHours() * 60 + t.getMinutes();
  let najlepsza = null;
  for (const d of dawkiDnia()) {
    if (d.wziety) continue;
    const [h, m] = d.godzina.split(":").map(Number);
    const kiedy = h * 60 + m;
    if (tylkoZalegle) {
      if (kiedy <= teraz && teraz - kiedy <= 240) return d; // zaległy do 4 godzin
    } else if (kiedy > teraz) {
      const zaMin = kiedy - teraz;
      if (!najlepsza || zaMin < najlepsza.zaMin) najlepsza = { ...d, zaMin };
    }
  }
  return tylkoZalegle ? null : najlepsza;
}

function rysujLeki() {
  const el = document.getElementById("leki-lista");
  const dawki = dawkiDnia();
  if (!dawki.length) {
    el.innerHTML = `<div class="karta"><h3>Brak leków w aplikacji</h3>
      <p class="opis">Poproś opiekuna, aby dodał leki w ustawieniach.</p></div>`;
    return;
  }
  el.innerHTML = dawki.map(d => `
    <div class="karta ${d.wziety ? "ok zrobione" : "uwaga"}">
      <h3>${d.nazwa} — godz. ${d.godzina}</h3>
      ${d.wziety
        ? `<p class="opis">✓ Wzięty. Dziękuję!</p>`
        : `<button class="przycisk zielony" data-dawka="${d.id}@${d.godzina}">WZIĄŁEM ✓</button>`}
    </div>`).join("");
  el.querySelectorAll("[data-dawka]").forEach(b => b.addEventListener("click", () => {
    dzien().leki[b.dataset.dawka] = Date.now();
    zapiszDane();
    schowajBaner();
    mow("Zapisane. Lek wzięty.");
    rysujLeki();
  }));
}

function sprawdzPrzypomnienia(t) {
  const zalegly = najblizszaDawka(t, true);
  if (!zalegly) { if (banerTyp === "lek") schowajBaner(); return; }
  pokazBaner(`💊 CZAS NA LEK: ${zalegly.nazwa} (${zalegly.godzina}) — dotknij tutaj`, "lek",
    () => pokaz("ekran-leki"));
  const klucz = `${zalegly.id}@${zalegly.godzina}@${kluczDnia()}`;
  const ostatnio = powiadomioneDawki[klucz] || 0;
  if (Date.now() - ostatnio > 30 * 60000) { // przypominaj co 30 minut
    powiadomioneDawki[klucz] = Date.now();
    powiadom(`Czas na lek: ${zalegly.nazwa}`, `Zaplanowany na ${zalegly.godzina}. Po wzięciu dotknij „WZIĄŁEM".`);
    mow(`Czas na lek ${zalegly.nazwa}`);
  }
}

function powiadom(tytul, tresc) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    navigator.serviceWorker.getRegistration().then(r => {
      if (r) r.showNotification(tytul, { body: tresc, icon: "ikony/ikona-192.png", tag: "lek" });
    });
  } catch (e) { /* powiadomienia to dodatek — aplikacja działa bez nich */ }
}

/* ---------- baner ---------- */

let banerTyp = null;
function pokazBaner(tekst, typ, akcja) {
  const b = document.getElementById("baner");
  b.textContent = tekst;
  b.classList.add("widoczny");
  banerTyp = typ;
  b.onclick = akcja || schowajBaner;
}
function schowajBaner() {
  document.getElementById("baner").classList.remove("widoczny");
  banerTyp = null;
}

/* ---------- ekran główny ---------- */

function rysujDzis() {
  const dawki = dawkiDnia();
  const wziete = dawki.filter(d => d.wziety).length;
  const pLeki = document.getElementById("kafel-leki-podpis");
  if (!dawki.length) pLeki.textContent = "brak leków";
  else if (wziete === dawki.length) { pLeki.textContent = "wszystkie wzięte ✓"; pLeki.className = "podpis ok"; }
  else { pLeki.textContent = `${wziete} z ${dawki.length} wziętych`; pLeki.className = "podpis uwaga"; }

  const min = respiratorMinutyDzis();
  const cel = DANE.ustawienia.celRespiratoraMin;
  const pResp = document.getElementById("kafel-respirator-podpis");
  pResp.textContent = `${formatujMinuty(min)} z ${formatujMinuty(cel)}`;
  pResp.className = "podpis " + (min >= cel ? "ok" : "");

  const spo2 = historiaPomiarow("spo2", 1);
  document.getElementById("kafel-pomiary-podpis").textContent =
    spo2.length ? `tlen dziś: ${spo2[spo2.length - 1].v}%` : "zmierz dziś tlen";

  const posilki = dzien().posilki;
  const zjedzone = Object.keys(posilki).length;
  document.getElementById("kafel-dieta-podpis").textContent = `${zjedzone} z 5 posiłków`;

  const pDz = document.getElementById("kafel-dziennik-podpis");
  if (dzien().dziennik) { pDz.textContent = "zapisane ✓"; pDz.className = "podpis ok"; }
  else { pDz.textContent = "odpowiedz wieczorem"; pDz.className = "podpis"; }
}

/* ---------- respirator ---------- */

function rysujRespirator() {
  const min = respiratorMinutyDzis();
  const cel = DANE.ustawienia.celRespiratoraMin;
  const procent = Math.min(1, min / cel);
  const obwod = 2 * Math.PI * 95;
  const pasek = document.getElementById("respirator-pasek");
  pasek.style.strokeDasharray = obwod;
  pasek.style.strokeDashoffset = obwod * (1 - procent);
  document.getElementById("respirator-czas-duzy").textContent = formatujMinuty(min);
  document.getElementById("respirator-info").textContent =
    min >= cel ? "Cel na dziś osiągnięty! 🎉" : `cel: ${formatujMinuty(cel)} dziennie`;
  const przycisk = document.getElementById("respirator-przycisk");
  const trwa = !!DANE.respiratorStart;
  przycisk.textContent = trwa ? "KOŃCZĘ ⏹" : "ZACZYNAM ▶";
  przycisk.className = "przycisk " + (trwa ? "czerwony" : "zielony");
  document.getElementById("respirator-oddech").style.display = trwa ? "block" : "none";
}

/* ---------- pomiary ---------- */

const POMIARY_OPIS = {
  spo2:      { tytul: "🫁 Tlen — wynik z pulsoksymetru (%)", min: 50, max: 100, przecinek: false },
  puls:      { tytul: "❤️ Puls — uderzenia na minutę", min: 20, max: 250, przecinek: false },
  waga:      { tytul: "⚖️ Waga (kg)", min: 30, max: 250, przecinek: true },
  cisnienie: { tytul: "🩺 Ciśnienie — GÓRNA liczba", min: 40, max: 280, przecinek: false },
  cisnienie2:{ tytul: "🩺 Ciśnienie — DOLNA liczba", min: 30, max: 200, przecinek: false }
};

function zacznijWpis(typ) {
  wpisStan = { typ, etap: 1, wartosc: "", sys: null };
  document.getElementById("wpis-tytul").textContent = POMIARY_OPIS[typ].tytul;
  document.getElementById("wpis-wartosc").textContent = "";
  document.getElementById("klawisz-kropka").style.visibility =
    POMIARY_OPIS[typ].przecinek ? "visible" : "hidden";
  pokaz("ekran-wpis");
}

function klawisz(znak) {
  if (!wpisStan) return;
  if (znak === "⌫") wpisStan.wartosc = wpisStan.wartosc.slice(0, -1);
  else if (znak === ",") { if (!wpisStan.wartosc.includes(",") && wpisStan.wartosc) wpisStan.wartosc += ","; }
  else if (wpisStan.wartosc.replace(",", "").length < 5) wpisStan.wartosc += znak;
  document.getElementById("wpis-wartosc").textContent = wpisStan.wartosc;
}

function zatwierdzWpis() {
  if (!wpisStan || !wpisStan.wartosc) return;
  const v = parseFloat(wpisStan.wartosc.replace(",", "."));
  const opis = POMIARY_OPIS[wpisStan.typ === "cisnienie" && wpisStan.etap === 2 ? "cisnienie2" : wpisStan.typ];
  if (isNaN(v) || v < opis.min || v > opis.max) {
    document.getElementById("wpis-wartosc").textContent = "";
    wpisStan.wartosc = "";
    pokazBaner(`Ta liczba wygląda na pomyłkę. Spróbuj wpisać jeszcze raz.`, "blad");
    setTimeout(schowajBaner, 4000);
    return;
  }
  if (wpisStan.typ === "cisnienie" && wpisStan.etap === 1) {
    wpisStan.sys = v;
    wpisStan.etap = 2;
    wpisStan.wartosc = "";
    document.getElementById("wpis-tytul").textContent = POMIARY_OPIS.cisnienie2.tytul;
    document.getElementById("wpis-wartosc").textContent = "";
    return;
  }
  const d = dzien();
  let ocena, duzy;
  if (wpisStan.typ === "cisnienie") {
    d.pomiary.cisnienie.push({ t: Date.now(), sys: wpisStan.sys, dia: v });
    ocena = ocenCisnienie(wpisStan.sys, v);
    duzy = `${wpisStan.sys}/${v}`;
  } else {
    d.pomiary[wpisStan.typ].push({ t: Date.now(), v });
    ocena = { spo2: ocenSpo2, puls: ocenPuls, waga: ocenWage }[wpisStan.typ](v);
    duzy = wpisStan.typ === "spo2" ? `${v}%` : (wpisStan.typ === "waga" ? `${v} kg` : `${v}`);
  }
  zapiszDane();
  wpisStan = null;
  const pole = document.getElementById("wynik-pole");
  pole.className = "wynik " + ocena.poziom;
  document.getElementById("wynik-duzy").textContent =
    (ocena.poziom === "ok" ? "🟢 " : ocena.poziom === "uwaga" ? "🟡 " : "🔴 ") + duzy;
  document.getElementById("wynik-zdanie").textContent = ocena.zdanie;
  document.getElementById("wynik-czytaj").onclick = () => mow(ocena.zdanie, true);
  pokaz("ekran-wynik");
  mow(ocena.zdanie);
}

/* ---------- wykresy ---------- */

function wykresSvg(punkty, opcje) {
  if (punkty.length < 2) {
    return `<p class="opis">Za mało pomiarów, żeby narysować wykres — potrzeba przynajmniej dwóch.</p>`;
  }
  const W = 640, H = 240, m = 40;
  const wart = punkty.map(p => p.v);
  let min = Math.min(...wart), max = Math.max(...wart);
  if (min === max) { min -= 1; max += 1; }
  const zakres = max - min;
  min -= zakres * 0.15; max += zakres * 0.15;
  const x = i => m + (i / (punkty.length - 1)) * (W - 2 * m);
  const y = v => H - m - ((v - min) / (max - min)) * (H - 2 * m);
  const linia = punkty.map((p, i) => `${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const kropki = punkty.map((p, i) =>
    `<circle class="punkt" cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="6"></circle>`).join("");
  const p0 = new Date(punkty[0].t), p1 = new Date(punkty[punkty.length - 1].t);
  const data = d => `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `<svg viewBox="0 0 ${W} ${H}">
    <line class="os" x1="${m}" y1="${H - m}" x2="${W - m}" y2="${H - m}"></line>
    <text x="${m}" y="${H - 8}">${data(p0)}</text>
    <text x="${W - m - 40}" y="${H - 8}">${data(p1)}</text>
    <text x="4" y="${y(Math.max(...wart)) + 5}">${Math.max(...wart)}</text>
    <text x="4" y="${y(Math.min(...wart)) + 5}">${Math.min(...wart)}</text>
    <polyline class="linia" points="${linia}"></polyline>
    ${kropki}
  </svg>`;
}

function blokWykresow() {
  const spo2 = historiaPomiarow("spo2", 30);
  const waga = historiaPomiarow("waga", 30);
  const puls = historiaPomiarow("puls", 30);
  const cis = historiaPomiarow("cisnienie", 30).map(p => ({ t: p.t, v: p.sys }));
  return `
    <div class="karta wykres-karta"><h3>🫁 Tlen (%)</h3>${wykresSvg(spo2)}</div>
    <div class="karta wykres-karta"><h3>⚖️ Waga (kg)</h3>${wykresSvg(waga)}</div>
    <div class="karta wykres-karta"><h3>❤️ Puls</h3>${wykresSvg(puls)}</div>
    <div class="karta wykres-karta"><h3>🩺 Ciśnienie górne</h3>${wykresSvg(cis)}</div>`;
}

function rysujWykresy() {
  document.getElementById("wykresy-tresc").innerHTML = blokWykresow();
}

/* ---------- dieta ---------- */

function rysujDiete() {
  const dziś = jadlospisDnia(dzienCyklu());
  const zjedzone = dzien().posilki;
  const el = document.getElementById("dieta-posilki");
  el.innerHTML = Object.entries(dziś).map(([klucz, p]) => `
    <div class="karta ${zjedzone[klucz] ? "ok zrobione" : ""}">
      <div class="posilek-naglowek">${NAZWY_POSILKOW[klucz]}</div>
      <div class="posilek-nazwa">${p.nazwa}</div>
      <ol class="posilek-kroki">${p.kroki.map(k => `<li>${k}</li>`).join("")}</ol>
      <div class="zamiennik">🔄 Nie masz ochoty? ${p.zamiennik}</div>
      ${zjedzone[klucz]
        ? `<p class="opis" style="margin-top:8px">✓ Zjedzone</p>`
        : `<button class="przycisk maly zielony" data-posilek="${klucz}" style="margin-top:10px">✓ ZJADŁEM</button>`}
    </div>`).join("");
  el.querySelectorAll("[data-posilek]").forEach(b => b.addEventListener("click", () => {
    dzien().posilki[b.dataset.posilek] = true;
    zapiszDane();
    rysujDiete();
  }));

  const woda = document.getElementById("woda-rzad");
  const ile = dzien().woda;
  woda.innerHTML = Array.from({ length: 8 }, (_, i) =>
    `<button class="szklanka ${i < ile ? "pelna" : ""}" data-szklanka="${i + 1}">🥛</button>`).join("");
  woda.querySelectorAll("[data-szklanka]").forEach(b => b.addEventListener("click", () => {
    const n = Number(b.dataset.szklanka);
    dzien().woda = (dzien().woda === n) ? n - 1 : n;
    zapiszDane();
    rysujDiete();
  }));

  document.querySelectorAll("#apetyt-rzad .wybor").forEach(b => {
    b.classList.toggle("wybrany", dzien().apetyt === b.dataset.apetyt);
    b.onclick = () => { dzien().apetyt = b.dataset.apetyt; zapiszDane(); rysujDiete(); };
  });

  document.getElementById("dieta-zasady").innerHTML =
    ZASADY_DIETY.map(z => `<p class="opis" style="margin:6px 0">${z}</p>`).join("");
}

/* ---------- dziennik ---------- */

function rysujDziennik() {
  const zapis = dzien().dziennik || {};
  document.querySelectorAll("#ekran-dziennik .wybor-rzad").forEach(rzad => {
    const pytanie = rzad.dataset.pytanie;
    rzad.querySelectorAll(".wybor").forEach(b => {
      b.classList.toggle("wybrany", String(zapis[pytanie]) === b.dataset.wartosc);
      b.onclick = () => {
        rzad.querySelectorAll(".wybor").forEach(x => x.classList.remove("wybrany"));
        b.classList.add("wybrany");
      };
    });
  });
}

function zapiszDziennik() {
  const zapis = {};
  let komplet = true;
  document.querySelectorAll("#ekran-dziennik .wybor-rzad").forEach(rzad => {
    const wybrany = rzad.querySelector(".wybor.wybrany");
    if (!wybrany) { komplet = false; return; }
    const v = wybrany.dataset.wartosc;
    zapis[rzad.dataset.pytanie] = (v === "tak" || v === "nie") ? v === "tak" : Number(v);
  });
  if (!komplet) {
    pokazBaner("Odpowiedz na wszystkie trzy pytania — wystarczy dotknąć buźki.", "blad");
    setTimeout(schowajBaner, 4000);
    return;
  }
  dzien().dziennik = zapis;
  zapiszDane();
  mow("Zapisane. Dziękuję. Dobrej nocy!");
  pokaz("ekran-dzis");
}

/* ---------- raport ---------- */

function rysujRaport() {
  const s = statystykiRaportu(30);
  const smutneOddech = s.samopoczucie.filter(x => x.oddech === 3).length;
  const obrzeki = s.samopoczucie.filter(x => x.obrzeki).length;
  const slabyApetyt = s.apetyty.filter(a => a === "brak").length;
  const wiersz = (a, b) => `<div class="raport-wiersz"><span>${a}</span><strong>${b}</strong></div>`;
  document.getElementById("raport-tresc").innerHTML = `
    <div class="karta">
      <h3>Ostatnie 30 dni${DANE.ustawienia.imie ? " — " + DANE.ustawienia.imie : ""}</h3>
      ${wiersz("Leki wzięte", s.lekiPlan ? `${s.lekiWziete} z ${s.lekiPlan} (${Math.round(100 * s.lekiWziete / s.lekiPlan)}%)` : "brak leków w aplikacji")}
      ${wiersz("Respirator — średnio dziennie", s.respDni ? formatujMinuty(Math.round(s.respMin / s.respDni)) : "brak zapisów")}
      ${wiersz("Dni z respiratorem", `${s.respDni} z 30`)}
      ${wiersz("Dni z ciężkim oddychaniem", `${smutneOddech}`)}
      ${wiersz("Dni z obrzękami nóg", `${obrzeki}`)}
      ${wiersz("Dni ze słabym apetytem", `${slabyApetyt}`)}
    </div>
    ${blokWykresow()}
    <p class="notka">Raport z aplikacji „Mój Oddech". Dane wpisane samodzielnie — do omówienia z lekarzem.</p>`;
}

/* ---------- ustawienia ---------- */

function rysujUstawienia() {
  const u = DANE.ustawienia;
  document.getElementById("ust-imie").value = u.imie;
  document.getElementById("ust-telefon").value = u.telefonPomoc;
  document.getElementById("ust-cel").value = Math.round(u.celRespiratoraMin / 60);
  document.getElementById("ust-glos").value = u.glos ? "tak" : "nie";
  document.getElementById("ust-spo2-alarm").value = u.progi.spo2.alarm;
  document.getElementById("ust-spo2-uwaga").value = u.progi.spo2.uwaga;
  document.getElementById("ust-puls-wysoko").value = u.progi.puls.wysoko;
  document.getElementById("ust-cis-wysoko").value = u.progi.cisnienieSys.wysoko;
  document.getElementById("ust-waga-przyrost").value = u.progi.przyrostWagiKg3Dni;
  document.getElementById("ust-gh-repo").value = u.github.repo;
  document.getElementById("ust-gh-token").value = u.github.token;
  document.getElementById("backup-status").textContent =
    DANE.ostatniBackup ? `Ostatnia kopia: ${DANE.ostatniBackup}` : "Jeszcze nie było kopii.";
  rysujListeLekow();
}

function rysujListeLekow() {
  const el = document.getElementById("ust-leki-lista");
  el.innerHTML = DANE.ustawienia.leki.map(l => `
    <div class="raport-wiersz"><span>${l.nazwa} — ${l.godziny.join(", ")}</span>
    <button class="przycisk maly czerwony" style="width:auto;min-height:44px;margin:0" data-usun-lek="${l.id}">Usuń</button></div>`).join("")
    || `<p class="opis">Nie ma jeszcze żadnych leków.</p>`;
  el.querySelectorAll("[data-usun-lek]").forEach(b => b.addEventListener("click", () => {
    DANE.ustawienia.leki = DANE.ustawienia.leki.filter(l => l.id !== b.dataset.usunLek);
    zapiszDane();
    rysujListeLekow();
  }));
}

function dodajLek() {
  const nazwa = document.getElementById("ust-lek-nazwa").value.trim();
  const godziny = document.getElementById("ust-lek-godziny").value
    .split(",").map(g => g.trim()).filter(g => /^\d{1,2}:\d{2}$/.test(g))
    .map(g => g.padStart(5, "0"));
  if (!nazwa || !godziny.length) {
    pokazBaner("Wpisz nazwę leku i godziny w formacie 08:00.", "blad");
    setTimeout(schowajBaner, 4000);
    return;
  }
  DANE.ustawienia.leki.push({ id: "l" + Date.now(), nazwa, godziny });
  zapiszDane();
  document.getElementById("ust-lek-nazwa").value = "";
  document.getElementById("ust-lek-godziny").value = "";
  rysujListeLekow();
}

function zapiszUstawienia() {
  const u = DANE.ustawienia;
  u.imie = document.getElementById("ust-imie").value.trim();
  u.telefonPomoc = document.getElementById("ust-telefon").value.trim();
  u.celRespiratoraMin = Math.max(1, Number(document.getElementById("ust-cel").value) || 8) * 60;
  u.glos = document.getElementById("ust-glos").value === "tak";
  u.progi.spo2.alarm = Number(document.getElementById("ust-spo2-alarm").value) || 88;
  u.progi.spo2.uwaga = Number(document.getElementById("ust-spo2-uwaga").value) || 92;
  u.progi.puls.wysoko = Number(document.getElementById("ust-puls-wysoko").value) || 110;
  u.progi.cisnienieSys.wysoko = Number(document.getElementById("ust-cis-wysoko").value) || 160;
  u.progi.przyrostWagiKg3Dni = Number(document.getElementById("ust-waga-przyrost").value) || 2;
  u.github.repo = document.getElementById("ust-gh-repo").value.trim();
  u.github.token = document.getElementById("ust-gh-token").value.trim();
  zapiszDane();
  ustawPomoc();
  pokaz("ekran-dzis");
}

function pobierzEksport() {
  const blob = new Blob([eksportujJson()], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `moj-oddech-${kluczDnia()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ---------- pomoc ---------- */

function ustawPomoc() {
  const tel = DANE.ustawienia.telefonPomoc;
  const a = document.getElementById("pomoc-bliski");
  if (tel) {
    a.style.display = "block";
    a.href = "tel:" + tel;
    a.textContent = "📞 ZADZWOŃ DO BLISKIEJ OSOBY";
  } else {
    a.style.display = "none";
  }
}

/* ---------- start ---------- */

function start() {
  wczytajDane();
  ustawPomoc();

  // nawigacja kaflami i przyciskami z data-cel
  document.querySelectorAll("[data-cel]").forEach(b =>
    b.addEventListener("click", () => pokaz(b.dataset.cel)));
  document.getElementById("przycisk-wstecz").addEventListener("click", () => {
    if (ekranAktywny === "ekran-wpis") pokaz("ekran-pomiary");
    else pokaz("ekran-dzis");
  });
  document.getElementById("przycisk-pomoc").addEventListener("click", () => pokaz("ekran-pomoc"));

  // pomiary
  document.querySelectorAll("[data-pomiar]").forEach(b =>
    b.addEventListener("click", () => zacznijWpis(b.dataset.pomiar)));
  document.querySelectorAll(".klawisz").forEach(b =>
    b.addEventListener("click", () => klawisz(b.textContent)));
  document.getElementById("wpis-ok").addEventListener("click", zatwierdzWpis);

  // respirator
  document.getElementById("respirator-przycisk").addEventListener("click", () => {
    respiratorPrzelacz();
    mow(DANE.respiratorStart ? "Sesja rozpoczęta. Miłego odpoczynku." : "Sesja zakończona. Brawo!");
    rysujRespirator();
  });
  document.getElementById("respirator-czytaj").addEventListener("click", () =>
    mow("Wdech nosem licząc do dwóch. Wydech ustami licząc do czterech, jak przez słomkę. Powtarzaj spokojnie.", true));

  // dziennik i raport
  document.getElementById("dziennik-zapisz").addEventListener("click", zapiszDziennik);
  document.getElementById("raport-drukuj").addEventListener("click", () => window.print());

  // ustawienia — przytrzymanie 3 sekundy
  const ust = document.getElementById("przycisk-ustawienia");
  let trzymanie = null;
  const zacznij = () => { trzymanie = setTimeout(() => pokaz("ekran-ustawienia"), 3000); };
  const przerwij = () => clearTimeout(trzymanie);
  ust.addEventListener("pointerdown", zacznij);
  ust.addEventListener("pointerup", przerwij);
  ust.addEventListener("pointerleave", przerwij);

  document.getElementById("ust-lek-dodaj").addEventListener("click", dodajLek);
  document.getElementById("ust-zapisz").addEventListener("click", zapiszUstawienia);
  document.getElementById("ust-backup-teraz").addEventListener("click", backupTeraz);
  document.getElementById("ust-eksport").addEventListener("click", pobierzEksport);
  document.getElementById("ust-powiadomienia").addEventListener("click", async () => {
    if (!("Notification" in window)) { pokazBaner("Ten telefon nie obsługuje powiadomień w przeglądarce.", "blad"); setTimeout(schowajBaner, 4000); return; }
    const zgoda = await Notification.requestPermission();
    pokazBaner(zgoda === "granted" ? "Powiadomienia włączone ✓" : "Powiadomienia nie zostały włączone.", "info");
    setTimeout(schowajBaner, 4000);
  });

  // service worker (offline)
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  rysujDzis();
  tykniecie();
  setInterval(tykniecie, 15000);
  setInterval(() => { if (ekranAktywny === "ekran-dzis") rysujDzis(); }, 60000);
  backupJesliPora();
  window.addEventListener("online", backupJesliPora);
}

document.addEventListener("DOMContentLoaded", start);
