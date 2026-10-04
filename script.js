(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const story = document.querySelector('.painting-story');
  const stages = [...document.querySelectorAll('.story-stage')];
  const count = document.querySelector('.stage-count');
  const sections = [...document.querySelectorAll('.section-track')];
  const navDots = [...document.querySelectorAll('.section-progress .hex')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;
  const clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));

  function update() {
    const y = scrollY;
    const maxScroll = document.documentElement.scrollHeight - innerHeight;
    root.style.setProperty('--page-progress', (clamp(y / maxScroll) * 100) + '%');
    if (!reduce.matches) {
      const hp = clamp(y / Math.max(hero.offsetHeight, 1));
      hero.style.setProperty('--hero-drift', (hp * 5) + 'vw');
      hero.style.setProperty('--hero-scale', String(1 + hp * .055));
      const rect = story.getBoundingClientRect();
      const range = story.offsetHeight - innerHeight;
      const p = clamp(-rect.top / Math.max(range, 1));
      story.style.setProperty('--paint-scale', String(1.08 + p * .11));
      story.style.setProperty('--paint-y', ((p - .5) * 3) + '%');
      story.style.setProperty('--card-rotate', ((p - .5) * 3.2) + 'deg');
      story.style.setProperty('--card-scale', String(.96 + Math.sin(p * Math.PI) * .07));
      const active = Math.min(2, Math.floor(p * 3));
      stages.forEach((stage, i) => stage.classList.toggle('is-active', i === active));
      count.textContent = '0' + (active + 1) + ' / 03';
    }
    let current = 0;
    sections.forEach((section, i) => {
      const r = section.getBoundingClientRect();
      if (r.top <= innerHeight * .55 && r.bottom >= innerHeight * .35) current = i;
    });
    navDots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  reduce.addEventListener?.('change', update);
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
  }, { threshold: .13 });
  document.querySelectorAll('.directions,.procedures,.solutions').forEach(el => observer.observe(el));
  update();
})();
