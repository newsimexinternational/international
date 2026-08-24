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
  if (window.scrollY > 400) backToTop?.classList.add('visible');
  else backToTop?.classList.remove('visible');
});

backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

if (acceptCookies) {
  acceptCookies.addEventListener('click', () => {
    document.cookie = 'newsimex_cookies=accepted; max-age=' + 60 * 60 * 24 * 365 + '; path=/; SameSite=Lax';
    cookieBanner?.classList.add('hidden');
  });
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => mainNav?.classList.toggle('open'));
}

if (cookieBanner) {
  const cookies = document.cookie.split('; ').find(row => row.startsWith('newsimex_cookies='));
  if (cookies) cookieBanner.classList.add('hidden');
}

if ('IntersectionObserver' in window) {
  const scrollObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('section').forEach(section => scrollObserver.observe(section));
}

// Submit Contact and Request Quote forms to the Google Apps Script web app.
document.querySelectorAll('[data-secure-form]').forEach(form => {
  form.addEventListener('submit', async event => {
    event.preventDefault();

    const status = form.querySelector('[data-form-status]');
    const button = form.querySelector('button[type="submit"]');
    const endpoint = form.dataset.endpoint;

    if (!endpoint) {
      if (status) status.textContent = 'Online submission is temporarily unavailable. Please contact us by email or WhatsApp.';
      return;
    }

    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    if (data.website) return;

    if (status) {
      status.textContent = 'Submitting…';
      status.classList.remove('success', 'error');
    }
    if (button) button.disabled = true;

    try {
      // text/plain avoids an unnecessary CORS preflight with Apps Script.
      // no-cors is required because Apps Script redirects its web-app response.
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });

      if (status) {
        status.textContent = 'Thank you. Your request has been submitted.';
        status.classList.add('success');
      }
      form.reset();
    } catch (error) {
      console.error('Form submission failed:', error);
      if (status) {
        status.textContent = 'We could not submit your request. Please email or WhatsApp us instead.';
        status.classList.add('error');
      }
    } finally {
      if (button) button.disabled = false;
    }
  });
});
