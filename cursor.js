/* ═══════════════════════════════════════════
mayjune — shared cursor + easter eggs + utils
═══════════════════════════════════════════ */

(function () {
const isMobile = () => window.matchMedia(’(max-width: 768px)’).matches || ‘ontouchstart’ in window;

/* ── CURSOR ── */
const cursor = document.getElementById(‘cursor’);
const ring   = document.getElementById(‘cursorRing’);
const halo   = document.getElementById(‘cursorHalo’);

if (!cursor || isMobile()) {
if (cursor) cursor.style.display = ‘none’;
if (ring)   ring.style.display   = ‘none’;
if (halo)   halo.style.display   = ‘none’;
} else {
let mx = -200, my = -200;
let rx = -200, ry = -200;
let hx = -200, hy = -200;
let lastSparkTime = 0;

```
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.transform = 'translate3d(' + (mx - 7) + 'px, ' + (my - 7) + 'px, 0)';
  const now = Date.now();
  if (now - lastSparkTime > 70) {
    lastSparkTime = now;
    spawnSpark(mx, my);
  }
});

function animateLag() {
  rx += (mx - rx - 22) * 0.10;
  ry += (my - ry - 22) * 0.10;
  hx += (mx - hx - 40) * 0.07;
  hy += (my - hy - 40) * 0.07;
  ring.style.transform = 'translate3d(' + rx + 'px, ' + ry + 'px, 0)';
  if (halo) halo.style.transform = 'translate3d(' + hx + 'px, ' + hy + 'px, 0)';
  requestAnimationFrame(animateLag);
}
animateLag();

document.addEventListener('mousedown', () => {
  cursor.classList.add('clicking');
  ring.classList.add('clicking');
  for (let i = 0; i < 7; i++) spawnSpark(mx, my, true);
});
document.addEventListener('mouseup', () => {
  cursor.classList.remove('clicking');
  ring.classList.remove('clicking');
});

function refreshHoverTargets() {
  document.querySelectorAll('a, button, .card, .tag, .shop-card, .music-card, .link-card, .track-pill, .record-play-btn').forEach(el => {
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

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0'; ring.style.opacity = '0';
  if (halo) halo.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1'; ring.style.opacity = '1';
  if (halo) halo.style.opacity = '1';
});

function spawnSpark(x, y, burst) {
  const s = document.createElement('div');
  s.className = 'cursor-spark';
  const colors = ['#ffd166','#ffb347','#ff6b51','#ff4d7e','#fff9e0','#9b4dff'];
  const c = colors[Math.floor(Math.random() * colors.length)];
  const angle = Math.random() * Math.PI * 2;
  const dist  = burst ? 30 + Math.random() * 55 : 10 + Math.random() * 22;
  const sz    = burst ? 5 : 3;
  s.style.left = x + 'px';
  s.style.top  = y + 'px';
  s.style.width  = sz + 'px';
  s.style.height = sz + 'px';
  s.style.background = c;
  s.style.boxShadow = '0 0 6px 2px ' + c + '88';
  s.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px');
  s.style.setProperty('--ty', (Math.sin(angle) * dist) + 'px');
  s.style.animationDuration = (burst ? 0.85 : 0.65) + 's';
  document.body.appendChild(s);
  s.addEventListener('animationend', () => s.remove());
}

window._mjSpawnSpark = spawnSpark;
```

}

/* ── STICKY NAV ── */
const nav = document.getElementById(‘nav’);
if (nav) {
window.addEventListener(‘scroll’, () => {
nav.classList.toggle(‘scrolled’, window.scrollY > 40);
}, { passive: true });
}

/* ── SCROLL FADE-IN ── */
const observer = new IntersectionObserver(entries => {
entries.forEach(e => { if (e.isIntersecting) e.target.classList.add(‘visible’); });
}, { threshold: 0.12 });
document.querySelectorAll(’.fade-in’).forEach(el => observer.observe(el));

/* ══════════════════════════════════════════
CONFETTI + SUCCESS OVERLAY
══════════════════════════════════════════ */
window.mjConfetti = function(cx, cy) {
cx = cx !== undefined ? cx : window.innerWidth / 2;
cy = cy !== undefined ? cy : window.innerHeight / 2;
const colors = [’#ffd166’,’#ffb347’,’#ff6b51’,’#ff4d7e’,’#9b4dff’,’#fff9e0’,’#4a1aff’,’#ffffff’];
for (let i = 0; i < 80; i++) {
const dot = document.createElement(‘div’);
dot.className = ‘confetti-dot’;
const c     = colors[Math.floor(Math.random() * colors.length)];
const angle = Math.random() * Math.PI * 2;
const dist  = 120 + Math.random() * 280;
const dur   = 0.8 + Math.random() * 0.8;
const size  = 5 + Math.random() * 8;
dot.style.left   = cx + ‘px’;
dot.style.top    = cy + ‘px’;
dot.style.width  = size + ‘px’;
dot.style.height = size + ‘px’;
dot.style.background   = c;
dot.style.borderRadius = Math.random() > 0.5 ? ‘50%’ : ‘2px’;
dot.style.boxShadow    = ‘0 0 4px ’ + c + ‘88’;
dot.style.setProperty(’–tx’,  (Math.cos(angle) * dist) + ‘px’);
dot.style.setProperty(’–ty’,  (Math.sin(angle) * dist + dist * 0.3) + ‘px’);
dot.style.setProperty(’–rot’, (Math.random() * 720 - 360) + ‘deg’);
dot.style.setProperty(’–dur’, dur + ‘s’);
document.body.appendChild(dot);
dot.addEventListener(‘animationend’, () => dot.remove());
}
};

window.mjShowSuccess = function(opts) {
opts = opts || {};
const title = opts.title || ‘sent ✦’;
const sub   = opts.sub   || “i’ll be in touch soon”;

```
window.mjConfetti(window.innerWidth / 2, window.innerHeight / 2);
setTimeout(() => window.mjConfetti(window.innerWidth * 0.3, window.innerHeight * 0.4), 180);
setTimeout(() => window.mjConfetti(window.innerWidth * 0.7, window.innerHeight * 0.35), 340);

const ov = document.createElement('div');
ov.className = 'success-overlay';
ov.innerHTML =
  '<div class="success-inner">' +
    '<div class="success-icon">✦</div>' +
    '<div class="success-title">' + title + '</div>' +
    '<div class="success-sub">' + sub + '</div>' +
    '<button class="button success-close">close</button>' +
  '</div>';
document.body.appendChild(ov);
requestAnimationFrame(() => ov.classList.add('visible'));

function close() {
  ov.classList.remove('visible');
  setTimeout(() => ov.remove(), 500);
}
ov.querySelector('.success-close').addEventListener('click', close);
ov.addEventListener('click', function(e) { if (e.target === ov) close(); });
```

};

/* ══════════════════════════════════════════
EASTER EGGS
══════════════════════════════════════════ */

/* 1. Konami → golden hour mode */
const konamiSeq = [38,38,40,40,37,39,37,39,66,65];
let konamiIdx = 0;
document.addEventListener(‘keydown’, function(e) {
konamiIdx = (e.keyCode === konamiSeq[konamiIdx]) ? konamiIdx + 1 : 0;
if (konamiIdx === konamiSeq.length) {
konamiIdx = 0;
document.body.classList.toggle(‘golden-hour-mode’);
toast(document.body.classList.contains(‘golden-hour-mode’)
? ‘✦ golden hour activated ✦’
: ‘✦ back to the night ✦’);
}
});

/* 2. Logo triple-click → secret overlay */
const logo = document.querySelector(‘nav h2’);
if (logo) {
let clicks = 0, ct;
logo.addEventListener(‘click’, function() {
clicks++;
clearTimeout(ct);
ct = setTimeout(function() { clicks = 0; }, 600);
if (clicks >= 3) {
clicks = 0;
showSecretOverlay();
}
});
}

function showSecretOverlay() {
const ov = document.createElement(‘div’);
ov.id = ‘secret-overlay’;
ov.innerHTML =
‘<div class="secret-inner">’ +
‘<p class="secret-eyebrow">✦ you found it ✦</p>’ +
‘<h2 class="secret-title">it's always<br>golden hour<br>somewhere</h2>’ +
‘<p class="secret-sub">thanks for paying attention</p>’ +
‘<button class="button secret-close">close</button>’ +
‘</div>’;
document.body.appendChild(ov);
requestAnimationFrame(() => ov.classList.add(‘visible’));
window.mjConfetti(window.innerWidth / 2, window.innerHeight / 2);
const close = function() {
ov.classList.remove(‘visible’);
setTimeout(function() { ov.remove(); }, 500);
};
ov.querySelector(’.secret-close’).addEventListener(‘click’, close);
ov.addEventListener(‘click’, function(e) { if (e.target === ov) close(); });
}

/* 3. Type “mayjune” → ember rain */
let typeBuf = ‘’;
document.addEventListener(‘keypress’, function(e) {
if ([‘INPUT’,‘TEXTAREA’].includes(document.activeElement.tagName)) return;
typeBuf = (typeBuf + e.key.toLowerCase()).slice(-7);
if (typeBuf === ‘mayjune’) { typeBuf = ‘’; rainEmbers(); toast(“✦ hey, that’s me ✦”); }
});

function rainEmbers() {
for (let i = 0; i < 40; i++) {
setTimeout(function() {
const s = document.createElement(‘div’);
s.className = ‘cursor-spark’;
const colors = [’#ffd166’,’#ffb347’,’#ff6b51’,’#ff4d7e’,’#9b4dff’];
const c = colors[Math.floor(Math.random() * colors.length)];
const x = Math.random() * window.innerWidth;
const angle = Math.PI / 2 + (Math.random() - 0.5) * 1.2;
const dist  = 60 + Math.random() * 120;
s.style.left = x + ‘px’;
s.style.top  = ‘-10px’;
s.style.background = c;
s.style.width  = ‘6px’;
s.style.height = ‘6px’;
s.style.boxShadow = ‘0 0 8px 3px ’ + c + ‘99’;
s.style.setProperty(’–tx’, (Math.cos(angle) * dist) + ‘px’);
s.style.setProperty(’–ty’, (Math.sin(angle) * dist + dist) + ‘px’);
s.style.animationDuration = ‘1.4s’;
document.body.appendChild(s);
s.addEventListener(‘animationend’, function() { s.remove(); });
}, i * 40);
}
}

/* 4. Hold Spacebar → disco */
document.addEventListener(‘keydown’, function(e) {
if (e.code === ‘Space’ && !e.repeat && ![‘INPUT’,‘TEXTAREA’].includes(document.activeElement.tagName)) {
e.preventDefault();
document.body.classList.add(‘disco-mode’);
toast(‘✦ drop it ✦’);
}
});
document.addEventListener(‘keyup’, function(e) {
if (e.code === ‘Space’) document.body.classList.remove(‘disco-mode’);
});

/* 5. Click marquee ✦ 5× → star shower */
let starClicks = 0, starTimer;
document.querySelectorAll(’.marquee-track .a’).forEach(function(star) {
star.addEventListener(‘click’, function() {
starClicks++;
clearTimeout(starTimer);
starTimer = setTimeout(function() { starClicks = 0; }, 3000);
if (starClicks >= 5) {
starClicks = 0;
starShower();
toast(‘✦ wish granted ✦’);
}
});
});

function starShower() {
for (let i = 0; i < 25; i++) {
setTimeout(function() {
const s = document.createElement(‘div’);
s.className = ‘cursor-spark’;
const x = Math.random() * window.innerWidth;
s.style.left = x + ‘px’;
s.style.top  = ‘-6px’;
s.style.background = ‘#ffd166’;
s.style.width  = ‘8px’;
s.style.height = ‘8px’;
s.style.borderRadius = ‘50%’;
s.style.boxShadow = ‘0 0 10px 4px #ffd16699’;
s.style.setProperty(’–tx’, ((Math.random() - 0.5) * 60) + ‘px’);
s.style.setProperty(’–ty’, (80 + Math.random() * 200) + ‘px’);
s.style.animationDuration = (1.2 + Math.random() * 0.6) + ‘s’;
document.body.appendChild(s);
s.addEventListener(‘animationend’, function() { s.remove(); });
}, i * 80);
}
}

/* 6. Idle 30s → message */
let idleTimer;
function resetIdle() {
clearTimeout(idleTimer);
idleTimer = setTimeout(function() {
toast(‘✦ still here? the night is long ✦’);
}, 30000);
}
[‘mousemove’,‘keydown’,‘scroll’,‘click’,‘touchstart’].forEach(function(ev) {
document.addEventListener(ev, resetIdle, { passive: true });
});
resetIdle();

/* 7. Double-click blank space → mini firework */
document.addEventListener(‘dblclick’, function(e) {
if ([‘A’,‘BUTTON’,‘INPUT’,‘TEXTAREA’].includes(e.target.tagName)) return;
window.mjConfetti(e.clientX, e.clientY);
});

/* 8. Scroll to very bottom → “you made it” */
let reachedBottom = false;
window.addEventListener(‘scroll’, function() {
if (reachedBottom) return;
const scrolled = window.scrollY + window.innerHeight;
const total    = document.documentElement.scrollHeight;
if (scrolled >= total - 10) {
reachedBottom = true;
setTimeout(function() {
toast(‘✦ you reached the bottom. respect ✦’);
reachedBottom = false;
}, 400);
}
}, { passive: true });

/* ── TOAST ── */
function toast(msg) {
document.querySelectorAll(’.mj-toast’).forEach(function(t) { t.remove(); });
const t = document.createElement(‘div’);
t.className = ‘mj-toast’;
t.textContent = msg;
document.body.appendChild(t);
requestAnimationFrame(function() {
requestAnimationFrame(function() { t.classList.add(‘visible’); });
});
setTimeout(function() {
t.classList.remove(‘visible’);
setTimeout(function() { t.remove(); }, 500);
}, 3200);
}

window._mjToast = toast;
})();