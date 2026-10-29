# AI alapok B-1 vezetőknek

Kétórás, magyar nyelvű bevezető előadás az LLM-ekről, a kontextusról, a toolokról és skillekről, a harnessről és az ágensekről (agentic loop).

Statikus HTML, build és külső függőség nélkül: `index.html` + `style.css` + `app.js`.

A délutáni gyakorlat útmutatója: [`lab/`](lab/), élőben: https://wydrian1.github.io/b1training/lab/

## Vezérlés

| Billentyű | Funkció |
|---|---|
| → / Space / PgDn | következő lépés vagy dia |
| ← / PgUp | előző lépés vagy dia |
| S | előadói jegyzet + időmérő |
| M | tartalomjegyzék |
| F | teljes képernyő |
| T | világos / sötét téma (a jobb felső gombbal is) |
| Home / End | első / utolsó dia |

- `#12`: közvetlen ugrás a 12. diára
- `?all`: minden fokozatosan megjelenő elem eleve látszik (áttekintéshez, nyomtatáshoz)
- `?theme=light` / `?theme=dark`: téma kényszerítése (alapból a rendszerbeállítást vagy a legutóbbi választást követi)

## Arculat

Raiffeisen színpaletta (RBI Primary Yellow `#FEE600`, Off Black `#2B2D33`, Warm Grey, másodlagos zöld/korall/lila), a hivatalos RBI RGB palettából. Betűtípus: Amalia, ha telepítve van; egyébként rendszerbetű.

## Helyi futtatás

```bash
python3 -m http.server 8000
```

Utána: http://localhost:8000

## Közzététel

GitHub → Settings → Pages → Source: *Deploy from a branch*, Branch: `main`, mappa: `/ (root)`.
