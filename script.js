/* ========================================
   LawBuddy Landing Page - JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initSmoothScroll();
    initHeaderScroll();
    initScrollAnimations();
    initTimerAnimation();
    initParallax();
});

/* ========================================
   Smooth Scroll for Anchor Links
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   Header Background on Scroll
   ======================================== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            header.style.padding = '12px 0';
        } else {
            header.style.boxShadow = 'none';
            header.style.padding = '16px 0';
        }

        lastScroll = currentScroll;
    });
}

/* ========================================
   Scroll Reveal Animations
   ======================================== */
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.feature-card, .showcase-item, .screenshot-card, .section-header'
    );

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add CSS for animated state
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ========================================
   Timer Animation in Hero
   ======================================== */
function initTimerAnimation() {
    const timerValue = document.querySelector('.timer-value');
    if (!timerValue) return;

    let hours = 2;
    let minutes = 34;
    let seconds = 15;

    function updateTimer() {
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }

        const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerValue.textContent = formattedTime;
    }

    setInterval(updateTimer, 1000);
}

/* ========================================
   Parallax Effects
   ======================================== */
function initParallax() {
    const floatingCards = document.querySelectorAll('.floating-card');
    const heroGlow = document.querySelector('.hero-glow');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;

        floatingCards.forEach((card, index) => {
            const speed = (index + 1) * 0.1;
            card.style.transform = `translateY(${-rate * speed}px)`;
        });

        if (heroGlow) {
            heroGlow.style.transform = `translate(${scrolled * 0.1}px, ${scrolled * 0.2}px)`;
        }
    });
}

/* ========================================
   Mouse Follow Effect on Hero
   ======================================== */
document.addEventListener('mousemove', (e) => {
    const heroVisual = document.querySelector('.hero-visual');
    if (!heroVisual) return;

    const rect = heroVisual.getBoundingClientRect();
    const isInHero = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
    );

    if (isInHero) {
        const x = (e.clientX - rect.left - rect.width / 2) / 50;
        const y = (e.clientY - rect.top - rect.height / 2) / 50;

        const phoneMockup = document.querySelector('.phone-mockup');
        if (phoneMockup) {
            phoneMockup.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
            phoneMockup.style.transition = 'transform 0.1s ease';
        }
    }
});

/* ========================================
   Screenshot Carousel Auto-scroll
   ======================================== */
(function initScreenshotCarousel() {
    const track = document.querySelector('.screenshot-track');
    if (!track) return;

    let isScrolling = false;
    let startX;
    let scrollLeft;

    // Mouse drag functionality
    track.addEventListener('mousedown', (e) => {
        isScrolling = true;
        track.style.cursor = 'grabbing';
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.parentElement.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
        isScrolling = false;
        track.style.cursor = 'grab';
    });

    track.addEventListener('mouseup', () => {
        isScrolling = false;
        track.style.cursor = 'grab';
    });

    track.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 2;
        track.parentElement.scrollLeft = scrollLeft - walk;
    });

    track.style.cursor = 'grab';
})();

/* ========================================
   Counter Animation for Stats
   ======================================== */
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function update() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    update();
}

// Trigger counter animation when stats come into view
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value-mock');
            statValues.forEach(stat => {
                const target = parseInt(stat.textContent);
                animateCounter(stat, target);
            });
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsContainer = document.querySelector('.stats-mock');
if (statsContainer) {
    statObserver.observe(statsContainer);
}

/* ========================================
   Loading Animation
   ======================================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Animate hero elements on load
    const heroTitle = document.querySelector('.hero-title');
    const heroDesc = document.querySelector('.hero-description');
    const storeButtons = document.querySelector('.store-buttons');
    const heroVisual = document.querySelector('.hero-visual');

    const elements = [heroTitle, heroDesc, storeButtons, heroVisual].filter(Boolean);

    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';

        setTimeout(() => {
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 150));
    });
});

/* ========================================
   Dark Mode Detection (optional)
   ======================================== */
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // User prefers dark mode - could add dark mode styles here
    console.log('Dark mode detected - consider adding dark mode support');
}

console.log('LawBuddy website loaded successfully! 🎓⚖️');
