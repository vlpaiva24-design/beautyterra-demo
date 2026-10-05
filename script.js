'use strict';
const header = document.querySelector('[data-header]');
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#mobile-menu');
const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Открыть меню');
  menu.hidden = true;
  document.body.classList.remove('menu-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.setAttribute('aria-label', open ? 'Открыть меню' : 'Закрыть меню');
  menu.hidden = open;
  document.body.classList.toggle('menu-open', !open);
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 1020) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) { closeMenu(); toggle.focus(); } });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  reveals.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
  reveals.forEach(el => observer.observe(el));
}

const parallaxImage = document.querySelector('[data-parallax]');
if (parallaxImage && !reducedMotion && window.matchMedia('(min-width: 721px)').matches) {
  let ticking = false;
  const updateParallax = () => {
    const rect = parallaxImage.parentElement.getBoundingClientRect();
    const viewport = window.innerHeight;
    if (rect.bottom > 0 && rect.top < viewport) {
      const offset = ((rect.top + rect.height / 2) - viewport / 2) / viewport;
      parallaxImage.style.transform = 'translateY(' + (-4 + offset * 5) + '%)';
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; } }, { passive: true });
  updateParallax();
}

document.querySelectorAll('.accordion details').forEach(detail => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.accordion details[open]').forEach(other => { if (other !== detail) other.open = false; });
  });
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
