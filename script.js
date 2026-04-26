// ─── Wrap everything in DOMContentLoaded (#16 fix) ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {

    // ─── Mobile Navigation (#4 fix) ──────────────────────────────────────────
    // The HTML has TWO separate <ul> elements (.nav-left and .nav-right).
    // The old code grabbed only the first .nav-menu, so the mobile menu never worked.
    // We build a unified mobile drawer from both lists.
    const hamburger = document.querySelector('.hamburger');
    const navLeft   = document.querySelector('.nav-left');
    const navRight  = document.querySelector('.nav-right');

    const mobileMenu = document.createElement('ul');
    mobileMenu.className = 'nav-mobile-menu';

    [...navLeft.querySelectorAll('a'), ...navRight.querySelectorAll('a')].forEach(a => {
        const li    = document.createElement('li');
        const clone = a.cloneNode(true);
        li.appendChild(clone);
        mobileMenu.appendChild(li);
        clone.addEventListener('click', closeMobileMenu);
    });

    document.querySelector('.nav-container').appendChild(mobileMenu);

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // ─── Smooth Scrolling ────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return; // skip dead links (#15 fix)
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ─── Unified Scroll Handler (#6 fix — one listener instead of two) ───────
    const navbar      = document.querySelector('.navbar');
    const heroContent = document.querySelector('.hero-content');
    let lastScrollTop = 0;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Navbar hide/show
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        // .scrolled class for CSS (#14 fix — was never toggled before)
        navbar.classList.toggle('scrolled', scrollTop > 50);

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => navbar.classList.remove('hidden'), 150);

        // Hero parallax — opacity only, no transform (#2 & #3 fix)
        // Keeping transform off the hero-content prevents conflict with the
        // IntersectionObserver which also sets transform on that element.
        if (heroContent) {
            heroContent.style.opacity = Math.max(0, 1 - scrollTop / 700); // clamped (#3)
        }
    }, { passive: true });

    // ─── Intersection Observer (#1 fix) ──────────────────────────────────────
    // Use a CSS class instead of inline opacity:0 so the page stays visible
    // if JS fails or the observer never fires.
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = `
        .js-fade { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .js-fade.visible { opacity: 1 !important; transform: translateY(0) !important; }
    `;
    document.head.appendChild(fadeStyle);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // stop watching once visible
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

    // Exclude .hero — it has its own CSS animations and must always be visible
    document.querySelectorAll('section:not(.hero), .service-card, .portfolio-item, .testimonial-card').forEach(el => {
        el.classList.add('js-fade');
        observer.observe(el);
    });

    // ─── Portfolio z-index on hover ───────────────────────────────────────────
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('mouseenter', function () { this.style.zIndex = '10'; });
        item.addEventListener('mouseleave', function () { this.style.zIndex = '1'; });
    });

    // ─── Custom Cursor ────────────────────────────────────────────────────────
    const cursorStyle = document.createElement('style');
    cursorStyle.textContent = `
        .custom-cursor {
            width: 20px; height: 20px;
            border: 2px solid #d4af37; border-radius: 50%;
            position: fixed; pointer-events: none;
            z-index: 9999; transition: transform 0.2s ease; display: none;
        }
        @media (min-width: 1024px) {
            .custom-cursor { display: block; }
            body { cursor: none; }
            a, button, .portfolio-item, .service-card { cursor: none; }
        }
        .custom-cursor.hover { transform: scale(1.5); background: rgba(212,175,55,0.2); }
    `;
    document.head.appendChild(cursorStyle);

    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .portfolio-item, .service-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // ─── Contact Form ─────────────────────────────────────────────────────────
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your inquiry! We will get back to you within 24 hours.');
            contactForm.reset();
        });
    }

    // ─── Stats Counter (#5 fix — guard against double-fire) ──────────────────
    const animateCounter = (element, target, duration = 2000) => {
        if (element.dataset.animated) return; // prevent double-animation
        element.dataset.animated = 'true';
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-item h3').forEach(item => {
                    animateCounter(item, parseInt(item.textContent));
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) statsObserver.observe(statsSection);

});

// ─── Page load fade-in (needs window load, not DOMContentLoaded) ─────────────
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
