const slides = document.querySelectorAll(".slide");
const progressBar = document.querySelector(".progress-bar");
const slideDuration = 3000; // ms
let current = 0;
let isTransitioning = false;
let started = false; // buat tracking udah mulai atau belum

const blobShapes = [
  "50% 40% 60% 50%/60% 50% 40% 50%", // slide 0
  "60% 60% 40% 60%/50% 60% 50% 40%", // slide 1
  "40% 60% 50% 60%/60% 40% 60% 50%", // slide 2
  "60% 50% 60% 40%/40% 60% 50% 60%", // slide 3
  "50% 60% 40% 60%/60% 50% 60% 40%", // slide 4
];

// Setup progress bar
function renderProgressBar() {
  progressBar.innerHTML = "";
  slides.forEach((_, i) => {
    const seg = document.createElement("div");
    seg.className = "progress-segment" + (i === 0 ? " active" : "");
    seg.innerHTML = '<div class="progress-inner"></div>';
    progressBar.appendChild(seg);
  });
}

function setActiveSlide(idx) {
  if (isTransitioning || idx === current) return;
  isTransitioning = true;
  slides[current].classList.remove("active");
  slides[idx].classList.add("active");
  // Progress bar muncul pas masuk slide 1
  if (idx > 0) {
    progressBar.classList.add("show");
  } else {
    progressBar.classList.remove("show");
    started = false; // reset started biar bisa next lagi dari awal
  }
  // Ganti background body
  const bg = slides[idx].getAttribute("data-bg");
  document.body.style.background = bg;
  // Ganti blob style
  const blob = slides[idx].querySelector(".blob");
  const blobBg = slides[idx].getAttribute("data-blob");
  blob.style.background = blobBg;
  blob.style.borderRadius = blobShapes[idx % blobShapes.length];
  updateProgressBar(idx);
  setTimeout(() => {
    current = idx;
    isTransitioning = false;
  }, 150); // makin sat set
}

function updateProgressBar(idx) {
  const segments = document.querySelectorAll(".progress-segment");
  segments.forEach((seg, i) => {
    seg.classList.toggle("active", i === idx);
    seg.querySelector(".progress-inner").style.width = i < idx ? "100%" : "0%";
    // Progress bar hanya aktif kalau udah mulai dan bukan di slide 0
    if (i === idx && started && idx !== 0) {
      seg.querySelector(".progress-inner").style.animation =
        "progressBar " + slideDuration / 1000 + "s linear forwards";
    } else {
      seg.querySelector(".progress-inner").style.animation = "none";
    }
  });
}

function nextSlide() {
  if (current < slides.length - 1) {
    // Mulai progress bar pas pindah dari slide 0 ke 1
    if (!started && current === 0) {
      started = true;
      setActiveSlide(current + 1);
      return;
    }
    setActiveSlide(current + 1);
  }
}

function prevSlide() {
  if (current > 0) {
    setActiveSlide(current - 1);
  }
}

function getTapSide(e) {
  let x = 0;
  if (e.touches && e.touches.length) {
    x = e.touches[0].clientX;
  } else {
    x = e.clientX;
  }
  // Ubah logika pembagian layar, bagi 2 sama rata
  return x < window.innerWidth / 2 ? "left" : "right";
}

// Tap/click/keyboard navigation
function setupNav() {
  let touchStartX = 0;
  let touchEndX = 0;

  document.body.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    false
  );

  document.body.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    false
  );

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    const swipeThreshold = window.innerWidth * 0.2; // 20% lebar layar

    // Hindari navigasi di elemen spesifik
    const target = event.target;
    if (
      target.closest(".photo-frame") ||
      target.classList.contains("cta") ||
      target.closest(".cta")
    ) {
      return;
    }

    // Logika swipe
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe kanan (balik)
        prevSlide();
      } else {
        // Swipe kiri (maju)
        nextSlide();
      }
    }
  }

  // Tambahan click handler untuk desktop
  document.body.addEventListener("click", (e) => {
    const target = e.target;
    if (
      target.closest(".photo-frame") ||
      target.classList.contains("cta") ||
      target.closest(".cta")
    ) {
      return;
    }

    const tapX = e.clientX;
    const screenWidth = window.innerWidth;

    if (tapX < screenWidth * 0.3) {
      prevSlide();
    } else if (tapX > screenWidth * 0.7) {
      nextSlide();
    }
  });

  // Keyboard navigation tetap sama
  document.body.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });
}

// CTA button
function setupCTA() {
  const cta = document.querySelector(".cta");
  if (cta) {
    cta.addEventListener("click", () => {
      alert("Fitur share coming soon, Hadi!");
    });
  }
}

// Init
window.addEventListener("DOMContentLoaded", () => {
  renderProgressBar();
  slides[0].classList.add("active");
  // Progress bar hidden di awal
  progressBar.classList.remove("show");
  // Set bg & blob awal
  document.body.style.background = slides[0].getAttribute("data-bg");
  const blob = slides[0].querySelector(".blob");
  blob.style.background = slides[0].getAttribute("data-blob");
  blob.style.borderRadius = blobShapes[0];
  setupNav();
  setupCTA();
});
