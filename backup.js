/* ===== Mój Oddech — codzienna kopia zapasowa dane.json do prywatnego repo GitHub =====
   Wysyłamy przez GitHub API (zwykłe zapytanie HTTPS) — bez gita na telefonie.
   Konfiguracja w ustawieniach: repo "uzytkownik/nazwa-repo" + token fine-grained
   z uprawnieniem Contents: Read and write TYLKO do tego repo. */

const BACKUP_PLIK = "dane.json";

async function backupJesliPora() {
  const g = DANE.ustawienia.github;
  if (!g.repo || !g.token) return;
  if (DANE.ostatniBackup === kluczDnia()) return; // dziś już było
  if (!navigator.onLine) return;
  try {
    await wyslijBackup();
    DANE.ostatniBackup = kluczDnia();
    zapiszDane();
    const el = document.getElementById("backup-status");
    if (el) el.textContent = "Ostatnia kopia: dziś ✓";
  } catch (e) {
    console.log("[backup] nie udało się:", e.message);
  }
}

async function wyslijBackup() {
  const g = DANE.ustawienia.github;
  const url = `https://api.github.com/repos/${g.repo}/contents/${BACKUP_PLIK}`;
  const naglowki = {
    "Authorization": `Bearer ${g.token}`,
    "Accept": "application/vnd.github+json"
  };

  // GitHub wymaga "sha" poprzedniej wersji pliku przy nadpisywaniu
  let sha = null;
  const odp = await fetch(url, { headers: naglowki });
  if (odp.ok) sha = (await odp.json()).sha;
  else if (odp.status !== 404) throw new Error(`GitHub ${odp.status}`);

  const tresc = btoa(unescape(encodeURIComponent(eksportujJson())));
  const cialo = {
    message: `Kopia danych ${kluczDnia()}`,
    content: tresc
  };
  if (sha) cialo.sha = sha;

  const zapis = await fetch(url, {
    method: "PUT",
    headers: naglowki,
    body: JSON.stringify(cialo)
  });
  if (!zapis.ok) throw new Error(`GitHub zapis ${zapis.status}`);
}

/* Test z ustawień: wymusza wysyłkę i pokazuje wynik */
async function backupTeraz() {
  const el = document.getElementById("backup-status");
  const g = DANE.ustawienia.github;
  if (!g.repo || !g.token) { if (el) el.textContent = "Najpierw wpisz repo i token."; return; }
  if (el) el.textContent = "Wysyłam…";
  try {
    await wyslijBackup();
    DANE.ostatniBackup = kluczDnia();
    zapiszDane();
    if (el) el.textContent = "Kopia wysłana ✓";
  } catch (e) {
    if (el) el.textContent = "Błąd: " + e.message + " (sprawdź repo/token/internet)";
  }
}
