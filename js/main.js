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

  // Modifikasi logic progress bar biar selalu visible di mobile
  if (window.innerWidth <= 600) {
    progressBar.classList.add("show");
  } else {
    // Logic lama untuk desktop
    if (idx >= 0 && started) {
      progressBar.classList.add("show");
    } else if (idx === 0 && !started) {
      progressBar.classList.remove("show");
    } else if (idx > 0 && !started) {
      started = true;
      progressBar.classList.add("show");
    }
  }

  // Sisanya tetap sama
  if (idx === 0) {
    started = false;
  }

  const bg = slides[idx].getAttribute("data-bg");
  document.body.style.background = bg;
  const blob = slides[idx].querySelector(".blob");
  const blobBg = slides[idx].getAttribute("data-blob");
  blob.style.background = blobBg;
  blob.style.borderRadius = blobShapes[idx % blobShapes.length];
  updateProgressBar(idx);
  setTimeout(() => {
    current = idx;
    isTransitioning = false;
  }, 150);
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
  // Handler untuk tap/click navigasi
  function handleNavigation(e) {
    // Hindari navigasi di elemen spesifik
    if (
      e.target.closest(".photo-frame") ||
      e.target.classList.contains("cta") ||
      e.target.closest(".cta")
    )
      return;

    // Dapatkan posisi tap
    const tapX = e.touches ? e.touches[0].clientX : e.clientX;
    const screenWidth = window.innerWidth;

    // Bagi layar jadi 2 zona
    if (tapX < screenWidth * 0.4) {
      // Tap kiri: balik slide
      prevSlide();
    } else if (tapX > screenWidth * 0.6) {
      // Tap kanan: maju slide
      nextSlide();
    }
  }

  // Touch events untuk mobile
  document.body.addEventListener("touchend", handleNavigation);

  // Click events untuk desktop dan mobile
  document.body.addEventListener("click", handleNavigation);

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

// Tambahkan fungsi untuk membuat navigation hint
function createNavigationHint() {
  // Hapus next-hint lama
  const oldHint = document.querySelector(".next-hint");
  if (oldHint) oldHint.remove();

  // Buat kontainer hint navigasi baru
  const navigationHint = document.createElement("div");
  navigationHint.className = "navigation-hint";

  // Buat arrows
  const arrowsContainer = document.createElement("div");
  arrowsContainer.className = "navigation-hint-arrows";

  const leftArrow = document.createElement("div");
  leftArrow.className = "navigation-hint-arrow left";

  const rightArrow = document.createElement("div");
  rightArrow.className = "navigation-hint-arrow";

  arrowsContainer.appendChild(leftArrow);
  arrowsContainer.appendChild(rightArrow);

  // Buat 3 icon hint
  const progressContainer = document.createElement("div");
  progressContainer.className = "navigation-hint-progress";

  const leftIcon = document.createElement("div");
  leftIcon.className = "navigation-hint-icon";

  const centerIcon = document.createElement("div");
  centerIcon.className = "navigation-hint-icon active";

  const rightIcon = document.createElement("div");
  rightIcon.className = "navigation-hint-icon";

  progressContainer.appendChild(leftIcon);
  progressContainer.appendChild(centerIcon);
  progressContainer.appendChild(rightIcon);

  // Buat teks hint
  const hintText = document.createElement("div");
  hintText.className = "navigation-hint-text";
  hintText.textContent = "Tap kanan!";

  // Susun elemen
  navigationHint.appendChild(arrowsContainer);
  navigationHint.appendChild(progressContainer);
  navigationHint.appendChild(hintText);

  // Tambahkan ke body
  document.body.appendChild(navigationHint);

  // Animasi hint
  requestAnimationFrame(() => {
    navigationHint.classList.add("show");
  });

  // Hilangkan hint setelah beberapa saat
  setTimeout(() => {
    navigationHint.classList.remove("show");
    navigationHint.classList.add("hide");

    // Hapus elemen setelah animasi selesai
    setTimeout(() => {
      navigationHint.remove();
    }, 500);
  }, 5000); // Diperpanjang dari 3000 menjadi 5000 milidetik (5 detik)
}

// Modifikasi init untuk menambahkan navigation hint
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

  // Tambahkan navigation hint untuk mobile
  if (window.innerWidth <= 600) {
    createNavigationHint();
  }
});

// Ganti foto per slide secara dinamis
function gantiFoto(slideIndex, fotoArr) {
  // slideIndex mulai dari 1 (bukan 0)
  fotoArr.forEach((src, i) => {
    const img = document.querySelector(
      `img[data-foto='${slideIndex}-${i + 1}']`
    );
    if (img) img.src = src;
  });
}

// Contoh pemakaian:
// gantiFoto(2, [
//   'foto/foto2.jpg', 'foto/foto3.jpg', 'foto/foto4.jpg', 'foto/foto5.jpg', 'foto/foto6.jpg',
//   'foto/foto7.jpg', 'foto/foto8.jpg', 'foto/foto9.jpg', 'foto/foto10.jpg', 'foto/foto11.jpg'
// ]);
// Panggil function ini kapan aja buat update foto di slide tertentu
