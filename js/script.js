const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const header = document.querySelector('.site-header');

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a, .start-link').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', setHeader, { passive: true });
setHeader();

document.querySelectorAll('.image-switch').forEach(area => {
  area.addEventListener('click', () => area.classList.toggle('is-switched'));
  area.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      area.classList.toggle('is-switched');
    }
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
