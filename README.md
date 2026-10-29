# AI alapok B-1 vezetőknek

Kétórás, magyar nyelvű bevezető előadás az LLM-ekről, a kontextusról, a toolokról és skillekről, a harnessről és az ágensekről (agentic loop).

Statikus HTML, build és külső függőség nélkül: `index.html` + `style.css` + `app.js`.

## Vezérlés

| Billentyű | Funkció |
|---|---|
| → / Space / PgDn | következő lépés vagy dia |
| ← / PgUp | előző lépés vagy dia |
| S | előadói jegyzet + időmérő |
| M | tartalomjegyzék |
| F | teljes képernyő |
| Home / End | első / utolsó dia |

- `#12`: közvetlen ugrás a 12. diára
- `?all`: minden fokozatosan megjelenő elem eleve látszik (áttekintéshez, nyomtatáshoz)

## Helyi futtatás

```bash
python3 -m http.server 8000
```

Utána: http://localhost:8000

## Közzététel

GitHub → Settings → Pages → Source: *Deploy from a branch*, Branch: `main`, mappa: `/ (root)`.
