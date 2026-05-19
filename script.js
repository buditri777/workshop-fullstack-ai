// ====== Slide Navigation ======
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSlideEl = document.getElementById('currentSlide');
const totalSlidesEl = document.getElementById('totalSlides');
const progressBar = document.getElementById('progressBar');

let currentSlide = 0;
const totalSlides = slides.length;

totalSlidesEl.textContent = totalSlides;

function showSlide(n) {
  if (n < 0) n = 0;
  if (n >= totalSlides) n = totalSlides - 1;

  slides.forEach(s => s.classList.remove('active'));
  slides[n].classList.add('active');
  currentSlide = n;
  currentSlideEl.textContent = n + 1;

  // Progress bar
  const progress = ((n + 1) / totalSlides) * 100;
  progressBar.style.width = progress + '%';

  // URL hash
  history.replaceState(null, null, `#${n + 1}`);
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
}

function prevSlide() {
  if (currentSlide > 0) showSlide(currentSlide - 1);
}

// Button clicks
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
    e.preventDefault();
    nextSlide();
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    prevSlide();
  } else if (e.key === 'Home') {
    e.preventDefault();
    showSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault();
    showSlide(totalSlides - 1);
  } else if (e.key === 'f' || e.key === 'F') {
    e.preventDefault();
    toggleFullscreen();
  }
});

// Touch swipe
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const dx = touchStartX - e.changedTouches[0].screenX;
  const dy = touchStartY - e.changedTouches[0].screenY;

  // Only horizontal swipe (dominant axis)
  if (Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 50) {
    if (dx > 0) nextSlide();
    else prevSlide();
  }
}, { passive: true });

// Fullscreen
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}

// Fullscreen button
const fsBtn = document.getElementById('fsBtn');
if (fsBtn) {
  fsBtn.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    fsBtn.classList.toggle('active-fs', !!document.fullscreenElement);
  });
}

// Init from hash
const hash = window.location.hash.slice(1);
const initSlide = hash ? parseInt(hash) - 1 : 0;
showSlide(initSlide);
