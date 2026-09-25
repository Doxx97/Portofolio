// ====== KIRIM FORM KE GOOGLE SHEET ======
const scriptURL = 'https://script.google.com/macros/s/AKfycbynMnPeENDJpGXX0jOZ4Lu52LjP4WizKfB_ZchvpK11e6kSldrq8PYBZl12qKqG9s3N/exec';
const form = document.forms['submit-to-google-sheet'];
const btnKirim = document.querySelector('.btn-kirim');
const btnLoading = document.querySelector('.btn-loading');

// catat waktu halaman dimuat, dipakai untuk deteksi bot yang submit terlalu cepat
document.getElementById('loadedAt').value = Date.now();
const MIN_FILL_TIME_MS = 3000; // manusia butuh minimal ~3 detik untuk isi form

function showPopup(type, message) {
  const popup = document.getElementById('popupAlert');
  const popupBox = popup.querySelector('.popup-box');
  const popupIcon = document.getElementById('popupIcon');
  const popupMessage = document.getElementById('popupMessage');

  popup.classList.remove('d-none');
  popupBox.className = `popup-box ${type}`;
  popupMessage.textContent = message;

  popupIcon.innerHTML = type === 'success' ? '<i class="bi bi-check-circle-fill"></i>' : '<i class="bi bi-x-circle-fill"></i>';

  setTimeout(() => {
    popup.classList.add('d-none');
  }, 2500);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nama = form.nama.value.trim();
  const email = form.email.value.trim();
  const pesan = form.pesan.value.trim();
  const honeypot = form.website.value.trim();
  const loadedAt = Number(form.loadedAt.value);
  const elapsed = Date.now() - loadedAt;

  if (!nama || !email || !pesan) {
    showPopup('error', 'Semua kolom harus diisi!');
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showPopup('error', 'Format email tidak valid!');
    return;
  }

  // bot terdeteksi: pura-pura sukses supaya bot tidak tahu ia diblokir, tapi tidak benar-benar mengirim apa pun
  if (honeypot || elapsed < MIN_FILL_TIME_MS) {
    showPopup('success', 'Pesan berhasil dikirim!');
    form.reset();
    document.getElementById('loadedAt').value = Date.now();
    return;
  }

  btnKirim.classList.add('d-none');
  btnLoading.classList.remove('d-none');

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then((response) => response.json())
    .then((data) => {
      btnKirim.classList.remove('d-none');
      btnLoading.classList.add('d-none');
      if (data.result === 'success') {
        showPopup('success', 'Pesan berhasil dikirim!');
        form.reset();
      } else {
        showPopup('error', data.message || 'Pesan gagal dikirim, coba lagi.');
      }
      document.getElementById('loadedAt').value = Date.now();
    })
    .catch((error) => {
      btnKirim.classList.remove('d-none');
      btnLoading.classList.add('d-none');
      showPopup('error', 'Terjadi kesalahan, coba lagi!');
      console.error('Error!', error.message);
    });
});

// ====== DARK MODE ======
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function getStoredTheme() {
  try {
    return localStorage.getItem('theme');
  } catch (e) {
    return null;
  }
}

function storeTheme(value) {
  try {
    localStorage.setItem('theme', value);
  } catch (e) {
    /* localStorage tidak tersedia, tema hanya berlaku untuk sesi ini */
  }
}

function applyTheme(theme) {
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme');
  }
}

const savedTheme = getStoredTheme();
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  const next = isDark ? 'light' : 'dark';
  applyTheme(next);
  storeTheme(next);
});

// ====== MOBILE NAV TOGGLE ======
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ====== ANIMASI HERO SAAT HALAMAN DIMUAT ======
window.addEventListener('load', () => {
  ['.hero-role', '.hero-name', '.hero-desc', '.hero-actions', '.hero-photo img'].forEach((selector, i) => {
    const el = document.querySelector(selector);
    if (!el) return;
    setTimeout(() => el.classList.add('show'), i * 120);
  });
});

// ====== SCROLL REVEAL UNTUK SECTION & PROJECT CARD ======
const revealTargets = document.querySelectorAll('#about, #projects, #contact, .project-card');
revealTargets.forEach((el) => el.classList.add('reveal'));

const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.12}s`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

revealTargets.forEach((el) => revealObserver.observe(el));

// ====== ACTIVE NAV LINK SAAT SCROLL ======
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
);

sections.forEach((section) => navObserver.observe(section));

// ====== BACK TO TOP BUTTON ======
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ====== ANIMASI PROGRESS BAR SKILL ======
const progressBars = document.querySelectorAll('.progress-bar');

const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute('data-width');
        progressObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 },
);

progressBars.forEach((bar) => progressObserver.observe(bar));

// ====== PASTIKAN HALAMAN SELALU MULAI DARI ATAS ======
window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

window.addEventListener('load', () => {
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 10);
});
