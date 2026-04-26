(function () {

  class Pixel {
    constructor(canvas, context, x, y, color, speed, delay) {
      this.width = canvas.width;
      this.height = canvas.height;
      this.ctx = context;
      this.x = x;
      this.y = y;
      this.color = color;
      this.speed = this.getRandomValue(0.1, 0.9) * speed;
      this.size = 0;
      this.sizeStep = Math.random() * 0.4;
      this.minSize = 0.5;
      this.maxSizeInteger = 2;
      this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
      this.delay = delay;
      this.counter = 0;
      this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
      this.isIdle = false;
      this.isReverse = false;
      this.isShimmer = false;
    }

    getRandomValue(min, max) {
      return Math.random() * (max - min) + min;
    }

    draw() {
      const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
      this.ctx.fillStyle = this.color;
      this.ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size);
    }

    appear() {
      this.isIdle = false;
      if (this.counter <= this.delay) { this.counter += this.counterStep; return; }
      if (this.size >= this.maxSize) this.isShimmer = true;
      if (this.isShimmer) { this.shimmer(); } else { this.size += this.sizeStep; }
      this.draw();
    }

    disappear() {
      this.isShimmer = false;
      this.counter = 0;
      if (this.size <= 0) { this.isIdle = true; return; }
      this.size -= 0.1;
      this.draw();
    }

    shimmer() {
      if (this.size >= this.maxSize) this.isReverse = true;
      else if (this.size <= this.minSize) this.isReverse = false;
      this.size += this.isReverse ? -this.speed : this.speed;
    }
  }

  function getEffectiveSpeed(value, reducedMotion) {
    const throttle = 0.001;
    const parsed = parseInt(value, 10);
    if (parsed <= 0 || reducedMotion) return 0;
    if (parsed >= 100) return 100 * throttle;
    return parsed * throttle;
  }

  const VARIANT = {
    gap: 6,
    speed: 80,
    colors: '#fecdd3,#fda4af,#e11d48',
    noFocus: true
  };

  function initCard(card) {
    const canvas = document.createElement('canvas');
    canvas.className = 'pixel-canvas';
    card.insertBefore(canvas, card.firstChild);

    let pixels = [];
    let animationRef = null;
    let timePrevious = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const effectiveSpeed = getEffectiveSpeed(VARIANT.speed, reducedMotion);

    function initPixels() {
      const rect = card.getBoundingClientRect();
      const width  = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      // #11 fix: if card isn't laid out yet, retry once it becomes visible
      if (!width || !height) return;

      const ctx = canvas.getContext('2d');
      canvas.width  = width;
      canvas.height = height;
      canvas.style.width  = width  + 'px';
      canvas.style.height = height + 'px';

      const colorsArray = VARIANT.colors.split(',');
      pixels = [];

      for (let x = 0; x < width; x += VARIANT.gap) {
        for (let y = 0; y < height; y += VARIANT.gap) {
          const color    = colorsArray[Math.floor(Math.random() * colorsArray.length)];
          const dx       = x - width  / 2;
          const dy       = y - height / 2;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const delay    = reducedMotion ? 0 : distance;
          pixels.push(new Pixel(canvas, ctx, x, y, color, effectiveSpeed, delay));
        }
      }
    }

    function doAnimate(fnName) {
      animationRef = requestAnimationFrame(() => doAnimate(fnName));
      const timeNow     = performance.now();
      const timePassed  = timeNow - timePrevious;
      const timeInterval = 1000 / 60;
      if (timePassed < timeInterval) return;
      timePrevious = timeNow - (timePassed % timeInterval);

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allIdle = true;
      for (const pixel of pixels) {
        pixel[fnName]();
        if (!pixel.isIdle) allIdle = false;
      }
      if (allIdle) cancelAnimationFrame(animationRef);
    }

    function handleAnimation(name) {
      cancelAnimationFrame(animationRef);
      // Re-init if canvas was 0x0 on first attempt (#11 fix)
      if (!canvas.width || !canvas.height) initPixels();
      animationRef = requestAnimationFrame(() => doAnimate(name));
    }

    initPixels();

    // #12 fix: store the ResizeObserver so it could be disconnected if needed
    const ro = new ResizeObserver(() => {
      initPixels();
    });
    ro.observe(card);
    // Attach to card so external code can call card._pixelRO.disconnect() if needed
    card._pixelRO = ro;

    card.addEventListener('mouseenter', () => handleAnimation('appear'));
    card.addEventListener('mouseleave', () => handleAnimation('disappear'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.testimonial-card').forEach(initCard);
  });

})();
