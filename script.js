// Launchpad Studio — all interactivity (vanilla, Tailwind for layout, no build step)
(function () {
  'use strict';
  function $(s, c) { return (c || document).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 0. Launch preloader — T-minus counter, completes on window load, 6s failsafe */
  (function loader() {
    var box = document.getElementById('loader');
    if (!box) { document.body.classList.add('is-loaded'); return; }
    var pct = document.getElementById('load-pct'), fill = document.getElementById('load-fill');
    var p = 0, done = false, timer = null;
    function paint() { if (pct) pct.textContent = p; if (fill) fill.style.width = p + '%'; }
    function hide() {
      if (done) return; done = true;
      clearInterval(timer);
      p = 100; paint();
      setTimeout(function () {
        box.classList.add('loader-done');
        document.body.classList.add('is-loaded');
        setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 650);
      }, 300);
    }
    if (reduced) { hide(); return; }
    paint();
    timer = setInterval(function () { if (p < 90) { p += Math.ceil(Math.random() * 7); if (p > 90) p = 90; paint(); } }, 160);
    if (document.readyState === 'complete') setTimeout(hide, 600);
    else window.addEventListener('load', function () { setTimeout(hide, 500); });
    setTimeout(hide, 6000); // failsafe: never trap the visitor
  })();

  /* 1. Theme (default dark — night launch) */
  var themeBtn = $('#theme-toggle');
  function paintTheme(t) {
    document.documentElement.dataset.theme = t;
    document.documentElement.classList.toggle('dark', t === 'dark');
    try { localStorage.setItem('lp-theme', t); } catch (e) {}
    if (themeBtn) {
      var dark = t === 'dark';
      themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      var l = themeBtn.querySelector('.theme-label');
      var svg = themeBtn.querySelector('.theme-icon');
      if (l) l.textContent = dark ? 'Light' : 'Dark';
      if (svg) svg.innerHTML = dark
        ? '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>'
        : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';
    }
  }
  paintTheme(document.documentElement.dataset.theme || 'dark');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    paintTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    toast(document.documentElement.dataset.theme === 'dark' ? 'Night launch mode' : 'Daylight mode');
  });

  /* 2. Toast */
  var toastEl = $('#toast'), toastT = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.hidden = false;
    requestAnimationFrame(function () { toastEl.classList.add('show'); });
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); setTimeout(function(){ toastEl.hidden = true; }, 300); }, 2600);
  }

  /* 3. Mobile nav */
  var toggle = $('.nav-toggle'), menu = $('#nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $all('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* 4. Starfield + shooting stars */
  (function stars() {
    var cv = $('#starfield');
    if (!cv || reduced) return;
    var ctx = cv.getContext('2d'), W = 0, H = 0, stars = [], shoots = [], running = true;
    function isDark() { return document.documentElement.dataset.theme === 'dark'; }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function init() {
      stars = [];
      var n = W < 700 ? 90 : 180;
      for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .3, tw: Math.random() * Math.PI * 2, sp: .2 + Math.random() * .5 });
    }
    function tick(t) {
      if (running) {
        ctx.clearRect(0, 0, W, H);
        var dim = isDark() ? 1 : .28;
        for (var i = 0; i < stars.length; i++) {
          var s = stars[i];
          s.y += s.sp * .12; if (s.y > H + 4) { s.y = -4; s.x = Math.random() * W; }
          var a = dim * (.5 + .5 * Math.sin(t / 700 + s.tw));
          ctx.globalAlpha = Math.max(.06, a);
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 7); ctx.fill();
        }
        ctx.globalAlpha = 1;
        if (Math.random() < .006 && shoots.length < 3 && isDark())
          shoots.push({ x: Math.random() * W * .7 + W * .2, y: -20, vx: -6 - Math.random() * 4, vy: 3 + Math.random() * 2, life: 1 });
        for (var k = shoots.length - 1; k >= 0; k--) {
          var m = shoots[k];
          m.x += m.vx; m.y += m.vy; m.life -= .02;
          if (m.life <= 0) { shoots.splice(k, 1); continue; }
          var grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 8, m.y - m.vy * 8);
          grad.addColorStop(0, 'rgba(255,255,255,' + m.life + ')'); grad.addColorStop(1, 'rgba(255,92,26,0)');
          ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.beginPath();
          ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 8, m.y - m.vy * 8); ctx.stroke();
        }
      }
      requestAnimationFrame(tick);
    }
    resize(); init(); requestAnimationFrame(tick);
    addEventListener('resize', function () { resize(); init(); });
    document.addEventListener('visibilitychange', function () { running = !document.hidden; });
  })();

  /* 5. Scroll progress + rocket rail */
  var prog = $('#scroll-progress span'), ship = $('#rocket-ship');
  function onScrollChrome() {
    var h = document.documentElement;
    var p = h.scrollHeight - h.clientHeight > 0 ? h.scrollTop / (h.scrollHeight - h.clientHeight) : 0;
    if (prog) prog.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    if (ship) ship.style.top = (4 + p * 92) + '%';
    scrubFilm();
  }
  addEventListener('scroll', function () {
    if (window.__rAFc) cancelAnimationFrame(window.__rAFc);
    window.__rAFc = requestAnimationFrame(onScrollChrome);
  }, { passive: true });

  /* 6. Countdown to next Monday 09:00 (launch window) */
  (function countdown() {
    function next() {
      var n = new Date(), d = new Date(n);
      d.setHours(9, 0, 0, 0);
      var add = (8 - d.getDay()) % 7;
      if (add === 0 && d <= n) add = 7;
      d.setDate(d.getDate() + add);
      return d;
    }
    var target = next();
    function pad(x) { return String(x).padStart(2, '0'); }
    function tick() {
      var ms = target - new Date();
      if (ms < 0) { target = next(); ms = target - new Date(); }
      var s = Math.floor(ms / 1000);
      var set = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = pad(v); };
      set('cd-d', Math.floor(s / 86400)); set('cd-h', Math.floor(s / 3600) % 24);
      set('cd-m', Math.floor(s / 60) % 60); set('cd-s', s % 60);
    }
    tick(); setInterval(tick, 1000);
  })();

  /* 7. Higgsfield 15s scroll film — video if deployed, canvas fallback */
  var filmRoot = $('#film'), filmVideo = filmRoot ? filmRoot.querySelector('.scroll-scrub__video') : null,
      filmCanvas = filmRoot ? filmRoot.querySelector('.scroll-scrub__fallback') : null,
      hasVideo = false;
  function drawFilmFallback(p) {
    if (!filmCanvas) return;
    var host = filmCanvas.parentElement.getBoundingClientRect();
    var w = Math.max(320, host.width | 0), h = Math.max(320, host.height | 0);
    if (filmCanvas.width !== w) { filmCanvas.width = w; filmCanvas.height = h; }
    var ctx = filmCanvas.getContext('2d');
    ctx.clearRect(0, 0, w, h); // transparent — launch photo poster shows through
    var glow = ctx.createRadialGradient(w / 2, h * .8, 10, w / 2, h * .8, Math.min(w, h) * .45);
    glow.addColorStop(0, 'rgba(255,92,26,' + (0.3 + p * 0.4) + ')');
    glow.addColorStop(1, 'rgba(255,92,26,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
    // rocket rises with p, flame grows
    var cx = w / 2, y = h * .8 - p * h * .58, s = Math.min(w, h) * .075;
    ctx.save(); ctx.translate(cx, y);
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, -s * 1.7); ctx.lineTo(s * .72, -s * .2); ctx.lineTo(s * .72, s); ctx.lineTo(-s * .72, s); ctx.lineTo(-s * .72, -s * .2); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ff5c1a'; ctx.beginPath(); ctx.arc(0, -s * .2, s * .3, 0, 7); ctx.fill();
    var fl = s * (0.8 + p * 1.6 + Math.random() * .3);
    var fg = ctx.createLinearGradient(0, s, 0, s + fl * 1.8);
    fg.addColorStop(0, '#ffd76a'); fg.addColorStop(.5, '#ff5c1a'); fg.addColorStop(1, 'rgba(255,92,26,0)');
    ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(-s * .45, s); ctx.lineTo(s * .45, s); ctx.lineTo(0, s + fl * 1.8); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.font = '12px monospace';
    ctx.fillText('T+' + (p * 15).toFixed(1) + 's — scroll to fly', 16, h - 16);
  }
  function scrubFilm() {
    if (!filmRoot) return;
    var rect = filmRoot.getBoundingClientRect();
    var total = rect.height - innerHeight;
    var p = total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0;
    filmRoot.style.setProperty('--ss-progress', p.toFixed(4));
    var chaps = $all('.scroll-scrub__chapter', filmRoot), btns = $all('.scroll-scrub__route-button', filmRoot);
    var idx = Math.min(chaps.length - 1, Math.floor(p * chaps.length));
    btns.forEach(function (b, i) { if (i === idx) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    if (hasVideo && filmVideo && filmVideo.duration && isFinite(filmVideo.duration)) {
      var t = p * filmVideo.duration;
      if (Math.abs(filmVideo.currentTime - t) > .08) { try { filmVideo.currentTime = t; } catch (e) {} }
    } else drawFilmFallback(p);
  }
  if (filmVideo) {
    filmVideo.addEventListener('loadeddata', function () {
      hasVideo = true;
      try { filmVideo.pause(); } catch (e) {}
      if (filmCanvas) filmCanvas.style.display = 'none';
      scrubFilm();
    });
    filmVideo.addEventListener('error', function () { hasVideo = false; scrubFilm(); }, true);
    var primed = false;
    addEventListener('pointerdown', function prime() {
      if (primed || !hasVideo) return; primed = true;
      try { var pr = filmVideo.play(); if (pr && pr.then) pr.then(function () { filmVideo.pause(); }).catch(function () {}); } catch (e) {}
    });
    setTimeout(function () { if (!hasVideo) scrubFilm(); }, 2500);
  }
  $all('.scroll-scrub__route-button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!filmRoot) return;
      var i = parseInt(b.getAttribute('data-goto'), 10) || 0;
      var rect = filmRoot.getBoundingClientRect(), total = rect.height - innerHeight;
      var y = scrollY + rect.top + total * (i + .5) / 4;
      scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* 8. Reveals */
  var revealEls = $all('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add('is-visible'); });

  /* 9. Filters */
  var fBtns = $all('.filter-btn'), cards = $all('.work-card');
  fBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      fBtns.forEach(function (x) { x.classList.remove('is-active'); });
      b.classList.add('is-active');
      var f = b.getAttribute('data-filter');
      cards.forEach(function (c) { c.classList.toggle('is-hidden', !(f === 'all' || c.getAttribute('data-category') === f)); });
    });
  });

  /* 10. Count-up */
  function count(el) {
    var t = parseFloat(el.getAttribute('data-count'));
    if (isNaN(t)) return;
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var st = null, dur = 900;
    function step(ts) {
      if (!st) st = ts;
      var p = Math.min((ts - st) / dur, 1), v = Math.round(t * p);
      el.innerHTML = pre.replace('&lt;', '<') + v + suf;
      if (p < 1) requestAnimationFrame(step); else el.innerHTML = pre.replace('&lt;', '<') + t + suf;
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { count(e.target); cio.unobserve(e.target); } });
    }, { threshold: .6 });
    $all('[data-count]').forEach(function (c) { cio.observe(c); });
  }

  /* 11. Tilt + magnetic */
  if (matchMedia && matchMedia('(pointer:fine)').matches && !reduced) {
    $all('.tilt').forEach(function (card) {
      card.addEventListener('mousemove', function (ev) {
        var r = card.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5;
        card.style.transform = 'translateY(-6px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
    $all('.magnetic').forEach(function (b) {
      b.addEventListener('mousemove', function (ev) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((ev.clientX - r.left - r.width / 2) * .12) + 'px,' + ((ev.clientY - r.top - r.height / 2) * .18) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* 12. Mission builder */
  (function builder() {
    var root = $('.builder');
    if (!root) return;
    var step = 0, state = { craft: null, modules: [], window: null };
    var panes = $all('.bpane', root), steps = $all('.bstep', root);
    var back = $('#b-back'), next = $('#b-next'), res = $('#mission-result');
    function paint() {
      panes.forEach(function (p, i) { p.classList.toggle('is-active', i === step); });
      steps.forEach(function (s, i) {
        s.classList.toggle('is-active', i === step);
        s.setAttribute('aria-selected', i === step ? 'true' : 'false');
      });
      var fill = $('#b-fill');
      if (fill) fill.style.width = ((step + 1) / 3 * 100) + '%';
      back.disabled = step === 0;
      next.textContent = step === 2 ? 'See my mission →' : 'Next →';
    }
    $all('[data-pick]', root).forEach(function (grid) {
      var key = grid.getAttribute('data-pick'), multi = grid.classList.contains('multi');
      $all('button', grid).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var v = btn.getAttribute('data-val');
          if (multi) {
            var i = state.modules.indexOf(v);
            if (i >= 0) { state.modules.splice(i, 1); btn.classList.remove('is-picked'); }
            else { state.modules.push(v); btn.classList.add('is-picked'); }
          } else {
            state[key === 'craft' ? 'craft' : 'window'] = v;
            $all('button', grid).forEach(function (x) { x.classList.remove('is-picked'); });
            btn.classList.add('is-picked');
            if (step < 2) { step++; paint(); }
          }
        });
      });
    });
    steps.forEach(function (s) {
      s.addEventListener('click', function () { step = parseInt(s.getAttribute('data-step'), 10); paint(); });
    });
    back.addEventListener('click', function () { if (step > 0) { step--; paint(); } });
    next.addEventListener('click', function () {
      if (step < 2) { step++; paint(); return; }
      if (!state.craft) { toast('Pick a craft first'); step = 0; paint(); return; }
      if (!state.window) { toast('Pick a launch window'); return; }
      var n = 1 + state.modules.length;
      var cls = n <= 2 ? 'Scout' : n <= 4 ? 'Orbital' : 'Interstellar';
      var tl = state.window === 'ASAP' ? '3–4 days, priority queue' : state.window === 'Within 2 weeks' ? 'launch within 2 weeks' : 'flexible pad, 3–4 day build once we go';
      $('#mr-class').innerHTML = 'Mission class: <span class="mission-class-badge">' + cls + '</span>';
      $('#mr-line').textContent = state.craft + ' + ' + (state.modules.length ? state.modules.join(', ') : 'core build') + ' · Window: ' + state.window + ' → ' + tl + '.';
      res.hidden = false;
      res.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
      toast('Mission assembled ' + cls);
    });
    $('#mr-send').addEventListener('click', function () {
      var txt = 'Hi Launchpad Studio, my mission: ' + (state.craft || '?') + ' | Modules: ' + (state.modules.join(', ') || 'core') + ' | Window: ' + (state.window || '?');
      open('https://wa.me/917368849604?text=' + encodeURIComponent(txt), '_blank', 'noopener');
    });
    paint();
  })();

  /* 13. Testimonial slider */
  (function slider() {
    var slides = $all('#slider .slide');
    if (!slides.length) return;
    var dotsBox = $('#sl-dots'), idx = 0, timer = null;
    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.setAttribute('role', 'tab'); d.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
      d.addEventListener('click', function () { go(i); restart(); });
      dotsBox.appendChild(d);
    });
    var dots = $all('button', dotsBox);
    function go(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === idx); });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === idx); });
    }
    function restart() { clearInterval(timer); if (!reduced) timer = setInterval(function () { go(idx + 1); }, 6000); }
    $('#sl-prev').addEventListener('click', function () { go(idx - 1); restart(); });
    $('#sl-next').addEventListener('click', function () { go(idx + 1); restart(); });
    $('#slider').addEventListener('mouseenter', function () { clearInterval(timer); });
    $('#slider').addEventListener('mouseleave', restart);
    go(0); restart();
  })();

  /* 14. Contact form → WhatsApp + confetti toast */
  var form = $('#contact-form');
  if (form) {
    var status = $('#form-status');
    function bad(id, isBad) {
      var inp = document.getElementById(id);
      var err = document.querySelector('[data-error-for="' + id + '"]');
      if (err) err.hidden = !isBad;
      if (inp) inp.setAttribute('aria-invalid', isBad ? 'true' : 'false');
      return !isBad;
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = $('#cf-name').value.trim(), email = $('#cf-email').value.trim();
      var type = $('#cf-type').value, budget = $('#cf-budget').value, msg = $('#cf-msg').value.trim();
      var ok = true;
      ok = bad('cf-name', name.length < 2) && ok;
      ok = bad('cf-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) && ok;
      ok = bad('cf-type', !type) && ok;
      ok = bad('cf-budget', !budget) && ok;
      ok = bad('cf-msg', msg.length < 10) && ok;
      if (!ok) { if (status) { status.hidden = false; status.textContent = 'Check the highlighted fields — then we clear you in 24h.'; } return; }
      var btn = $('#launch-btn');
      if (btn) { btn.textContent = 'Ignition… 3… 2… 1…'; btn.disabled = true; }
      setTimeout(function () {
        var txt = 'Hi Launchpad Studio, I am ' + name + ' (' + email + '). Mission: ' + type + ' | Fuel: ' + budget + ' | Brief: ' + msg;
        open('https://wa.me/917368849604?text=' + encodeURIComponent(txt), '_blank', 'noopener');
        if (status) { status.hidden = false; status.textContent = 'Liftoff, ' + name + '! Brief sent — we reply with a fixed quote in 24h (or email 7091331316neeraj@gmail.com).'; }
        toast('Request launched — we reply in 24h');
        if (btn) { btn.textContent = 'Launch request — quote in 24h'; btn.disabled = false; }
        form.reset();
      }, 900);
    });
  }

  onScrollChrome();
})();
