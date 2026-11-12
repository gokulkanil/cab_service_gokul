/* Wayanad Cab Service: landing page interactions (no backend, no libraries) */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Hero sky: follows the visitor's time, can be changed by hand ---------- */
  const skyLabels = { dawn: 'Misty morning', day: 'Clear skies', dusk: 'Golden hour', night: 'Starlit night' };
  const skyButtons = document.querySelectorAll('[data-sky]');

  function setSky(time) {
    root.dataset.time = time;
    skyButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sky === time)));
    document.querySelectorAll('[data-sky-label]').forEach((el) => { el.textContent = skyLabels[time]; });
  }
  skyButtons.forEach((b) => b.addEventListener('click', () => setSky(b.dataset.sky)));
  setSky(root.dataset.time || 'day');

  /* ---------- Header + mobile menu ---------- */
  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');

  function closeMenu() {
    header.classList.remove('menu-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
  }
  menuBtn.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Hero cab: slower in the visible middle on narrow screens ---------- */
  const heroMotion = document.getElementById('heroCabMotion');
  const heroRoad = document.getElementById('heroRoad');
  if (heroMotion) {
    if (reduceMotion) {
      // Park the cab on the road instead of animating it
      heroMotion.remove();
      const len = heroRoad.getTotalLength();
      const p = heroRoad.getPointAtLength(len * 0.45);
      const q = heroRoad.getPointAtLength(len * 0.45 + 2);
      const ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
      document.getElementById('heroCab').setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${ang})`);
    } else if (window.innerWidth < 760) {
      heroMotion.setAttribute('calcMode', 'linear');
      heroMotion.setAttribute('keyPoints', '0;0.3;0.68;1');
      heroMotion.setAttribute('keyTimes', '0;0.08;0.92;1');
      heroMotion.setAttribute('dur', '12s');
    }
  }

  /* ---------- Hero parallax ---------- */
  const layers = document.querySelectorAll('.hero-scene [data-depth]');
  function parallax() {
    const y = Math.min(window.scrollY, window.innerHeight);
    layers.forEach((l) => { l.style.transform = `translateY(${y * parseFloat(l.dataset.depth)}px)`; });
  }

  /* ---------- Churam: cab climbs the nine hairpins as you scroll ---------- */
  const journey = document.getElementById('journey');
  const road = document.getElementById('churamRoad');
  const trail = document.getElementById('churamTrail');
  const cab = document.getElementById('churamCab');
  const bendNum = document.getElementById('bendNum');
  const bendBar = document.getElementById('bendBar');
  const steps = document.querySelectorAll('.journey-step');
  const hpLabels = document.querySelectorAll('.hp');
  let roadLen = 0;
  const hairpinAt = []; // road length at the tip of each hairpin

  if (road) {
    roadLen = road.getTotalLength();
    trail.style.strokeDasharray = `${roadLen}`;
    trail.style.strokeDashoffset = `${roadLen}`;

    // Find each hairpin tip: the points where the road turns from going right to going left (or back)
    const samples = 900;
    let prev = road.getPointAtLength(0);
    let prevDx = 0;
    for (let i = 1; i <= samples; i++) {
      const l = (roadLen * i) / samples;
      const p = road.getPointAtLength(l);
      const dx = p.x - prev.x;
      if (Math.abs(dx) > 1e-4) {
        if (prevDx && Math.sign(dx) !== Math.sign(prevDx)) hairpinAt.push(l);
        prevDx = dx;
      }
      prev = p;
    }
  }

  let lastBends = -1;
  function updateJourney() {
    if (!road) return;
    const rect = journey.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const total = journey.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, -rect.top / total));
    const l = p * roadLen;

    const pt = road.getPointAtLength(l);
    const a = road.getPointAtLength(Math.max(0, l - 1.5));
    const b = road.getPointAtLength(Math.min(roadLen, l + 1.5));
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    cab.setAttribute('transform', `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)}) rotate(${ang.toFixed(2)})`);

    trail.style.strokeDashoffset = `${roadLen - l}`;
    bendBar.style.transform = `scaleX(${p})`;

    const bends = hairpinAt.filter((h) => h <= l).length;
    if (bends !== lastBends) {
      lastBends = bends;
      bendNum.textContent = bends;
      hpLabels.forEach((el, i) => el.classList.toggle('passed', i < bends));
    }

    const stepIdx = p < 0.34 ? 0 : p < 0.9 ? 1 : 2;
    steps.forEach((s, i) => s.classList.toggle('active', i === stepIdx));
    journey.classList.toggle('started', p > 0.03);
    journey.classList.toggle('arrived', p > 0.97);
  }

  /* ---------- Scroll loop ---------- */
  const mobileBar = document.getElementById('mobileBar');
  const hero = document.getElementById('top');
  let ticking = false;

  function frame() {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 40);
    mobileBar.classList.toggle('show', y > hero.offsetHeight * 0.6);
    if (!reduceMotion) parallax();
    updateJourney();
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(frame); }
  }, { passive: true });
  window.addEventListener('resize', frame);
  frame();

  /* ---------- Destination filters + rail arrows ---------- */
  const rail = document.getElementById('rail');
  const chips = document.querySelectorAll('.chip[data-filter]');
  const cards = rail.querySelectorAll('.dest');

  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    cards.forEach((card) => { card.hidden = !(f === 'all' || card.dataset.cat.split(' ').includes(f)); });
    rail.scrollTo({ left: 0 });
  }));

  document.querySelectorAll('[data-rail]').forEach((btn) => btn.addEventListener('click', () => {
    const card = rail.querySelector('.dest:not([hidden])');
    const step = card ? card.offsetWidth + 18 : 300;
    rail.scrollBy({ left: btn.dataset.rail === 'next' ? step : -step });
  }));

  /* ---------- Reveal on scroll ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));

  /* ---------- Departure board: split-flap effect + live IST clock ---------- */
  const board = document.getElementById('board');
  const flapChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  function flap(el, delay) {
    const target = el.dataset.text;
    let tick = 0;
    const settle = (i) => 3 + i * 1.1;
    const run = () => {
      tick++;
      let out = '';
      for (let i = 0; i < target.length; i++) {
        const ch = target[i];
        out += (tick >= settle(i) || !/[A-Z0-9]/.test(ch)) ? ch : flapChars[(Math.random() * flapChars.length) | 0];
      }
      el.textContent = out;
      if (tick < settle(target.length)) setTimeout(run, 42);
    };
    setTimeout(run, delay);
  }

  if (board && !reduceMotion) {
    const boardIO = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        board.querySelectorAll('.flap').forEach((el, i) => flap(el, i * 60));
        boardIO.disconnect();
      }
    }, { threshold: 0.35 });
    boardIO.observe(board);
  }

  const clock = document.getElementById('istClock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
    const tickClock = () => { clock.textContent = fmt.format(new Date()); };
    tickClock();
    setInterval(tickClock, 15000);
  }

  /* ---------- Footer year ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
