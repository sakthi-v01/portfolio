// Scroll-triggered fade-ins
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.fade-in').forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 60, 300)}ms`;
  observer.observe(el);
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Toast =====
let toastTimer;
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
}

// ===== Contact form ("Let's talk") =====
// If the <form> has a data-endpoint (e.g. a Formspree URL), the message is delivered
// there and lands in the inbox — works for every visitor, no mail app needed.
// Without an endpoint it falls back to opening the visitor's mail app (mailto:).
const MAIL_TO = 'sakthivelrathinavel0@gmail.com';
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  const sendBtn = contactForm.querySelector('button[type="submit"]');

  const openMailApp = (name, email, message) => {
    const subject = `Portfolio message from ${name}`;
    const body = `${message}\n\n—\n${name}\n${email}`;
    // The visitor typed this message themselves, so keep a copy in their clipboard
    // in case no mail app opens.
    if (navigator.clipboard) navigator.clipboard.writeText(`To: ${MAIL_TO}\nSubject: ${subject}\n\n${body}`).catch(() => {});
    window.location.href = `mailto:${MAIL_TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    showToast("Opening your mail app — I also copied your note, in case it doesn't open.");
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();
    if (!name || !email || !message) return;

    // Hidden "trap" field: real visitors never see or fill it; bots do. Pretend it worked, send nothing.
    if (contactForm.elements._gotcha && contactForm.elements._gotcha.value) {
      contactForm.reset();
      return showToast("Thanks — your message is on its way. I'll reply soon.");
    }

    const endpoint = (contactForm.dataset.endpoint || '').trim();
    if (!endpoint) return openMailApp(name, email, message);

    // Works with Web3Forms (needs data-access-key), FormSubmit and Formspree.
    const accessKey = (contactForm.dataset.accessKey || '').trim();
    const subject = `Portfolio message from ${name}`;
    // Web3Forms wants `subject`; Formspree/FormSubmit want `_subject`. Send only what the provider uses.
    const payload = accessKey
      ? { access_key: accessKey, from_name: `Portfolio · ${name}`, subject, name, email, message }
      : { _subject: subject, name, email, message };

    sendBtn.disabled = true;
    const label = sendBtn.textContent;
    sendBtn.textContent = 'Sending…';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('bad status ' + res.status);
      // Some providers answer HTTP 200 with {"success": false} on rejection.
      const reply = await res.json().catch(() => ({}));
      if (reply.success === false || reply.success === 'false') throw new Error('rejected');
      contactForm.reset();
      showToast("Thanks — your message is on its way. I'll reply soon.");
    } catch (err) {
      showToast("Couldn't send that directly — opening your mail app instead.");
      openMailApp(name, email, message);
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = label;
    }
  });
}

// ===== Mobile / tablet side nav (hamburger) =====
const navToggle = document.getElementById('navToggle');
const navDrawer = document.getElementById('navDrawer');
const navOverlay = document.getElementById('navOverlay');
if (navToggle && navDrawer && navOverlay) {
  navToggle.setAttribute('aria-controls', 'navDrawer');
  navToggle.setAttribute('aria-expanded', 'false');

  const setNav = (open, returnFocus) => {
    navDrawer.classList.toggle('open', open);
    navToggle.classList.toggle('open', open);
    navOverlay.classList.toggle('open', open);
    document.documentElement.classList.toggle('nav-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      const first = navDrawer.querySelector('a');
      if (first) setTimeout(() => first.focus(), 50);
    } else if (returnFocus) {
      navToggle.focus();
    }
  };

  navToggle.addEventListener('click', () => setNav(!navDrawer.classList.contains('open'), true));
  navOverlay.addEventListener('click', () => setNav(false, true));
  navDrawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setNav(false, false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('open')) setNav(false, true);
  });
}
