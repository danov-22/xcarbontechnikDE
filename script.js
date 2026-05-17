/* ===== XCARBONTECHNIK — script.js ===== */

/* ══════════════════════════════════════
   CONFIG — update these before going live
══════════════════════════════════════ */
const CONFIG = {
  whatsappNumber: '4915234567890',   // Replace with real WhatsApp number (country code + number, no +)
  emailTo: 'info@xcarbontechnik.de', // Replace with real email address
  // To enable real email sending, sign up at https://formspree.io and paste your form ID below:
  formspreeId: '',  // e.g. 'xpznqrly'
};

/* ══════════════════════════════════════
   GALLERY DATA
══════════════════════════════════════ */
const GALLERY_IMAGES = [
  { src: 'images/cylinder-red.png',    caption: 'Xcarbontechnik Type 4 CNG Cylinder — Full Product View' },
  { src: 'images/cylinder-parts.png',  caption: 'Outer Shell (HDPE Liner) and Carbon Fibre Body — Side by Side' },
  { src: 'images/valve-top.jpg',       caption: 'ISO 10297 Certified Valve Assembly — Top View' },
  { src: 'images/valve-closeup.png',   caption: 'Precision Valve Detail — ISO 10297, Made in France' },
  { src: 'images/cylinder-car.jpg',    caption: 'Field Application — Type 4 CNG Cylinder in Use' },
];

/* ══════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════ */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxCap   = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev  = document.getElementById('lightbox-prev');
const lightboxNext  = document.getElementById('lightbox-next');

let currentIndex = 0;

function openLightbox(index) {
  currentIndex = ((index % GALLERY_IMAGES.length) + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  const item = GALLERY_IMAGES[currentIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.caption;
  lightboxCap.textContent = item.caption;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  // Allow transition to finish before clearing src
  setTimeout(() => {
    if (!lightbox.classList.contains('active')) {
      lightboxImg.src = '';
    }
  }, 350);
}

function navigateLightbox(direction) {
  openLightbox(currentIndex + direction);
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   navigateLightbox(-1);
  if (e.key === 'ArrowRight')  navigateLightbox(1);
});

// Bind all gallery triggers
document.querySelectorAll('.gallery-trigger').forEach((el) => {
  el.addEventListener('click', () => {
    const idx = parseInt(el.dataset.index, 10);
    openLightbox(idx);
  });
  el.style.cursor = 'pointer';
});

/* ══════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ══════════════════════════════════════
   SCROLL REVEAL (IntersectionObserver)
══════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .stagger').forEach((el) => {
  revealObserver.observe(el);
});

/* ══════════════════════════════════════
   VOLUME RANGE BAR ANIMATION
══════════════════════════════════════ */
const rangeFill = document.getElementById('range-fill');
if (rangeFill) {
  const rangeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            rangeFill.style.width = '100%';
          }, 200);
          rangeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  rangeObserver.observe(rangeFill.closest('.range-bar-wrap'));
}

/* ══════════════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════════════ */
const toastEl = document.getElementById('toast');
let toastTimer = null;

function showToast(message, duration = 4000) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, duration);
}

/* ══════════════════════════════════════
   CONTACT FORM SUBMISSION
══════════════════════════════════════ */
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = contactForm.querySelector('.form-submit');
  const originalText = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  const data = {
    name:     `${contactForm.fname.value} ${contactForm.lname.value}`.trim(),
    email:    contactForm.email.value,
    company:  contactForm.company.value,
    interest: contactForm.interest.value,
    volume:   contactForm.volume.value,
    message:  contactForm.message.value,
  };

  if (CONFIG.formspreeId) {
    /* ── Send via Formspree ── */
    try {
      const res = await fetch(`https://formspree.io/f/${CONFIG.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        showToast('✓ Enquiry sent! We will reply within one business day.');
        contactForm.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      showToast('⚠ Could not send. Please email us directly at ' + CONFIG.emailTo);
    }
  } else {
    /* ── Fallback: open mailto ── */
    const body = [
      `Name: ${data.name}`,
      `Company: ${data.company || 'N/A'}`,
      `Interest: ${data.interest}`,
      `Volume required: ${data.volume || 'Not specified'}`,
      '',
      data.message,
    ].join('\n');

    const mailtoLink =
      `mailto:${CONFIG.emailTo}` +
      `?subject=${encodeURIComponent('Xcarbontechnik Enquiry — ' + data.interest)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
    showToast('✓ Opening your email client…');
  }

  btn.textContent = originalText;
  btn.disabled = false;
});

/* ══════════════════════════════════════
   WHATSAPP NUMBER SYNC
   (keeps the nav CTA and contact button in sync with CONFIG)
══════════════════════════════════════ */
document.querySelectorAll('.whatsapp-btn').forEach((btn) => {
  const url = new URL(btn.href);
  const msg = url.searchParams.get('text') || '';
  btn.href =
    `https://wa.me/${CONFIG.whatsappNumber}` +
    `?text=${encodeURIComponent(msg || 'Hello, I am interested in your Type 4 CNG Cylinders.')}`;
});

/* ══════════════════════════════════════
   SMOOTH ACTIVE NAV HIGHLIGHT
══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinkItems.forEach((a) => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--red-light)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-30% 0px -60% 0px' }
);

sections.forEach((s) => sectionObserver.observe(s));

/* ══════════════════════════════════════
   NAV BACKGROUND on scroll
══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 40) {
    nav.style.background = 'rgba(10, 13, 16, 0.97)';
  } else {
    nav.style.background = 'rgba(17, 20, 24, 0.92)';
  }
}, { passive: true });
