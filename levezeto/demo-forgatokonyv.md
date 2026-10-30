# Levezetői forgatókönyv – Kudos demó (kb. 3 óra 45 perc)

> A [`wydrian1/b1-demo-kudos`](https://github.com/wydrian1/b1-demo-kudos) gyakorló repóhoz tartozik, de szándékosan **nincs benne**: a résztvevők gépén az ágens ne lássa az elvárt eredményeket. A fájlhivatkozások (pl. `docs/uzleti-leiras.md`) a gyakorló repón belül értendők.
> A résztvevőknek szóló útmutató: [lab guide](https://wydrian1.github.io/b1training/lab/).

## Cél

A résztvevők saját kezűleg végigvisznek egy kis fejlesztést **spec-driven** módon, Claude Code-dal, és közben élőben látják mindazt, amiről a délelőtti előadás szólt:
kontextus és `CLAUDE.md`, toolok, skillek, az agentic loop (olvas → szerkeszt → futtat → piros → javít), valamint az RBI AI-native SDLC két emberi kapuja.

**Nem cél**, hogy hibátlan alkalmazás készüljön, vagy hogy mindenki befejezze a munkát. Az a cél, hogy a résztvevők megtapasztalják a folyamatot.

## Előkészítés (a workshop előtt)

- [ ] Minden gépen: WSL, `python3 --version` legalább 3.10, `git`, `claude --version`
- [ ] Claude Code beállítva az RBI LLM gatewayre, a modell elérhető (pl. Sonnet 5.5). Próbaüzenet: `claude -p "szia"`
- [ ] A repó klónozható a résztvevők gépéről (hozzáférés, proxy)
- [ ] **`bash scripts/setup-e2e.sh` lefut minden gépen** (pip csomag, kb. 150 MB-os Chromium-letöltés, `sudo` a rendszerkönyvtárakhoz). Ha a proxy vagy a tűzfal megfogja, előre kell megoldani (proxy-beállítás vagy belső tükör), mert a workshopon ez viszi el a legtöbb időt. A végén ✅-et kell kiírnia.
- [ ] Windows 11 + WSLg esetén a `HEADED=1` mód külön ablakot nyit: érdemes egyszer kipróbálni, jó demóeszköz a kivetítőn (a lab guide-ban ez a „+7” opcionális feladat)
- [ ] Ellenőrizd, hogy a résztvevő gépeken nincs-e bekapcsolva az `rbi-sdlc-fundamentals` plugin (RBI Getting Started Kit). Ha igen, a labhoz kapcsolják ki (`/plugin`), különben Claude a szabad szöveges kérésekre a plugin `specify-task` / `start-prd` skilljét választhatja a projekt `/spec`-je helyett
- [ ] Levezetőként egy teljes próbafutás előre, időméréssel
- [ ] Tartalék: egy előre elkészült, jóváhagyott `SPEC.md` (ha valaki elakad a spec-lépésnél, attól folytathatja)

## Időbeosztás

| Idő | Lépés | Résztvevő teendője | Mire mutass rá |
|---|---|---|---|
| 0:00 | **Indulás** | `git clone`, `cd`, `bash scripts/setup-e2e.sh`, `claude` | A harness betölti a `CLAUDE.md`-t: ez a „projekt-utasítás” a kontextusban |
| 0:15 | **Az üzleti igény megértése** | Claude-dal összefoglaltatja a `docs/uzleti-leiras.md`-t, végigvezettet egy példát, rákérdez a hiányokra | Claude mint elemzőtárs. Első tool-használat: maga olvassa a fájlokat. A jóváhagyóknak érteniük kell, mit hagynak jóvá |
| 0:30 | **Specifikáció** | `/model opus`, `/spec`, válasz a kérdésekre | Skill működés közben: az ágens kérdez, nem találgat. Modellválasztás: a spechez megéri a legerősebb modell |
| 0:55 | **Változáskérés: kategóriák** (kötelező) | `/spec Változáskérés: …` – az 5 kategória helyett a 4 IT-BSO Behavioral Anchor | Az igény változik: a jóváhagyás előtt ez néhány sor a specben, nem kódátírás. A változás végigfut SZ → EK → story → konzisztencia, és bekerül a változásnaplóba. Az üzleti leírás nem változik |
| 1:05 | **🟡 1. kapu** | `SPEC.md` átnézése, javíttatás, majd **saját kézzel** `Státusz: JÓVÁHAGYVA` | Az ember dönt, az ágens nem hagyhatja jóvá saját magát |
| 1:15 | **Első story** | `/model sonnet`, `/build S1` | Story = vertikális szelet. Előbb a tesztek (piros), utána a kód (zöld), majd megállás és böngészős ellenőrzés |
| 1:40 | ☕ Szünet | | |
| 1:50 | **További storyk** | `/build S2`, `/build S3`, … storynként ellenőrizve | Kis körök, az ember minden story után dönt. S1–S4 = MVP, a többi ráadás. Az agentic loop élőben: tool-hívások, engedélykérések, piros → javít. A `docs/arculat-ui.md` mint kontextus: ettől lesz igényes a felület |
| 2:50 | **🟡 2. kapu** | `/verify`, `BIZONYITEK.md` elolvasása, kattintós forgatókönyv, majd **saját kézzel** `Elfogadás: ELFOGADVA` | Bizonyíték alapján fogadunk el, nem érzésre. Az elfogadás is emberi döntés, ugyanúgy, mint a spec jóváhagyása |
| 3:10 | **Dokumentáció** | `/docs` | Az elfogadott változatról, a tényleges kódból: felhasználói útmutató képekkel, technikai leírás, nyomonkövethetőségi mátrix (auditálhatóság) |
| 3:20 | **Visszatekintés** | Kerekasztal | Lásd a kérdéseket lent |
| – | **+ feladatok** (aki hamarabb végez) | Lásd lent és a lab guide-ban | A változás is a specen és a kapun megy át |

## Javasolt promptok lépésenként

**Indulás után** (opcionális bemelegítő):

```text
Foglald össze 5 pontban, milyen szabályok szerint fogsz dolgozni ebben a projektben.
```

Itt látszik, hogy a `CLAUDE.md` bekerült a kontextusba.

**Az üzleti igény megértése:**

```text
Olvasd el a docs/uzleti-leiras.md-t, és foglald össze közérthetően, legfeljebb 10 pontban:
mit építünk, kik a szereplők, és mit láthat, illetve tehet az egyes szereplő.
Még ne írj specifikációt vagy kódot, és ne hozz létre fájlt.
```

```text
Szerinted mi nem egyértelmű vagy hiányzik az üzleti leírásból? Sorolj fel legfeljebb 5 pontot,
mindegyikhez egy javasolt döntéssel. Még ne írj specifikációt.
```

**Specifikáció** (előtte Opusra váltás):

```text
/model opus
/spec
```

**Változáskérés a spec után, még a jóváhagyás előtt** (kötelező):

```text
/spec Változáskérés: a köszönet kategóriái az üzleti leírás 5 kategóriája helyett az IT-BSO négy Behavioral Anchorja legyenek:
💛 Earn customer loyalty – az ügyfélért, az ügyfélelégedettségért tett erőfeszítés
🚀 Take actions to move forward – nem várt, cselekedett: elakadást oldott fel, felvette a leesett feladatot
🤝 Deliver value together – közös munka, együtt teremtett érték az ügyfélnek
🧪 Experiment, learn fast! – kipróbált valami újat, tanult a hibából, jobbá tette a folyamatot
Javítsd az összes érintett szabályt, EK-t és storyt, rögzítsd az eltérést az üzleti leírástól, és vedd fel a változásnaplóba. A docs/uzleti-leiras.md-t ne módosítsd, kódot ne írj.
```

Forrás: [IT-BSO Behavioral Anchor](https://wiki.rbinternational.com/confluence/spaces/PMOHOME/pages/5231576526/IT-BSO+Behavioral+Anchor). A régi kategóriák eltűnése gyorsan ellenőrizhető: `grep -n -E "Gyors segítség|Jó ötlet|Ügyfélfókusz|Kiemelkedő munka|Együttműködés" SPEC.md` (ne adjon találatot). A tartalék `SPEC.md` is már a 4 kategóriával készüljön.

**Jóváhagyás után, storynként** (a `/build` skill előbb a story tesztjeit írja meg, aztán a kódot, és a végén megáll):

```text
/model sonnet
/build S1
```

A build előtt vissza Sonnetre: a jóváhagyott spec alapján bőven elég, gyorsabb és olcsóbb. Jó beszélgetési pont: a feladathoz választunk modellt, nem mindenhez a legerősebbet.

A story végén a skill újraindítja a helyi szervert az új kóddal (`🌐` sor az összefoglalóban), így elég frissíteni a böngészőt. Ellenőrzés a skill által adott lépések szerint, utána `/build S2`, `/build S3`, … A haladás a `HALADAS.md`-ben látszik.

**Bizonyíték:**

```text
/verify
```

**Elfogadás** (a résztvevő futtatja, nem az ágens):

```text
! sed -i 's/^Elfogadás: FÜGGŐBEN/Elfogadás: ELFOGADVA/' BIZONYITEK.md
```

**Dokumentáció** (csak elfogadás után indul):

```text
/docs
```

## Kattintós forgatókönyv (2. kapu)

Az utolsó `/build` a végén újraindítja a helyi szervert, így csak meg kell nyitni a http://localhost:8000 címet (ha mégsem fut: `python3 app.py`).

1. Lépj be **Horváth Anna** (Fejlesztési Osztály) néven.
2. Új köszönet: keress rá arra, hogy „adat”, és válaszd ki **Farkas Júliát**. Kategória: 🚀 Take actions to move forward, üzenet: „Köszönöm a gyors adatelemzést! 🙏🎉”, láthatóság: **Privát** → ellenőrző nézet → küldés → toast.
3. Küldj Annaként egy második köszönetet **Juhász Nórának** (🤝 Deliver value together), ezúttal **Nyilvános** láthatósággal.
4. Próbáld meg Annaként: saját magadnak küldeni, üres üzenetet küldeni, kategória nélkül küldeni, illetve Júliának ugyanazon a napon egy 4. köszönetet küldeni → egyik sem mehet át, a hiba a mező alatt jelenik meg.
5. Anna „Küldött” listájában ott mindkét üzenet, kategória-chippel és láthatóság-ikonnal.
6. Lépj be **Varga Bence** (nem vezető) néven: a **falon** ott a nyilvános (Nórának szóló) köszönet, a privát (Júliának szóló) nincs. Tapsolj 👏 a nyilvánosra, majd kattints újra → a taps visszavonódik. A vezetői nézet nem érhető el.
7. Lépj be **Farkas Júliaként**: van értesítés, és a „Kapott” listában ott a privát üzenet.
8. Lépj be **Szabó Katalinként** (Júlia vezetője): van értesítés, a vezetői nézetben látszik a privát üzenet, és a statisztikában is megjelenik (kapott: 1, 🚀 Take actions to move forward).
9. Lépj be **Kovács Eszterként** (B-1): van értesítés Júlia köszönetéről, és Nóráéról is. A vezetői nézetben mindkét üzenet látszik, a statisztika a teljes körre számol.
10. Lépj be **Nagy Péterként** (Anna vezetője): **nincs** értesítés (nem ő a címzettek vezetője), de a vezetői nézetben **látja** mindkét üzenetet, mert a küldő a beosztottja.
11. Lépj be **Tóth Gáborként** (Nóra vezetője): értesítést kap Nóra köszönetéről, a vezetői nézetben azt látja, de Júliáét **nem**. A statisztikájában Júlia köszönete nem szerepel.

12. Lépj be **Balogh Mátéként**, és küldj köszönetet **Szabó Katalinnak** (osztályvezető, B-2). Utána lépj be **Kovács Eszterként**: erről **pontosan egy** értesítést kapott, pedig közvetlen vezetőként és B-1-ként is érintett.
13. Lépj be **Fehér Lászlóként** (board tag, B): a vezetői nézetben a főosztály összes köszönetét látja, de értesítést egyikről sem kapott, mert egyik címzettnek sem ő a közvetlen vezetője.

A 9–13. lépés a legérdekesebb: itt derül ki, hogy a jogosultsági logika, a szintek kezelése és vele a statisztika tényleg a spec szerint működik-e. A 12. lépés pont az a határeset, amit egy „vezető vezetője” típusú definíció elrontana.

## Változáskérés-ötletek (ha marad idő)

- **Visszavonás:** a küldő 5 percen belül visszavonhatja a köszönetét (az értesítések is eltűnnek).
- **Emoji-gyorsgombok:** 5 gyakori emoji egy kattintással beszúrható.
- **Képfeltöltés:** PNG/JPG, legfeljebb 2 MB. Jó vitatéma, mert ütközik a „Kimarad” résszel: a hatókört is bővíteni kell.

A szabály: előbb `/spec` a kéréssel, a státusz visszaáll `TERVEZET`-re, majd jóváhagyás, és csak utána jöhet a kód.

## A labban → élesben (Getting Started Kit)

A Visszatekintésnél érdemes megmutatni, hogy a lab a [RBI Getting Started Kit](https://code.rbi.tech/raiffeisen/RBI-Getting-Started-Kit) egyszerűsített változata (a lab guide 10. lépésében is ott a táblázat):

| A labban | A Getting Started Kitben |
|---|---|
| `docs/uzleti-leiras.md` | PRD (`start-prd` → `refine-prd`) |
| `/spec` → `SPEC.md` (SZ, EK, storyk) | `plan-prd` → `plan.md` (storyk, BAC-ok), `specify-task` → `spec.md` |
| EK-01… | BAC-1… (Business Acceptance Criteria) |
| 1. kapu: `Státusz: JÓVÁHAGYVA` | solution gate, spec-jóváhagyás |
| `/build S1` | `build-task` (+ `generate-e2e`) |
| +5 sub-agent ellenőr | `review-pr`: 4 reviewer + gap-critic (H3, code review) |
| `/verify` → `BIZONYITEK.md` | `validate-acceptance` → Validation Evidence Pack |
| `/docs` → `dokumentacio/` | – (a labban külön lépés, hogy látható legyen) |
| 2. kapu: elfogadás | H4: PO-jóváhagyás, utána mehet UAT-ra |
| – | `mercury-check`, H5 deploy |
| 4. lépés: változáskérés | `revise-plan` |

A kitben H1 és H2 néven nincs kapu: a lab két kapuja didaktikai egyszerűsítés. A „11 core market” a TechTalk blogból jön, a kit repóban nem szerepel.

## Visszatekintő kérdések

- Hol kellett beavatkoznod? Mit csinált volna rosszul az ágens, ha nincs spec?
- Mennyi időt vitt el a spec, és mennyit spórolt meg később?
- Mit láttál a „háttérben”: milyen toolokat hívott, mikor kért engedélyt?
- Melyik saját területi feladatotokhoz lenne használható ez a folyamat?

## Hibaelhárítás

| Tünet | Teendő |
|---|---|
| `claude` nem éri el a modellt | Gateway-beállítás és proxy ellenőrzése; `claude -p "szia"` |
| Az ágens `pip install`-t akar futtatni | Utasítsd el, és utalj a `CLAUDE.md` technológiai keretére |
| A 8000-es port foglalt | `python3 app.py` helyett a spec szerinti portparaméter, vagy állítsd le a másik folyamatot |
| Valaki elakad a spec-lépésnél | Adj neki tartalék `SPEC.md`-t, és hagyja jóvá ő maga |
| Az ágens körbe-körbe javít | Állítsd meg (Esc), kérdezd meg, mit gondol a hibáról, és szűkítsd a feladatot egy EK-ra |

## Az eredeti igény és a demó megfeleltetése

| Eredeti követelmény | Demóban |
|---|---|
| AD + SSO bejelentkezés | `data/munkatarsak.json` + „Belépés mint…” (DEMO jelzéssel) |
| AD-alapú címzettkereső | Keresés a JSON-ban név, egység vagy e-mail szerint |
| Emoji-támogatás | Unicode emoji a szövegben |
| – (új a demóban) | Kategóriák (a lab változáskérése után a 4 IT-BSO Behavioral Anchor), privát / nyilvános láthatóság és közös fal, 👏 reakció, napi 3-as korlát |
| Képfeltöltés, vírusellenőrzés | Kimarad (változáskérés-ötlet) |
| E-mail / Teams értesítés | Alkalmazáson belüli értesítés |
| Közvetlen és B-1 vezető értesítése | Megmarad. A B-1 pozíció (főosztályvezető), a JSON `szint` mezőjéből |
| Vezetői nézet felelősségi kör szerint | Megmarad (a demó szíve) |
| Statisztikák | Megmarad, egyszerűsítve: 4 mutató, kategória-megoszlás, top 3 a vezető körére |
| Admin, moderáció, riport | Kimarad |
| Naplózás, megőrzés, DPIA | Kimarad (beszélgetési téma: élesben ez kötelező) |
| Arculat, reszponzivitás, WCAG | `docs/arculat-ui.md`: Raiffeisen tokenek, kártyás felület, 3 lépéses varázsló, mobil tab-sáv, alap akadálymentesség |
| Szerveres üzemeltetés, CI/CD | Helyben fut: `python3 app.py` |
