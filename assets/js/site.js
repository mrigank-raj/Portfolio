// Shared motion: scroll progress on the nav, card spotlight, and count-up metrics.
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress: a burgundy line that traces the nav pill's outline, clockwise from top centre.
  const nav = document.querySelector('.nav-wrap nav');
  if (nav) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'nav-progress');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('preserveAspectRatio', 'none');
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('pathLength', '1');
    svg.appendChild(path);
    nav.appendChild(svg);
    const shape = () => {
      const w = nav.offsetWidth, h = nav.offsetHeight, x0 = 1.25, y0 = 1.25, x1 = w - 1.25, y1 = h - 1.25, r = (y1 - y0) / 2;
      svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      path.setAttribute('d', 'M' + w / 2 + ',' + y0 + ' H' + (x1 - r) + ' A' + r + ',' + r + ' 0 0 1 ' + (x1 - r) + ',' + y1 +
        ' H' + (x0 + r) + ' A' + r + ',' + r + ' 0 0 1 ' + (x0 + r) + ',' + y0 + ' Z');
    };
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      path.style.strokeDashoffset = 1 - p;
      svg.classList.toggle('done', p > 0.995);
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(shape).observe(nav); else window.addEventListener('resize', shape);
    window.addEventListener('resize', update);
    shape(); update();
  }

  // Heading underlines paint in as each heading scrolls into view.
  if (!reduce && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion');
    const heads = document.querySelectorAll('.sec-h2, .tools-center-text h2, .ct-h');
    const ho = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('drawn'); ho.unobserve(e.target); }
    }), { threshold: 0.6 });
    heads.forEach(h => { if (h.querySelector('em')) ho.observe(h); });
  }

  // Active section: the nav link for the section in the middle of the screen turns burgundy.
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  if (links.length && 'IntersectionObserver' in window) {
    const byId = new Map(links.map(l => [l.getAttribute('href').slice(1), l]));
    const so = new IntersectionObserver(es => es.forEach(e => {
      const link = byId.get(e.target.id);
      if (link) link.classList.toggle('active', e.isIntersecting);
    }), { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => { const sec = document.getElementById(id); if (sec) so.observe(sec); });
  }

  // Footer name: letters rise one by one when the footer comes into view.
  const giant = document.querySelector('.footer-giant-title');
  if (giant && !reduce && 'IntersectionObserver' in window) {
    const text = giant.textContent.trim();
    giant.setAttribute('aria-label', text);
    giant.innerHTML = [...text].map((ch, i) =>
      '<span class="fl" aria-hidden="true" style="--d:' + (i * 0.035).toFixed(3) + 's">' + (ch === ' ' ? '&nbsp;' : ch) + '</span>').join('');
    const fo = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { giant.classList.add('risen'); fo.unobserve(giant); }
    }), { threshold: 0.4 });
    fo.observe(giant);
  }

  // Spotlight: a soft glow follows the cursor across case study cards.
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.cs-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  // Count-up: project metrics climb from zero the first time they scroll into view.
  const figs = document.querySelectorAll('.dl-fig');
  if (!figs.length || reduce || !('IntersectionObserver' in window)) return;
  const NUM = /\d+(?:\.\d+)?/g;
  const run = el => {
    const final = el.textContent;
    const start = performance.now(), dur = 1300;
    const step = now => {
      const t = Math.min(Math.max((now - start) / dur, 0), 1), k = 1 - Math.pow(1 - t, 3);
      el.textContent = final.replace(NUM, m => {
        const dp = (m.split('.')[1] || '').length;
        return (parseFloat(m) * k).toFixed(dp);
      });
      if (t < 1) requestAnimationFrame(step); else el.textContent = final;
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  figs.forEach(f => io.observe(f));
})();
