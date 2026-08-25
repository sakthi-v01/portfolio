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
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ===== mailto links: open mail client AND copy address as a fallback =====
// A plain mailto anchor gives no feedback if the OS has no mail client
// configured, so it looks "broken" even though the link itself is correct.
document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
  link.addEventListener('click', () => {
    const email = link.href.replace('mailto:', '').split('?')[0];
    if (navigator.clipboard) {
      navigator.clipboard.writeText(decodeURIComponent(email)).then(() => {
        showToast(`Opening your mail app — copied ${decodeURIComponent(email)} too, just in case`);
      }).catch(() => {});
    }
  });
});

// ===== Contact form ("Let's talk") =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const message = document.getElementById('cf-message').value.trim();
    if (!name || !email || !message) return;

    const to = 'sakthivelrathinavel0@gmail.com';
    const subject = `Portfolio message from ${name}`;
    const body = `${message}\n\n—\n${name}\n${email}`;
    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const fullText = `To: ${to}\nSubject: ${subject}\n\n${body}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullText).catch(() => {});
    }

    window.location.href = mailtoUrl;
    showToast("Opening your mail app — copied the note too, in case it doesn't open");
  });
}
