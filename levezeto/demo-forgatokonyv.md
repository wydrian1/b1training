# Levezetői forgatókönyv – Köszönőfal demó (kb. 3,5 óra)

> A [`wydrian1/b1-demo-koszonofal`](https://github.com/wydrian1/b1-demo-koszonofal) gyakorló repóhoz tartozik, de szándékosan **nincs benne**: a résztvevők gépén az ágens ne lássa az elvárt eredményeket. A fájlhivatkozások (pl. `docs/uzleti-leiras.md`) a gyakorló repón belül értendők.
> A résztvevőknek szóló útmutató: [lab guide](https://wydrian1.github.io/b1training/lab/).

## Cél

A résztvevők saját kezűleg végigvisznek egy kis fejlesztést **spec-driven** módon, Claude Code-dal, és közben élőben látják mindazt, amiről a délelőtti előadás szólt:
kontextus és `CLAUDE.md`, toolok, skillek, az agentic loop (olvas → szerkeszt → futtat → piros → javít), valamint az RBI AI-native SDLC két emberi kapuja.

**Nem cél**, hogy hibátlan alkalmazás készüljön, vagy hogy mindenki befejezze a munkát. Az a cél, hogy a résztvevők megtapasztalják a folyamatot.

## Előkészítés (a workshop előtt)

- [ ] Minden gépen: WSL, `python3 --version` legalább 3.10, `git`, `claude --version`
- [ ] Claude Code beállítva az RBI LLM gatewayre, a modell elérhető (pl. Sonnet 5.5). Próbaüzenet: `claude -p "szia"`
- [ ] A repó klónozható a résztvevők gépéről (hozzáférés, proxy)
- [ ] Levezetőként egy teljes próbafutás előre, időméréssel
- [ ] Tartalék: egy előre elkészült, jóváhagyott `SPEC.md` (ha valaki elakad a spec-lépésnél, attól folytathatja)

## Időbeosztás

| Idő | Lépés | Résztvevő teendője | Mire mutass rá |
|---|---|---|---|
| 0:00 | **Indulás** | `git clone`, `cd`, `claude` | A harness betölti a `CLAUDE.md`-t: ez a „projekt-utasítás” a kontextusban |
| 0:15 | **Az üzleti igény megértése** | Claude-dal összefoglaltatja a `docs/uzleti-leiras.md`-t, végigvezettet egy példát, rákérdez a hiányokra | Claude mint elemzőtárs. Első tool-használat: maga olvassa a fájlokat. A jóváhagyóknak érteniük kell, mit hagynak jóvá |
| 0:30 | **Specifikáció** | `/spec`, válasz a kérdésekre | Skill működés közben: az ágens kérdez, nem találgat |
| 0:55 | **🟡 1. kapu** | `SPEC.md` átnézése, javíttatás, majd **saját kézzel** `Státusz: JÓVÁHAGYVA` | Az ember dönt, az ágens nem hagyhatja jóvá saját magát |
| 1:05 | **Tesztek** | „Írd meg a teszteket az EK-khoz, még implementáció nélkül.” | Minden kritérium ellenőrizhetővé válik. Futtatás → piros |
| 1:25 | ☕ Szünet | | |
| 1:35 | **Építés** | „Implementáld a jóváhagyott spec szerint, amíg minden teszt zöld.” | Az agentic loop élőben: tool-hívások, engedélykérések, piros → javít. A `docs/arculat-ui.md` mint kontextus: ettől lesz igényes a felület |
| 2:50 | **🟡 2. kapu** | `/verify`, `BIZONYITEK.md` elolvasása, kattintós forgatókönyv | Bizonyíték alapján fogadunk el, nem érzésre |
| 3:10 | **Visszatekintés** | Kerekasztal | Lásd a kérdéseket lent |
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

**Specifikáció:**

```text
/spec
```

**Jóváhagyás után, tesztek:**

```text
A SPEC.md jóvá van hagyva. Írd meg a teszteket az összes EK-hoz a tests/ mappába,
implementáció nélkül. Futtasd le őket, és mutasd meg, hogy pirosak.
```

**Építés:**

```text
Implementáld az alkalmazást a jóváhagyott SPEC.md szerint. Haladj EK-ról EK-ra,
minden lépés után futtasd a teszteket, és addig dolgozz, amíg minden zöld nem lesz.
```

**Bizonyíték:**

```text
/verify
```

## Kattintós forgatókönyv (2. kapu)

`python3 app.py`, majd http://localhost:8000

1. Lépj be **Horváth Anna** (Fejlesztési Osztály) néven.
2. Új köszönet: keress rá arra, hogy „adat”, és válaszd ki **Farkas Júliát**. Kategória: 🚀 Gyors segítség, üzenet: „Köszönöm a gyors adatelemzést! 🙏🎉”, láthatóság: **Privát** → ellenőrző nézet → küldés → toast.
3. Küldj Annaként egy második köszönetet **Juhász Nórának** (🤝 Együttműködés), ezúttal **Nyilvános** láthatósággal.
4. Próbáld meg Annaként: saját magadnak küldeni, üres üzenetet küldeni, kategória nélkül küldeni, illetve Júliának ugyanazon a napon egy 4. köszönetet küldeni → egyik sem mehet át, a hiba a mező alatt jelenik meg.
5. Anna „Küldött” listájában ott mindkét üzenet, kategória-chippel és láthatóság-ikonnal.
6. Lépj be **Varga Bence** (nem vezető) néven: a **falon** ott a nyilvános (Nórának szóló) köszönet, a privát (Júliának szóló) nincs. Tapsolj 👏 a nyilvánosra, majd kattints újra → a taps visszavonódik. A vezetői nézet nem érhető el.
7. Lépj be **Farkas Júliaként**: van értesítés, és a „Kapott” listában ott a privát üzenet.
8. Lépj be **Szabó Katalinként** (Júlia vezetője): van értesítés, a vezetői nézetben látszik a privát üzenet, és a statisztikában is megjelenik (kapott: 1, 🚀 Gyors segítség).
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
| – (új a demóban) | Kategóriák, privát / nyilvános láthatóság és közös fal, 👏 reakció, napi 3-as korlát |
| Képfeltöltés, vírusellenőrzés | Kimarad (változáskérés-ötlet) |
| E-mail / Teams értesítés | Alkalmazáson belüli értesítés |
| Közvetlen és B-1 vezető értesítése | Megmarad. A B-1 pozíció (főosztályvezető), a JSON `szint` mezőjéből |
| Vezetői nézet felelősségi kör szerint | Megmarad (a demó szíve) |
| Statisztikák | Megmarad, egyszerűsítve: 4 mutató, kategória-megoszlás, top 3 a vezető körére |
| Admin, moderáció, riport | Kimarad |
| Naplózás, megőrzés, DPIA | Kimarad (beszélgetési téma: élesben ez kötelező) |
| Arculat, reszponzivitás, WCAG | `docs/arculat-ui.md`: Raiffeisen tokenek, kártyás felület, 3 lépéses varázsló, mobil tab-sáv, alap akadálymentesség |
| Szerveres üzemeltetés, CI/CD | Helyben fut: `python3 app.py` |
