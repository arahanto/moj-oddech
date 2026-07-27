# Mój Oddech — instrukcja

## Instalacja na telefonie (3 kroki)

**Android (Chrome):**
1. Otwórz na telefonie adres: **https://arahanto.github.io/moj-oddech/**
2. Dotknij trzech kropek ⋮ w rogu → **„Dodaj do ekranu głównego"** → Dodaj
3. Od teraz otwieraj aplikację ikoną „Mój Oddech" z ekranu telefonu

**iPhone (Safari):**
1. Otwórz w Safari: **https://arahanto.github.io/moj-oddech/**
2. Dotknij przycisku Udostępnij (kwadrat ze strzałką) → **„Do ekranu początkowego"** → Dodaj
3. Otwieraj ikoną z ekranu. Uwaga: powiadomienia o lekach na iPhone działają
   tylko po takiej instalacji (iOS 16.4 lub nowszy)

Po pierwszym otwarciu aplikacja działa **bez internetu**. Wszystkie dane
zostają na telefonie.

## Pierwsze ustawienie (robi opiekun, raz)

1. Na dole ekranu głównego **przytrzymaj 3 sekundy** napis o ustawieniach ⚙️
2. Wpisz: imię, telefon do bliskiej osoby (przycisk POMOC), godziny leków
3. **Progi alarmów ustal z lekarzem** (od jakiego poziomu tlenu alarmować itd.)
4. Dotknij „🔔 Włącz powiadomienia" i zgódź się w okienku telefonu
5. ZAPISZ ✓

## Kopia zapasowa na GitHub (opcjonalnie, robi opiekun)

1. Na github.com załóż **prywatne** repozytorium, np. `moj-oddech-dane`
2. Wygeneruj token: github.com → Settings → Developer settings →
   **Fine-grained tokens** → Generate new token → wybierz TYLKO to repozytorium
   → Permissions → Contents: **Read and write**
3. W ustawieniach aplikacji wpisz repo (`uzytkownik/moj-oddech-dane`) i token,
   dotknij „Wyślij kopię teraz (test)"
4. Od tej pory raz dziennie aplikacja sama wyśle plik `dane.json` do repo

## Codzienne używanie (osoba chora)

- **💊 Leki** — gdy zabrzmi przypomnienie, weź lek i dotknij „WZIĄŁEM ✓"
- **😮‍💨 Respirator** — kładąc się dotknij „ZACZYNAM", wstając „KOŃCZĘ"
- **📏 Pomiary** — rano waga, w ciągu dnia tlen; aplikacja od razu mówi
  kolorem, czy wszystko w porządku
- **🍽️ Jedzenie** — aplikacja sama pokazuje, co dziś zjeść (5 małych posiłków)
- **🙂 Jak się czuję** — wieczorem trzy dotknięcia
- **📋 Dla lekarza** — na wizycie pokaż ten ekran lekarzowi

## Ważne

Aplikacja **nie zastępuje lekarza**. Jadłospis i progi alarmów to ogólne,
ostrożne propozycje — potwierdź je z lekarzem prowadzącym.
