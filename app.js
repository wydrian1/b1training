// AI alapok B-1 vezetőknek – egyszerű, függőség nélküli diavetítő motor
(function () {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SVGNS = 'http://www.w3.org/2000/svg';

  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // ---------------------------------------------------------------
  // Szekvencia diagramok (a teljes agentic loop lefutás)
  // ---------------------------------------------------------------
  const C = { user: '#63b3ed', llm: '#a78bfa', tool: '#f6ad55', res: '#68d391', fin: '#4fd1c5', gw: '#9fb1d4' };

  const SEQS = {
    loop: {
      actors: [
        { label: 'Felhasználó', sub: 'ember', c: C.user },
        { label: 'Eszköz (tool)', sub: 'fájl, DB, web…', c: C.tool },
        { label: 'Harness', sub: 'pl. Claude Code', c: C.fin },
        { label: 'LLM', sub: 'gatewayen át', c: C.llm }
      ],
      steps: [
        { f: 0, t: 2, l: '„Miért lassú a havi riport?”', c: C.user,
          h: 'Cél, nem lépéssor', p: 'A felhasználó természetes nyelven megad egy <b>célt</b>. Nem mondja meg, mit nyisson meg vagy mit futtasson.' },
        { f: 2, t: 3, l: 'system prompt + toolok + kérdés', c: C.fin,
          h: 'A harness összerakja a kontextust', p: 'Szabályok (system prompt), az elérhető eszközök leírása, projekt-utasítások és a kérdés. Ez egyetlen API-hívás – nálunk az <b>RBI LLM gatewayen</b> keresztül.' },
        { f: 3, t: 2, l: 'tool_use: read_file', c: C.llm,
          h: 'Az LLM nem futtat semmit', p: 'Csak szöveget ad vissza: egy strukturált <b>kérést</b>, hogy melyik eszközt hívná és milyen paraméterrel. <code>stop_reason: tool_use</code>' },
        { f: 2, t: 1, l: 'read_file("riport.sql")', c: C.tool,
          h: 'A harness hajtja végre', p: 'Előbb ellenőrzi az <b>engedélyeket</b> (szabály vagy emberi jóváhagyás), utána futtatja az eszközt a saját környezetében.' },
        { f: 1, t: 2, l: 'SQL tartalma (240 sor)', c: C.res,
          h: 'Megjön az eredmény', p: 'Az eszköz kimenete a harnesshez érkezik, nem közvetlenül az LLM-hez.' },
        { f: 2, t: 3, l: 'tool_result + teljes előzmény', c: C.fin,
          h: 'Új hívás, az egész kontextussal', p: 'Az LLM-nek <b>nincs emlékezete</b> két hívás között. A harness az eddigi teljes beszélgetést + az eredményt újra elküldi.' },
        { f: 3, t: 2, l: 'tool_use: run_query', c: C.llm,
          h: 'Az LLM újra dönt', p: 'Az új információ alapján úgy ítéli, hogy még kell adat: lekéri a lekérdezés végrehajtási tervét (<code>EXPLAIN</code>).' },
        { f: 2, t: 1, l: 'run_query("EXPLAIN …")', c: C.tool,
          h: 'Második kör', p: 'Ugyanaz a minta: engedély → végrehajtás. Írási művelethez itt jellemzően emberi jóváhagyás kell.' },
        { f: 1, t: 2, l: 'Seq Scan: 48 M sor', c: C.res,
          h: 'Bizonyíték', p: 'A végrehajtási terv teljes táblaolvasást mutat egy 48 millió soros táblán.' },
        { f: 2, t: 3, l: 'tool_result + teljes előzmény', c: C.fin,
          h: 'Harmadik LLM-hívás', p: 'A kontextus körről körre <b>nő</b>: minden eddigi lépés és eredmény benne van. Ez idő és pénz.' },
        { f: 3, t: 2, l: 'szöveges válasz · end_turn', c: C.llm,
          h: 'Nincs több tool-kérés → vége', p: 'Most nem eszközt kér, hanem válaszol. A ciklus ezzel áll le. <code>stop_reason: end_turn</code>' },
        { f: 2, t: 0, l: '„Hiányzik egy index a dátum mezőn…”', c: C.fin,
          h: 'Válasz a felhasználónak', p: '1 kérdés → <b>3 LLM-hívás, 2 eszközhívás</b>. A felhasználó ebből csak az elsőt és az utolsót látja (ha a harness nem mutatja a köztes lépéseket).' }
      ]
    }
  };

  function buildSeq(host) {
    const cfg = SEQS[host.dataset.seq];
    const W = 800, padX = 95, rowH = 36, headH = 60;
    const n = cfg.actors.length, gap = (W - 2 * padX) / (n - 1);
    const H = headH + cfg.steps.length * rowH + 14;
    const X = i => padX + i * gap;
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, class: 'seqsvg' });
    const defs = svgEl('defs', {}, svg);
    const markers = {};
    cfg.steps.forEach(s => {
      if (markers[s.c]) return;
      const id = 'm' + s.c.slice(1);
      const m = svgEl('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
      svgEl('path', { d: 'M0,0 L10,5 L0,10 z', fill: s.c }, m);
      markers[s.c] = id;
    });
    cfg.actors.forEach((a, i) => {
      const x = X(i);
      svgEl('line', { x1: x, x2: x, y1: 50, y2: H, stroke: '#2c3d63', 'stroke-width': 2, 'stroke-dasharray': '5 6' }, svg);
      svgEl('rect', { x: x - 78, y: 2, width: 156, height: 48, rx: 10, fill: '#131c30', stroke: a.c, 'stroke-width': 2 }, svg);
      const t = svgEl('text', { x, y: 23, 'text-anchor': 'middle', fill: a.c, 'font-size': 16, 'font-weight': 700 }, svg);
      t.textContent = a.label;
      const s = svgEl('text', { x, y: 41, 'text-anchor': 'middle', fill: '#9fb1d4', 'font-size': 12 }, svg);
      s.textContent = a.sub;
    });
    const capbox = host.parentElement.querySelector('.capbox');
    cfg.steps.forEach((s, i) => {
      const y = headH + i * rowH + rowH / 2 + 6;
      const x1 = X(s.f), x2 = X(s.t), dir = Math.sign(x2 - x1);
      const g = svgEl('g', { class: 'frag msg', 'data-s': i + 1 }, svg);
      svgEl('line', { x1: x1 + dir * 4, x2: x2 - dir * 4, y1: y, y2: y, stroke: s.c, 'stroke-width': 2.2, 'marker-end': `url(#${markers[s.c]})` }, g);
      const t = svgEl('text', { x: (x1 + x2) / 2, y: y - 7, 'text-anchor': 'middle', class: 'lbl' }, g);
      t.textContent = `${i + 1}. ${s.l}`;
      if (capbox) {
        const d = document.createElement('div');
        d.className = 'cap frag';
        d.dataset.s = i + 1;
        d.dataset.g = 'cap';
        d.style.borderLeft = `5px solid ${s.c}`;
        d.innerHTML = `<div class="no" style="color:${s.c}">${i + 1} / ${cfg.steps.length}</div><h3>${s.h}</h3><p>${s.p}</p>`;
        capbox.appendChild(d);
      }
    });
    host.appendChild(svg);
  }

  $$('[data-seq]').forEach(buildSeq);

  // ---------------------------------------------------------------
  // Diavetítő
  // ---------------------------------------------------------------
  const stage = $('#stage');
  const slides = $$('.slide');
  const total = slides.length;
  let cur = 0, step = 0;
  const t0 = Date.now();

  // fokozatos elemek: data-s = explicit lépésszám, egyébként DOM-sorrend
  slides.forEach(s => {
    let auto = 0;
    s._frags = $$('.frag', s).map(el => {
      const st = el.dataset.s ? +el.dataset.s : ++auto;
      return { el, s: st, g: el.dataset.g || null };
    });
    s._max = s._frags.reduce((m, f) => Math.max(m, f.s), 0);
  });

  function fit() {
    const k = Math.min(innerWidth / 1280, innerHeight / 720);
    stage.style.transform = `translate(-50%, -50%) scale(${k})`;
  }

  function sectionOf(i) {
    for (let j = i; j >= 0; j--) if (slides[j].classList.contains('cover')) return slides[j];
    return null;
  }

  function titleOf(s) {
    if (s.dataset.title) return s.dataset.title;
    const h = $('h2, h1', s);
    return h ? h.textContent.trim() : '';
  }

  function render() {
    slides.forEach((s, i) => s.classList.toggle('active', i === cur));
    const s = slides[cur];
    const latest = {};
    s._frags.forEach(f => { if (f.g && f.s <= step) latest[f.g] = Math.max(latest[f.g] || 0, f.s); });
    s._frags.forEach(f => {
      let on = f.s <= step;
      if (f.g && on) on = f.s === latest[f.g];
      f.el.classList.toggle('on', on);
      f.el.classList.toggle('cur', f.s === step && !f.g);
    });
    const sec = sectionOf(cur);
    $('#hud-l').textContent = 'AI alapok B-1 vezetőknek' + (sec ? ' · ' + sec.dataset.title : '');
    $('#hud-r').textContent = `${cur + 1} / ${total}`;
    $('#bar').style.width = (total > 1 ? (cur / (total - 1)) * 100 : 100) + '%';
    if (location.hash !== '#' + (cur + 1)) history.replaceState(null, '', '#' + (cur + 1));
    $$('#menu a').forEach(a => a.classList.toggle('cur', +a.dataset.i === cur));
    renderNotes();
  }

  // ?all = minden lépés eleve látszik (áttekintéshez, nyomtatáshoz)
  const showAll = new URLSearchParams(location.search).has('all');

  function go(i, st) {
    cur = Math.max(0, Math.min(total - 1, i));
    step = st === 'end' || showAll ? slides[cur]._max : 0;
    render();
  }
  function next() {
    if (step < slides[cur]._max) { step++; render(); }
    else if (cur < total - 1) go(cur + 1);
  }
  function prev() {
    if (step > 0) { step--; render(); }
    else if (cur > 0) go(cur - 1, 'end');
  }

  // jegyzetek + időmérő
  const notes = $('#notes');
  function fmt(ms) {
    const m = Math.floor(ms / 60000), sec = Math.floor(ms / 1000) % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  }
  function renderNotes() {
    if (!notes.classList.contains('open')) return;
    const s = slides[cur], n = $('.notes', s), sec = sectionOf(cur);
    const plan = sec && sec.dataset.start ? ` · szakasz terv: ${sec.dataset.start}. perctől` : '';
    notes.innerHTML = `<div class="nh"><span>Eltelt: <span id="clock">${fmt(Date.now() - t0)}</span></span><span>${cur + 1}/${total} · ${titleOf(s)}${plan}</span><span>lépés ${step}/${s._max}</span></div>` +
      (n ? n.innerHTML : '<p class="dim">Nincs jegyzet.</p>');
  }
  setInterval(() => { const c = $('#clock'); if (c) c.textContent = fmt(Date.now() - t0); }, 1000);

  // menü
  const menu = $('#menu');
  slides.forEach((s, i) => {
    const a = document.createElement('a');
    a.href = '#' + (i + 1);
    a.dataset.i = i;
    if (s.classList.contains('cover')) a.className = 'sec';
    a.innerHTML = `<span>${i + 1}</span>${titleOf(s)}`;
    a.addEventListener('click', e => { e.preventDefault(); menu.classList.remove('open'); go(i); });
    menu.appendChild(a);
  });

  // vezérlés
  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': case 'Enter': case 'ArrowDown': next(); break;
      case 'ArrowLeft': case 'PageUp': case 'Backspace': case 'ArrowUp': prev(); break;
      case 'Home': go(0); break;
      case 'End': go(total - 1); break;
      case 'f': case 'F':
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
        break;
      case 's': case 'S': notes.classList.toggle('open'); renderNotes(); break;
      case 'm': case 'M': menu.classList.toggle('open'); break;
      case 'Escape': menu.classList.remove('open'); notes.classList.remove('open'); break;
      default: return;
    }
    e.preventDefault();
  });
  stage.addEventListener('click', e => {
    if (e.target.closest('a, button')) return;
    if (menu.classList.contains('open')) { menu.classList.remove('open'); return; }
    (e.clientX < innerWidth * 0.25 ? prev : next)();
  });
  let tx = null;
  addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    tx = null;
  });
  addEventListener('hashchange', () => {
    const i = parseInt(location.hash.slice(1), 10) - 1;
    if (!isNaN(i) && i !== cur) go(i);
  });
  addEventListener('resize', fit);

  fit();
  const start = parseInt(location.hash.slice(1), 10) - 1;
  go(isNaN(start) ? 0 : start);
})();
