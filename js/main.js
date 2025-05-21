class Slideshow {
  constructor() {
    this.slides = document.querySelectorAll(".slide");
    this.progressBar = document.querySelector(".progress-bar");
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.slideDuration = 5000; // 5 seconds per slide
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    // Start progress bar
    this.startProgress();

    // Add event listeners
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
    document.addEventListener("touchstart", (e) => this.handleTouchStart(e));
    document.addEventListener("touchend", (e) => this.handleTouchEnd(e));
    document.addEventListener("click", () => this.nextSlide());

    // Animate moments
    this.animateMoments();
  }

  startProgress() {
    const progress = () => {
      const width = (this.currentSlide / (this.totalSlides - 1)) * 100;
      this.progressBar.style.width = `${width}%`;
    };

    progress();
  }

  nextSlide() {
    this.slides[this.currentSlide].classList.remove("active");
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.slides[this.currentSlide].classList.add("active");
    this.startProgress();
  }

  prevSlide() {
    this.slides[this.currentSlide].classList.remove("active");
    this.currentSlide =
      (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.slides[this.currentSlide].classList.add("active");
    this.startProgress();
  }

  handleKeyPress(e) {
    if (e.key === "ArrowRight") this.nextSlide();
    if (e.key === "ArrowLeft") this.prevSlide();
  }

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.handleSwipe();
  }

  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }

  animateMoments() {
    const moments = document.querySelectorAll(".moment");
    moments.forEach((moment, index) => {
      moment.style.animationDelay = `${index * 0.2}s`;
    });
  }
}

// Initialize slideshow when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Slideshow();
});
