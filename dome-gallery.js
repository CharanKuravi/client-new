(function () {
  const IMAGES = [
    { src: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&h=800&fit=crop', alt: 'Studio Portrait' },
    { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop', alt: 'Wedding' },
    { src: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=800&fit=crop', alt: 'Fashion Week' },
    { src: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=800&fit=crop', alt: 'Romantic Wedding' },
    { src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=800&fit=crop', alt: 'Bridal' },
    { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop', alt: 'Haute Couture' },
    { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=800&fit=crop', alt: 'Ceremony' },
    { src: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop', alt: 'Urban Collection' },
    { src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop', alt: 'Editorial' },
    { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop', alt: 'Fashion' },
    { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop', alt: 'Portrait' },
    { src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop', alt: 'Studio' },
    { src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=800&fit=crop', alt: 'Model' },
    { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop', alt: 'Portrait 2' },
  ];

  const SEGMENTS = 34;
  const xCols = Array.from({ length: SEGMENTS }, (_, i) => -33 + i * 2);
  const evenYs = [-4, -2, 0, 2, 4];
  const oddYs  = [-3, -1,  1, 3, 5];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  const slots = coords.map((c, i) => ({ ...c, ...IMAGES[i % IMAGES.length] }));

  let rotX = 0, rotY = 0;
  let velX = 0, velY = 0.15;
  let isDragging = false;
  let lastMouseX = 0, lastMouseY = 0;
  let focusedTile = null;

  const MAX_X    = 17;
  const RADIUS   = 750;
  const DRAG_SENS = 25;
  const FRICTION  = 0.94;
  // Auto-spin equilibrium: velY += 0.008 each frame, velY *= 0.94 each frame
  // Equilibrium = 0.008 / (1 - 0.94) ≈ 0.133 deg/frame — intentional gentle spin.
  // To prevent post-drag speed spike we cap velY in the loop.
  const MAX_VEL_Y = 3;

  function buildSphere(sphere) {
    const unit = 360 / SEGMENTS / 2;

    slots.forEach(slot => {
      const rotateY = unit * (slot.x + (slot.sizeX - 1) / 2);
      const rotateX = unit * (slot.y - (slot.sizeY - 1) / 2);

      const tile = document.createElement('div');
      tile.className = 'dg-tile';
      tile.dataset.src = slot.src;
      tile.style.cssText = `
        --tile-ry: ${rotateY}deg;
        --tile-rx: ${rotateX}deg;
        --tile-sx: ${slot.sizeX};
        --tile-sy: ${slot.sizeY};
      `;

      const inner = document.createElement('div');
      inner.className = 'dg-tile-inner';

      const img = document.createElement('img');
      img.src = slot.src;
      img.alt = slot.alt;
      img.draggable = false;

      inner.appendChild(img);
      tile.appendChild(inner);
      sphere.appendChild(tile);

      inner.addEventListener('click', (e) => {
        e.stopPropagation();
        openTile(tile, root, scrim, overlay); // pass refs — fix #7
      });
    });
  }

  // #7 & #8 fix: root/scrim/overlay are passed in, not re-queried
  let root, scrim, overlay;

  function applyRotation(sphere) {
    sphere.style.transform =
      `translateZ(calc(${RADIUS}px * -1)) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }

  // #9 fix: rafId is module-scoped so it can be cancelled
  let rafId = null;

  function loop(sphere) {
    if (!isDragging) {
      rotY += velY;
      rotX += velX;
      rotX  = Math.max(-MAX_X, Math.min(MAX_X, rotX));
      velY *= FRICTION;
      velX *= FRICTION;
      velY += 0.008; // gentle auto-spin
      // #10 fix: cap velocity to prevent post-drag spike
      velY  = Math.max(-MAX_VEL_Y, Math.min(MAX_VEL_Y, velY));
    }
    applyRotation(sphere);
    rafId = requestAnimationFrame(() => loop(sphere));
  }

  function openTile(tile) {
    if (focusedTile) return;
    focusedTile = tile;
    overlay.innerHTML = '';
    const img = document.createElement('img');
    img.src = tile.dataset.src;
    overlay.appendChild(img);
    scrim.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeTile() {
    if (!focusedTile) return;
    focusedTile = null;
    scrim.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function init() {
    root = document.querySelector('.dg-root');
    if (!root) return;

    const sphere = root.querySelector('.dg-sphere');
    scrim   = root.querySelector('.dg-scrim');
    overlay = root.querySelector('.dg-overlay');

    root.style.setProperty('--dg-radius', RADIUS + 'px');

    buildSphere(sphere);
    applyRotation(sphere);
    loop(sphere);

    // Mouse drag
    root.addEventListener('mousedown', e => {
      if (focusedTile) return;
      isDragging = true;
      velX = 0; velY = 0;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
      root.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      velY = dx / DRAG_SENS;
      velX = dy / DRAG_SENS * 0.5;
      rotY += velY;
      rotX  = Math.max(-MAX_X, Math.min(MAX_X, rotX + velX));
      applyRotation(sphere);
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      root.style.cursor = 'grab';
    });

    // Touch drag
    root.addEventListener('touchstart', e => {
      if (focusedTile) return;
      isDragging = true;
      velX = 0; velY = 0;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }, { passive: true });

    root.addEventListener('touchmove', e => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - lastMouseX;
      const dy = e.touches[0].clientY - lastMouseY;
      velY = dx / DRAG_SENS;
      velX = dy / DRAG_SENS * 0.5;
      rotY += velY;
      rotX  = Math.max(-MAX_X, Math.min(MAX_X, rotX + velX));
      applyRotation(sphere);
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }, { passive: true });

    root.addEventListener('touchend', () => { isDragging = false; });

    // Close handlers
    scrim.addEventListener('click', closeTile);
    window.addEventListener('keydown', e => { if (e.key === 'Escape') closeTile(); });

    // #9 fix: cancel RAF when page is hidden to avoid background CPU drain
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!rafId) {
        loop(sphere);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
