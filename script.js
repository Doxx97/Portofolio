// ====== KIRIM FORM KE GOOGLE SHEET ======
const scriptURL = 'https://script.google.com/macros/s/AKfycbwUsuHqu6O4GBLyEnIQvxhpwK4n8bwUpfCUGFjTIrfisi0iDtkv9FV_j1x8_pMDfci59w/exec';
const form = document.forms['submit-to-google-sheet'];
const btnKirim = document.querySelector('.btn-kirim');
const btnLoading = document.querySelector('.btn-loading');

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

  if (!nama || !email || !pesan) {
    showPopup('error', 'Semua kolom harus diisi!');
    return;
  }

  btnKirim.classList.add('d-none');
  btnLoading.classList.remove('d-none');

  fetch(scriptURL, { method: 'POST', body: new FormData(form) })
    .then(() => {
      btnKirim.classList.remove('d-none');
      btnLoading.classList.add('d-none');
      showPopup('success', 'Pesan berhasil dikirim!');
      form.reset();
    })
    .catch((error) => {
      btnKirim.classList.remove('d-none');
      btnLoading.classList.add('d-none');
      showPopup('error', 'Terjadi kesalahan, coba lagi!');
      console.error('Error!', error.message);
    });
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
