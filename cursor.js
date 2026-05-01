/* ═══════════════════════════════════════════
mayjune — shared cursor + easter eggs + utils
═══════════════════════════════════════════ */

(function () {

/* ── CURSOR SUPPORT CHECK ── */
const hasFinePointer = () =>
  window.matchMedia('(pointer: fine)').matches;

/* ── CURSOR ELEMENTS ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
const halo   = document.getElementById('cursorHalo');

if (!cursor || !hasFinePointer()) {
  if (cursor) cursor.style.display = 'none';
  if (ring) ring.style.display = 'none';
  if (halo) halo.style.display = 'none';
  return;
}

/* ── STATE ── */
let mx = -200, my = -200;
let rx = -200, ry = -200;
let hx = -200, hy = -200;

let lastSparkTime = 0;
let hasMovedOnce = false;

/* hide until first move */
cursor.style.opacity = '0';
ring.style.opacity = '0';
if (halo) halo.style.opacity = '0';

/* ── MOUSE MOVE ── */
document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;

  cursor.style.transform =
    `translate3d(${mx - 7}px, ${my - 7}px, 0)`;

  if (!hasMovedOnce) {
    hasMovedOnce = true;
    cursor.style.opacity = '1';
    ring.style.opacity = '1';
    if (halo) halo.style.opacity = '1';
  }

  const now = Date.now();
  if (now - lastSparkTime > 70) {
    lastSparkTime = now;
    spawnSpark(mx, my);
  }
});

/* ── ANIMATION LOOP ── */
function animateLag() {
  rx += (mx - rx - 22) * 0.10;
  ry += (my - ry - 22) * 0.10;
  hx += (mx - hx - 40) * 0.07;
  hy += (my - hy - 40) * 0.07;

  ring.style.transform =
    `translate3d(${rx}px, ${ry}px, 0)`;

  if (halo) {
    halo.style.transform =
      `translate3d(${hx}px, ${hy}px, 0)`;
  }

  requestAnimationFrame(animateLag);
}
animateLag();

/* ── CLICK EFFECTS ── */
document.addEventListener('mousedown', () => {
  cursor.classList.add('clicking');
  ring.classList.add('clicking');

  for (let i = 0; i < 7; i++) {
    spawnSpark(mx, my, true);
  }
});

document.addEventListener('mouseup', () => {
  cursor.classList.remove('clicking');
  ring.classList.remove('clicking');
});

/* ── HOVER TARGETS ── */
function refreshHoverTargets() {
  document
    .querySelectorAll(
      'a, button, .card, .tag, .shop-card, .music-card, .link-card, .track-pill, .record-play-btn'
    )
    .forEach((el) => {
      if (el._mjHover) return;
      el._mjHover = true;

      el.addEventListener('mouseenter', () => {
        ring.classList.add('hovered');
        if (halo) halo.classList.add('hovered');
      });

      el.addEventListener('mouseleave', () => {
        ring.classList.remove('hovered');
        if (halo) halo.classList.remove('hovered');
      });
    });
}
refreshHoverTargets();

/* ── VISIBILITY ── */
document.addEventListener('mouseleave', () => {
  if (!hasMovedOnce) return;
  cursor.style.opacity = '0';
  ring.style.opacity = '0';
  if (halo) halo.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  if (!hasMovedOnce) return;
  cursor.style.opacity = '1';
  ring.style.opacity = '1';
  if (halo) halo.style.opacity = '1';
});

/* ── SPARKS ── */
function spawnSpark(x, y, burst) {
  const s = document.createElement('div');
  s.className = 'cursor-spark';

  const colors = [
    '#ffd166', '#ffb347', '#ff6b51',
    '#ff4d7e', '#fff9e0', '#9b4dff'
  ];

  const c = colors[Math.floor(Math.random() * colors.length)];
  const angle = Math.random() * Math.PI * 2;
  const dist = burst ? 30 + Math.random() * 55 : 10 + Math.random() * 22;
  const size = burst ? 5 : 3;

  s.style.left = x + 'px';
  s.style.top = y + 'px';
  s.style.width = size + 'px';
  s.style.height = size + 'px';
  s.style.background = c;
  s.style.boxShadow = `0 0 6px 2px ${c}88`;

  s.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
  s.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

  s.style.animationDuration = (burst ? 0.85 : 0.65) + 's';

  document.body.appendChild(s);
  s.addEventListener('animationend', () => s.remove());
}

window._mjSpawnSpark = spawnSpark;

/* ── SCROLL NAV ── */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener(
    'scroll',
    () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    },
    { passive: true }
  );
}

/* ── FADE IN ── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  },
  { threshold: 0.12 }
);

document
  .querySelectorAll('.fade-in')
  .forEach((el) => observer.observe(el));

/* ── CONFETTI ── */
window.mjConfetti = function (cx, cy) {
  cx = cx ?? window.innerWidth / 2;
  cy = cy ?? window.innerHeight / 2;

  const colors = [
    '#ffd166', '#ffb347', '#ff6b51',
    '#ff4d7e', '#9b4dff', '#fff9e0',
    '#4a1aff', '#ffffff'
  ];

  for (let i = 0; i < 80; i++) {
    const dot = document.createElement('div');
    dot.className = 'confetti-dot';

    const c = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 280;
    const dur = 0.8 + Math.random() * 0.8;
    const size = 5 + Math.random() * 8;

    dot.style.left = cx + 'px';
    dot.style.top = cy + 'px';
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.background = c;
    dot.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    dot.style.boxShadow = `0 0 4px ${c}88`;

    dot.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    dot.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    dot.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    dot.style.setProperty('--dur', dur + 's');

    document.body.appendChild(dot);
    dot.addEventListener('animationend', () => dot.remove());
  }
};

/* ── TOAST ── */
function toast(msg) {
  document.querySelectorAll('.mj-toast').forEach((t) => t.remove());

  const t = document.createElement('div');
  t.className = 'mj-toast';
  t.textContent = msg;

  document.body.appendChild(t);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => t.classList.add('visible'));
  });

  setTimeout(() => {
    t.classList.remove('visible');
    setTimeout(() => t.remove(), 500);
  }, 3200);
}

window._mjToast = toast;

/* ── EASTER EGGS ── */

/* konami */
const konamiSeq = [38,38,40,40,37,39,37,39,66,65];
let k = 0;

document.addEventListener('keydown', (e) => {
  k = e.keyCode === konamiSeq[k] ? k + 1 : 0;

  if (k === konamiSeq.length) {
    k = 0;
    document.body.classList.toggle('golden-hour-mode');

    toast(
      document.body.classList.contains('golden-hour-mode')
        ? '✦ golden hour activated ✦'
        : '✦ back to the night ✦'
    );
  }
});

/* type secret */
let buf = '';
document.addEventListener('keypress', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

  buf = (buf + e.key.toLowerCase()).slice(-7);

  if (buf === 'mayjune') {
    buf = '';
    rainEmbers();
    toast('✦ hey, that’s me ✦');
  }
});

function rainEmbers() {
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const s = document.createElement('div');
      s.className = 'cursor-spark';

      const colors = ['#ffd166','#ffb347','#ff6b51','#ff4d7e','#9b4dff'];
      const c = colors[Math.floor(Math.random() * colors.length)];

      const x = Math.random() * window.innerWidth;
      const angle = Math.PI / 2 + (Math.random() - 0.5) * 1.2;
      const dist = 60 + Math.random() * 120;

      s.style.left = x + 'px';
      s.style.top = '-10px';
      s.style.background = c;
      s.style.width = '6px';
      s.style.height = '6px';
      s.style.boxShadow = `0 0 8px 3px ${c}99`;

      s.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
      s.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);

      s.style.animationDuration = '1.4s';

      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }, i * 40);
  }
}

/* space = disco */
document.addEventListener('keydown', (e) => {
  if (
    e.code === 'Space' &&
    !e.repeat &&
    !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
  ) {
    e.preventDefault();
    document.body.classList.add('disco-mode');
    toast('✦ drop it ✦');
  }
});

document.addEventListener('keyup', (e) => {
  if (e.code === 'Space') document.body.classList.remove('disco-mode');
});

})();