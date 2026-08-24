const loadingScreen = document.getElementById('loading-screen');
const backToTop = document.querySelector('.back-to-top');
const cookieBanner = document.getElementById('cookieBanner');
const acceptCookies = document.getElementById('acceptCookies');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

window.addEventListener('load', () => {
  if (loadingScreen) {
    loadingScreen.classList.add('loaded');
    setTimeout(() => loadingScreen.remove(), 500);
  }
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

if (acceptCookies) {
  acceptCookies.addEventListener('click', () => {
    document.cookie = 'newsimex_cookies=accepted; max-age=' + 60 * 60 * 24 * 365 + '; path=/';
    cookieBanner?.classList.add('hidden');
  });
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    mainNav?.classList.toggle('open');
  });
}

if (cookieBanner) {
  const cookies = document.cookie.split('; ').find(row => row.startsWith('newsimex_cookies='));
  if (cookies) {
    cookieBanner.classList.add('hidden');
  }
}

const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  scrollObserver.observe(section);
});
