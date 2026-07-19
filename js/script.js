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


// Versteckter Zugang zur internen Notizseite – Version 1.3
const secretLogo = document.getElementById('footer-secret-logo');
if (secretLogo) {
  let pressTimer;
  let didOpen = false;

  const openNotes = () => {
    if (didOpen) return;
    didOpen = true;
    window.location.href = 'notiz/';
  };

  const startPress = (event) => {
    didOpen = false;
    pressTimer = window.setTimeout(openNotes, 2500);
    if (event.type === 'touchstart') event.preventDefault();
  };

  const cancelPress = () => window.clearTimeout(pressTimer);

  secretLogo.addEventListener('touchstart', startPress, { passive: false });
  secretLogo.addEventListener('touchend', cancelPress);
  secretLogo.addEventListener('touchcancel', cancelPress);
  secretLogo.addEventListener('mousedown', startPress);
  secretLogo.addEventListener('mouseup', cancelPress);
  secretLogo.addEventListener('mouseleave', cancelPress);
  secretLogo.addEventListener('dblclick', openNotes);
  secretLogo.addEventListener('contextmenu', event => event.preventDefault());
}
