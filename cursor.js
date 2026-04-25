/* ═══════════════════════════════════════════
   mayjune — shared cursor + easter eggs
═══════════════════════════════════════════ */

(function () {
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches || 'ontouchstart' in window;

  /* ── CURSOR ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  const halo   = document.getElementById('cursorHalo');

  if (!cursor || isMobile()) {
    if (cursor) cursor.style.display = 'none';
    if (ring)   ring.style.display   = 'none';
    if (halo)   halo.style.display   = 'none';
  } else {
    let mx = -200, my = -200;
    let rx = -200, ry = -200;
    let hx = -200, hy = -200;
    let clicking = false;
    let lastSparkTime = 0;

    // Keep cursor/ring always centred on pointer using translate3d
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;

      // Core sun — snaps instantly
      cursor.style.transform = `translate3d(${mx - 7}px, ${my - 7}px, 0)`;

      // Occasional ember sparks
      const now = Date.now();
      if (now - lastSparkTime > 60) {
        lastSparkTime = now;
        spawnSpark(mx, my);
      }
    });

    // Smooth lag for ring + halo
    function animateLag() {
      rx += (mx - rx - 22) * 0.10;
      ry += (my - ry - 22) * 0.10;
      hx += (mx - hx - 40) * 0.07;
      hy += (my - hy - 40) * 0.07;

      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (halo) halo.style.transform = `translate3d(${hx}px, ${hy}px, 0)`;
      requestAnimationFrame(animateLag);
    }
    animateLag();

    // Click burst
    document.addEventListener('mousedown', () => {
      clicking = true;
      cursor.classList.add('clicking');
      ring.classList.add('clicking');
      for (let i = 0; i < 6; i++) spawnSpark(mx, my, true);
    });
    document.addEventListener('mouseup', () => {
      clicking = false;
      cursor.classList.remove('clicking');
      ring.classList.remove('clicking');
    });

    // Hover states
    function addHoverListeners() {
      document.querySelectorAll('a, button, .card, .tag, .shop-card, .music-card, input, textarea').forEach(el => {
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
    addHoverListeners();

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      ring.style.opacity = '0';
      if (halo) halo.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      ring.style.opacity = '1';
      if (halo) halo.style.opacity = '1';
    });

    /* Spark particle */
    function spawnSpark(x, y, burst = false) {
      const s = document.createElement('div');
      s.className = 'cursor-spark';
      const colors = ['#ffd166','#ffb347','#ff6b51','#ff4d7e','#fff9e0'];
      const c = colors[Math.floor(Math.random() * colors.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist  = burst ? 30 + Math.random() * 50 : 10 + Math.random() * 20;
      s.style.cssText = `
        left: ${x}px; top: ${y}px;
        background: ${c};
        width: ${burst ? 5 : 3}px;
        height: ${burst ? 5 : 3}px;
        box-shadow: 0 0 6px 2px ${c}88;
        --tx: ${Math.cos(angle) * dist}px;
        --ty: ${Math.sin(angle) * dist}px;
        animation-duration: ${burst ? 0.8 : 0.6}s;
      `;
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
    }
  }

  /* ── STICKY NAV ── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── SCROLL FADE-IN ── */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  /* ══════════════════════════════════════════
     EASTER EGGS
  ══════════════════════════════════════════ */

  /* ── 1. KONAMI CODE → golden hour mode ── */
  // Up Up Down Down Left Right Left Right B A
  // Tints the whole page gold and shows a toast
  const konamiSeq = [38,38,40,40,37,39,37,39,66,65];
  let konamiIdx = 0;
  document.addEventListener('keydown', e => {
    if (e.keyCode === konamiSeq[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) {
        konamiIdx = 0;
        triggerGoldenHour();
      }
    } else {
      konamiIdx = 0;
    }
  });

  function triggerGoldenHour() {
    document.body.classList.toggle('golden-hour-mode');
    toast(document.body.classList.contains('golden-hour-mode')
      ? '✦ golden hour activated ✦'
      : '✦ back to the night ✦'
    );
  }

  /* ── 2. LOGO triple-click → hidden message ── */
  const logo = document.querySelector('nav h2');
  if (logo) {
    let clickCount = 0, clickTimer;
    logo.addEventListener('click', () => {
      clickCount++;
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => { clickCount = 0; }, 600);
      if (clickCount >= 3) {
        clickCount = 0;
        showSecretMessage();
      }
    });
  }

  function showSecretMessage() {
    const overlay = document.createElement('div');
    overlay.id = 'secret-overlay';
    overlay.innerHTML = `
      <div class="secret-inner">
        <p class="secret-eyebrow">✦ you found it ✦</p>
        <h2 class="secret-title">it's always<br>golden hour<br>somewhere</h2>
        <p class="secret-sub">thanks for paying attention</p>
        <button class="button secret-close">close</button>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));
    overlay.querySelector('.secret-close').addEventListener('click', () => {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 500);
    });
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 500);
      }
    });
  }

  /* ── 3. TYPING "mayjune" anywhere → pulse ── */
  let typedBuffer = '';
  document.addEventListener('keypress', e => {
    typedBuffer += e.key.toLowerCase();
    typedBuffer = typedBuffer.slice(-7);
    if (typedBuffer === 'mayjune') {
      typedBuffer = '';
      rainEmbers();
      toast('✦ hey, that\'s me ✦');
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
        s.style.cssText = `
          left: ${x}px; top: -10px;
          background: ${c};
          width: 6px; height: 6px;
          box-shadow: 0 0 8px 3px ${c}99;
          --tx: ${Math.cos(angle) * dist}px;
          --ty: ${Math.sin(angle) * dist + dist}px;
          animation-duration: 1.4s;
        `;
        document.body.appendChild(s);
        s.addEventListener('animationend', () => s.remove());
      }, i * 40);
    }
  }

  /* ── 4. HOLD SPACEBAR on index page → disco ── */
  let spaceHeld = false, discoInterval;
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !spaceHeld && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      spaceHeld = true;
      document.body.classList.add('disco-mode');
      toast('✦ drop it ✦');
    }
  });
  document.addEventListener('keyup', e => {
    if (e.code === 'Space') {
      spaceHeld = false;
      document.body.classList.remove('disco-mode');
    }
  });

  /* ── TOAST helper ── */
  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'mj-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('visible'));
    setTimeout(() => {
      t.classList.remove('visible');
      setTimeout(() => t.remove(), 500);
    }, 3200);
  }

})();