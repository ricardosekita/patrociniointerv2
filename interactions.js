/* ═══════════════════════════════════════════════════════════
   INTER SG — INTERACTIVE LAYERS
   Cursor, flip cards, 3D gallery, map, ROI sim, tweaks
   ═══════════════════════════════════════════════════════════ */

// ─── CUSTOM CURSOR ────────────────────────────────────────────
(() => {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  function raf() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  }
  raf();

  // hover expand on interactive
  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    if (t.closest('button, .flip-card, .tapzone, .toggle, [data-hover], input, .quadrant, .region, .tier-card, .activation')) {
      document.body.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    const t = e.target;
    if (t.closest('button, .flip-card, .tapzone, .toggle, [data-hover], input, .quadrant, .region, .tier-card, .activation')) {
      document.body.classList.remove('cursor-hover');
    }
  });
})();

// ─── TWEAKS PANEL (grid toggle) ──────────────────────────────
(() => {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "showGrid": true
  }/*EDITMODE-END*/;

  const state = { ...TWEAK_DEFAULTS };
  const panel = document.getElementById('tweaks-panel');
  const gridToggle = document.getElementById('tweak-grid');

  function apply() {
    document.body.classList.toggle('grid-off', !state.showGrid);
    if (gridToggle) gridToggle.classList.toggle('on', state.showGrid);
  }
  apply();

  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === '__activate_edit_mode') panel?.classList.add('on');
    if (e.data.type === '__deactivate_edit_mode') panel?.classList.remove('on');
  });

  gridToggle?.addEventListener('click', () => {
    state.showGrid = !state.showGrid;
    apply();
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { showGrid: state.showGrid } }, '*');
  });

  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
})();

// ─── COUNTER ANIMATIONS ───────────────────────────────────────
function animateCounter(el, target, duration = 1600, suffix = '', format = '') {
  const start = performance.now();
  const from = 0;
  function render(val) {
    if (format === 'compact') {
      if (val >= 1000000) return (val / 1000000).toFixed(1).replace('.', ',') + 'M';
      if (val >= 1000) return Math.round(val / 1000) + ' mil';
      return String(val);
    }
    return val.toLocaleString('pt-BR');
  }
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = Math.floor(from + (target - from) * eased);
    el.textContent = render(val) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Play entry animations + counters for a slide
function playSlide(slide) {
  if (!slide) return;
  slide.querySelectorAll('.enter').forEach(el => el.classList.remove('play'));
  void slide.offsetWidth;
  requestAnimationFrame(() => {
    slide.querySelectorAll('.enter').forEach(el => el.classList.add('play'));
    slide.querySelectorAll('[data-counter]').forEach(el => {
      animateCounter(el, parseInt(el.dataset.counter, 10), 1400, el.dataset.suffix || '', el.dataset.format || '');
    });
  });
}

const deckEl = document.querySelector('deck-stage');
deckEl?.addEventListener('slidechange', (e) => playSlide(e.detail.slide));

// Trigger initial slide (listener attached after deck-stage's initial slidechange)
requestAnimationFrame(() => {
  playSlide(document.querySelector('section.slide[data-deck-active]'));
});

// ─── FLIP CARDS ──────────────────────────────────────────────
document.addEventListener('click', (e) => {
  const card = e.target.closest('.flip-card');
  if (card) card.classList.toggle('flipped');
});

// ─── 3D GALLERY ──────────────────────────────────────────────
(() => {
  let rotation = 0;
  const gallery = () => document.querySelector('.gallery-3d');
  function rotate(delta) {
    const g = gallery();
    if (!g) return;
    rotation += delta;
    g.style.transform = `translateZ(-420px) rotateY(${rotation}deg)`;
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest('.gallery-next')) rotate(-45);
    if (e.target.closest('.gallery-prev')) rotate(45);
  });
})();

// ─── INTERACTIVE MAP (torcida regions) ───────────────────────
document.addEventListener('mouseover', (e) => {
  const region = e.target.closest('.region');
  if (!region) return;
  const map = region.closest('.torcida-map');
  if (!map) return;
  const label = map.querySelector('.region-label');
  const count = map.querySelector('.region-count');
  if (label) label.textContent = region.dataset.name || '—';
  if (count) count.textContent = region.dataset.count || '';
  map.querySelectorAll('.region').forEach(r => r.classList.remove('active'));
  region.classList.add('active');
});

// ─── ROI SIMULATOR ───────────────────────────────────────────
(() => {
  const invest = document.getElementById('roi-invest');
  const months = document.getElementById('roi-months');
  const invDisplay = document.getElementById('roi-invest-val');
  const moDisplay = document.getElementById('roi-months-val');
  const impressions = document.getElementById('roi-impressions');
  const reach = document.getElementById('roi-reach');
  const media = document.getElementById('roi-media');
  const cpm = document.getElementById('roi-cpm');

  function fmt(n) { return n.toLocaleString('pt-BR'); }
  function fmtBRL(n) {
    if (n >= 1000000) return 'R$ ' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return 'R$ ' + (n / 1000).toFixed(0) + 'k';
    return 'R$ ' + fmt(n);
  }

  function recalc() {
    if (!invest || !months) return;
    const i = parseInt(invest.value, 10);
    const m = parseInt(months.value, 10);
    if (invDisplay) invDisplay.textContent = fmtBRL(i);
    if (moDisplay) moDisplay.textContent = m + (m === 1 ? ' mês' : ' meses');

    // modelo simplificado: 15k seguidores base, cresce 8%/mês, impressões 2.2x seguidores/mês
    const finalFollowers = Math.floor(15000 * Math.pow(1.08, m));
    const totalImpressions = Math.floor(finalFollowers * 2.2 * m * 1.4);
    const totalReach = Math.floor(finalFollowers * 0.85 * m * 0.6);
    const mediaValue = Math.floor(totalImpressions * 0.012);
    const cpmValue = i / (totalImpressions / 1000);

    if (impressions) impressions.textContent = fmt(totalImpressions);
    if (reach) reach.textContent = fmt(totalReach);
    if (media) media.textContent = fmtBRL(mediaValue);
    if (cpm) cpm.textContent = 'R$ ' + cpmValue.toFixed(2);
  }

  invest?.addEventListener('input', recalc);
  months?.addEventListener('input', recalc);
  recalc();
})();

// ─── HOLOGRAM TILT on glass cards ─────────────────────────────
document.querySelectorAll('[data-tilt]').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
  });
});
