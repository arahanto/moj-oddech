/* ===== Mój Oddech — jadłospis rotacyjny 28 dni =====
   Zasady doboru potraw:
   - mało soli (nie dosalamy; bez wędlin, kiszonek, słonych serów)
   - lekkostrawnie (bez smażenia na głębokim tłuszczu, bez kapusty i strączków — wzdymają, a to utrudnia oddychanie)
   - małe porcje, 5 posiłków dziennie — jedzenie przy duszności mniej męczy
   - dość białka i kalorii (twaróg, jajka, drób, ryby, nabiał)
   To propozycja ogólna — potwierdź ją z lekarzem lub dietetykiem. */

const JADLOSPIS = {

  sniadania: [
    { nazwa: "Owsianka na mleku z jabłkiem i cynamonem",
      kroki: ["Zagotuj szklankę mleka", "Wsyp 3 łyżki płatków owsianych, gotuj 5 minut", "Zetrzyj pół jabłka, dodaj szczyptę cynamonu"],
      zamiennik: "Owsianka z bananem zamiast jabłka" },
    { nazwa: "Jajecznica na parze ze szczypiorkiem i pieczywo",
      kroki: ["Roztrzep 2 jajka z łyżką mleka", "Ścinaj na małym ogniu, mieszając — bez przypalania", "Posyp szczypiorkiem, zjedz z kromką pszennego chleba z masłem"],
      zamiennik: "Jajko na miękko z pieczywem" },
    { nazwa: "Twarożek z miodem i brzoskwinią",
      kroki: ["Rozgnieć pół kostki twarogu z 2 łyżkami jogurtu", "Dodaj łyżeczkę miodu", "Pokrój brzoskwinię (może być z puszki, odsączona)"],
      zamiennik: "Twarożek z rzodkiewką i szczypiorkiem (bez soli)" },
    { nazwa: "Kasza manna na mleku z musem malinowym",
      kroki: ["Zagotuj szklankę mleka", "Wsyp 2,5 łyżki kaszy manny, mieszaj 3 minuty", "Rozgnieć garść malin (mogą być mrożone, rozmrożone) i polej kaszę"],
      zamiennik: "Kasza manna z łyżeczką dżemu niskosłodzonego" },
    { nazwa: "Omlet biszkoptowy z dżemem",
      kroki: ["Ubij 2 jajka z łyżką mąki", "Wylej na patelnię z odrobiną masła, przykryj, smaż na małym ogniu", "Posmaruj cienko dżemem i złóż na pół"],
      zamiennik: "Naleśnik na mleku z serkiem waniliowym" },
    { nazwa: "Kanapki z pastą jajeczną i pomidorem",
      kroki: ["Ugotuj jajko na twardo, rozgnieć widelcem", "Wymieszaj z łyżeczką jogurtu i koperkiem", "Posmaruj 2 kromki pszennego chleba, dodaj plastry pomidora bez skórki"],
      zamiennik: "Kanapki z twarożkiem i ogórkiem (świeżym, nie kiszonym)" },
    { nazwa: "Jogurt naturalny z płatkami i bananem",
      kroki: ["Do miseczki wlej duży jogurt naturalny", "Dodaj 2 łyżki płatków owsianych błyskawicznych", "Pokrój banana, wymieszaj, odczekaj 5 minut aż płatki zmiękną"],
      zamiennik: "Kefir z biszkoptami" },
    { nazwa: "Ryż na mleku z jabłkiem prażonym",
      kroki: ["Ugotuj pół szklanki ryżu w mleku z wodą pół na pół", "Jabłko pokrój i podgrzej chwilę na patelni z odrobiną masła", "Połącz, dodaj szczyptę cynamonu"],
      zamiennik: "Ryż na mleku z gruszką" }
  ],

  drugieSniadania: [
    { nazwa: "Banan i kilka biszkoptów",
      kroki: ["Obierz banana", "Zjedz z 3–4 biszkoptami"],
      zamiennik: "Jabłko pieczone z łyżeczką miodu" },
    { nazwa: "Kisiel owocowy z herbatnikami",
      kroki: ["Przygotuj kisiel według opisu na opakowaniu", "Ostudź do letniego", "Zjedz z 2 herbatnikami"],
      zamiennik: "Budyń waniliowy" },
    { nazwa: "Serek homogenizowany z owocem",
      kroki: ["Otwórz serek waniliowy", "Dodaj kilka malin lub pokrojoną brzoskwinię"],
      zamiennik: "Jogurt owocowy" },
    { nazwa: "Kromka chałki z masłem i herbata",
      kroki: ["Posmaruj cienko kromkę chałki masłem", "Zaparz słabą herbatę"],
      zamiennik: "Sucharki z dżemem" },
    { nazwa: "Koktajl mleczno-owocowy",
      kroki: ["Zmiksuj szklankę mleka lub kefiru z bananem", "Możesz dodać łyżeczkę miodu", "Pij powoli, małymi łykami"],
      zamiennik: "Maślanka z łyżką musu truskawkowego" },
    { nazwa: "Pieczone jabłko z miodem",
      kroki: ["Wydrąż gniazdo z jabłka", "Włóż łyżeczkę miodu", "Piecz 20 minut w 180°C lub 3 minuty w mikrofali"],
      zamiennik: "Mus jabłkowy ze słoiczka" },
    { nazwa: "Galaretka z owocami",
      kroki: ["Przygotuj galaretkę dzień wcześniej według opakowania", "Dodaj do niej owoce z kompotu", "Zjedz schłodzoną"],
      zamiennik: "Kisiel z jabłkiem" }
  ],

  obiady: [
    { nazwa: "Pierś z kurczaka gotowana, ziemniaki puree i marchewka",
      kroki: ["Ugotuj kawałek piersi w wodzie z natką i marchewką (bez soli — dodaj zioła: lubczyk, pietruszkę)", "Ugotuj 2 ziemniaki, rozgnieć z mlekiem", "Marchewkę z gotowania podaj obok, skrop masłem"],
      zamiennik: "Kurczak pieczony w folii z tymiankiem" },
    { nazwa: "Pulpety cielęce w sosie koperkowym z ryżem",
      kroki: ["Zmiel lub kup mięso mielone cielęce/drobiowe, wymieszaj z jajkiem i bułką tartą", "Uformuj małe kulki, gotuj 20 minut w wodzie z włoszczyzną", "Zrób sos: jogurt + koperek + łyżka wywaru; podaj z ryżem"],
      zamiennik: "Pulpety w sosie pomidorowym (przecier bez soli)" },
    { nazwa: "Dorsz pieczony z ziemniakami i surówką z marchewki",
      kroki: ["Filet dorsza skrop cytryną, posyp koperkiem", "Zawiń w folię, piecz 20 minut w 180°C", "Podaj z ziemniakami i startą marchewką z jabłkiem"],
      zamiennik: "Mintaj lub morszczuk przygotowany tak samo" },
    { nazwa: "Zupa krem z dyni z grzankami",
      kroki: ["Ugotuj kawałki dyni z marchewką i ziemniakiem w wodzie", "Zmiksuj, dodaj łyżkę śmietanki 12%", "Podaj z grzankami z pszennego chleba (podpieczonymi bez tłuszczu)"],
      zamiennik: "Krem z marchewki z imbirem (odrobina)" },
    { nazwa: "Risotto z kurczakiem i cukinią",
      kroki: ["Podsmaż krótko na maśle drobno pokrojoną pierś kurczaka", "Dodaj pół szklanki ryżu i 2 szklanki wody, gotuj mieszając", "Pod koniec dodaj startą cukinię i łyżkę parmezanu (mało — jest słony)"],
      zamiennik: "Ryż z duszoną cukinią i jajkiem sadzonym" },
    { nazwa: "Zupa jarzynowa z lanymi kluskami",
      kroki: ["Ugotuj wywar z włoszczyzny (bez kostki rosołowej — sól!)", "Dodaj pokrojone ziemniaki i marchewkę", "Rozmieszaj jajko z mąką i wlewaj cienkim strumieniem na wrzątek"],
      zamiennik: "Zupa jarzynowa z ryżem" },
    { nazwa: "Indyk duszony z jabłkiem, kasza jaglana",
      kroki: ["Kawałki piersi indyka duś pod przykryciem z odrobiną wody", "Dodaj pokrojone jabłko i majeranek, duś do miękkości", "Podaj z ugotowaną kaszą jaglaną"],
      zamiennik: "Indyk duszony z marchewką i ziemniakami" },
    { nazwa: "Makaron z twarogiem i truskawkami",
      kroki: ["Ugotuj porcję makaronu (świderki lub nitki)", "Rozgnieć twaróg z łyżką jogurtu i łyżeczką cukru", "Wymieszaj z makaronem, dodaj truskawki (mogą być mrożone, podgrzane)"],
      zamiennik: "Makaron z serem i musem jabłkowym" },
    { nazwa: "Rosół drobiowy z makaronem (bez kostki!)",
      kroki: ["Gotuj porcję kurczaka z włoszczyzną 1,5 godziny na małym ogniu", "Nie dodawaj soli ani kostki — smak dają warzywa, lubczyk i natka", "Podaj z cienkim makaronem i marchewką z wywaru"],
      zamiennik: "Rosół z lanymi kluskami" },
    { nazwa: "Kotlet mielony z piekarnika, buraczki, ziemniaki",
      kroki: ["Mięso mielone drobiowe wymieszaj z jajkiem, bułką namoczoną w mleku i majerankiem", "Uformuj kotlety, piecz 25 minut w 180°C (bez smażenia)", "Podaj z gotowanymi buraczkami startymi z jabłkiem i ziemniakami"],
      zamiennik: "Pieczeń rzymska z indyka" },
    { nazwa: "Łosoś pieczony z koperkiem i puree",
      kroki: ["Kawałek łososia skrop cytryną, posyp koperkiem", "Piecz w folii 15–18 minut w 180°C", "Podaj z puree ziemniaczanym i gotowaną fasolką szparagową (miękką)"],
      zamiennik: "Pstrąg pieczony w folii" },
    { nazwa: "Zupa pomidorowa z ryżem (z przecieru)",
      kroki: ["Zrób lekki wywar z włoszczyzny", "Dodaj przecier pomidorowy bez soli (pół szklanki) i łyżkę śmietanki", "Podaj z ugotowanym ryżem i natką"],
      zamiennik: "Pomidorowa z drobnym makaronem" },
    { nazwa: "Kluski śląskie z sosem pieczeniowym łagodnym i marchewką",
      kroki: ["Ugotuj ziemniaki, rozgnieć, wymieszaj z mąką ziemniaczaną i jajkiem", "Uformuj kluski, ugotuj w wodzie", "Podaj z łagodnym sosem (wywar + śmietanka) i marchewką z groszkiem (mało groszku)"],
      zamiennik: "Kopytka z masłem i bułką tartą" },
    { nazwa: "Zapiekanka ziemniaczana z kurczakiem i cukinią",
      kroki: ["Ułóż w naczyniu plastry ugotowanych ziemniaków, kawałki gotowanego kurczaka i cukinii", "Zalej jajkiem roztrzepanym z mlekiem, posyp ziołami", "Zapiekaj 25 minut w 180°C"],
      zamiennik: "Zapiekanka makaronowa z warzywami" }
  ],

  podwieczorki: [
    { nazwa: "Kompot z jabłek i herbatnik",
      kroki: ["Zagotuj pokrojone jabłko w 2 szklankach wody z goździkiem", "Ostudź", "Wypij szklankę z herbatnikiem"],
      zamiennik: "Kompot z gruszek" },
    { nazwa: "Budyń waniliowy",
      kroki: ["Przygotuj budyń na mleku według opakowania", "Zjedz letni, posypany odrobiną cynamonu"],
      zamiennik: "Budyń czekoladowy" },
    { nazwa: "Pół banana z jogurtem",
      kroki: ["Pokrój pół banana", "Zalej 3 łyżkami jogurtu naturalnego z łyżeczką miodu"],
      zamiennik: "Brzoskwinia z serkiem" },
    { nazwa: "Mus owocowy i sucharek",
      kroki: ["Otwórz mus jabłkowy lub wieloowocowy (słoiczek/saszetka)", "Zjedz z sucharkiem"],
      zamiennik: "Przetarte maliny z biszkoptem" },
    { nazwa: "Ciasto drożdżowe domowe (mały kawałek) i słaba herbata",
      kroki: ["Mały kawałek ciasta drożdżowego lub babki", "Słaba herbata bez cukru lub z łyżeczką miodu"],
      zamiennik: "2 herbatniki maślane" },
    { nazwa: "Koktajl kefirowy z truskawkami",
      kroki: ["Zmiksuj szklankę kefiru z garścią truskawek", "Dodaj łyżeczkę miodu, pij powoli"],
      zamiennik: "Jogurt pitny naturalny" },
    { nazwa: "Gruszka gotowana z odrobiną wanilii",
      kroki: ["Obierz gruszkę, przekrój na pół", "Gotuj 10 minut w wodzie z cukrem waniliowym", "Zjedz ciepłą lub zimną"],
      zamiennik: "Jabłko pieczone" }
  ],

  kolacje: [
    { nazwa: "Kanapki z twarożkiem i ogórkiem, mleko",
      kroki: ["Rozgnieć twaróg z jogurtem i koperkiem (bez soli)", "Posmaruj 1–2 kromki pszennego chleba", "Dodaj plasterki świeżego ogórka; wypij pół szklanki ciepłego mleka"],
      zamiennik: "Kanapki z pastą z gotowanej marchewki i jajka" },
    { nazwa: "Zupa mleczna z drobnym makaronem",
      kroki: ["Zagotuj szklankę mleka z odrobiną wody", "Dodaj garść drobnego makaronu (gwiazdki, zacierka)", "Gotuj 5 minut, dosłódź łyżeczką miodu jeśli chcesz"],
      zamiennik: "Zupa mleczna z płatkami jęczmiennymi" },
    { nazwa: "Jajko na miękko z pieczywem i masłem",
      kroki: ["Gotuj jajko 4 minuty od wrzenia", "Podaj z kromką chleba z masłem", "Dodaj kilka plasterków pomidora bez skórki"],
      zamiennik: "Jajko w koszulce na grzance" },
    { nazwa: "Serek wiejski z pieczywem chrupkim",
      kroki: ["Otwórz serek wiejski (wybieraj wersję o obniżonej soli)", "Zjedz z 2 kromkami pieczywa chrupkiego", "Dodaj pokrojonego pomidora lub ogórka"],
      zamiennik: "Twarożek ze szczypiorkiem" },
    { nazwa: "Grzanki z serem żółtym łagodnym i herbata z melisy",
      kroki: ["Na kromkę chleba połóż plasterek łagodnego sera (mało — ser jest słony)", "Zapiecz chwilę w piekarniku lub na suchej patelni pod przykryciem", "Zaparz herbatę z melisy — pomaga się wyciszyć przed snem"],
      zamiennik: "Grzanka z pastą jajeczną" },
    { nazwa: "Kasza manna gęsta z masłem i cukrem waniliowym",
      kroki: ["Ugotuj gęstą kaszę mannę na mleku", "Dodaj pół łyżeczki masła i szczyptę cukru waniliowego"],
      zamiennik: "Ryż na mleku (mała porcja)" },
    { nazwa: "Sałatka z gotowanych warzyw z jajkiem (bez majonezu)",
      kroki: ["Pokrój ugotowaną marchewkę, pietruszkę i ziemniaka w kostkę", "Dodaj posiekane jajko na twardo", "Wymieszaj z 2 łyżkami jogurtu naturalnego i koperkiem"],
      zamiennik: "Pasta warzywno-jajeczna na pieczywie" },
    { nazwa: "Naleśnik z serkiem waniliowym (1 sztuka)",
      kroki: ["Usmaż cienki naleśnik na suchej patelni z odrobiną masła", "Posmaruj serkiem waniliowym lub twarożkiem z miodem", "Zwiń i zjedz z herbatą"],
      zamiennik: "Racuszek z jabłkiem pieczony na małym ogniu" }
  ]
};

/* Zasady dnia — pokazywane w module diety */
const ZASADY_DIETY = [
  "🧂 Nie dosalaj. Smak dają zioła: koperek, majeranek, lubczyk, natka.",
  "🍽️ Jedz 5 małych porcji zamiast 3 dużych — mniej męczy przy oddychaniu.",
  "🥚 W każdym dniu ma być białko: jajko, twaróg, drób, ryba lub nabiał.",
  "💧 Płyny pij według zaleceń lekarza — zapisuj szklanki w aplikacji.",
  "🚫 Unikaj: wędlin, kiszonek, słonych serów, kapusty, fasoli, smażenia.",
  "🕕 Kolacja lekka, 2–3 godziny przed snem — łatwiej o spokojny oddech."
];

/* Który dzień 28-dniowego cyklu jest dzisiaj (0–27) */
function dzienCyklu(data) {
  const start = new Date(2026, 0, 5); // stały poniedziałek startowy
  const d = data || new Date();
  const dni = Math.floor((d - start) / 86400000);
  return ((dni % 28) + 28) % 28;
}

/* Jadłospis na dany dzień cyklu — przesunięte moduły dają różne zestawienia przez 28 dni */
function jadlospisDnia(dzien) {
  const J = JADLOSPIS;
  return {
    sniadanie:       J.sniadania[dzien % J.sniadania.length],
    drugieSniadanie: J.drugieSniadania[dzien % J.drugieSniadania.length],
    obiad:           J.obiady[dzien % J.obiady.length],
    podwieczorek:    J.podwieczorki[(dzien + 3) % J.podwieczorki.length],
    kolacja:         J.kolacje[(dzien + 5) % J.kolacje.length]
  };
}

const NAZWY_POSILKOW = {
  sniadanie: "Śniadanie",
  drugieSniadanie: "II śniadanie",
  obiad: "Obiad",
  podwieczorek: "Podwieczorek",
  kolacja: "Kolacja"
};
