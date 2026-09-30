/**
 * SkyLine — Responsive Web Design
 * Main JavaScript Controller
 * Lightweight Vanilla JS with Zero Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Elements ---
    const siteHeader = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const primaryNav = document.getElementById('primaryNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('backToTop');
    const watchVideoBtn = document.getElementById('watchVideoBtn');
    const videoModal = document.getElementById('videoModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const currentYearEl = document.getElementById('currentYear');

    // Dynamically set current year
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- 2. Mobile Navigation Toggle ---
    const toggleNav = (open) => {
        const isOpen = open !== undefined ? open : navToggle.getAttribute('aria-expanded') !== 'true';
        navToggle.setAttribute('aria-expanded', String(isOpen));
        primaryNav.classList.toggle('is-open', isOpen);
        document.body.style.overflow = isOpen && window.innerWidth < 1024 ? 'hidden' : '';
    };

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNav();
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    toggleNav(false);
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 1024 && primaryNav.classList.contains('is-open')) {
                if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
                    toggleNav(false);
                }
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
                toggleNav(false);
                navToggle.focus();
            }
        });

        // Handle viewport resize: reset body overflow
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1024) {
                document.body.style.overflow = '';
                primaryNav.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- 3. Header Scroll Effect & Back-to-Top Button ---
    const handleScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset;

        // Header scrolled class
        if (siteHeader) {
            if (scrollY > 50) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        }

        // Back to top visibility
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('is-visible');
            } else {
                backToTopBtn.classList.remove('is-visible');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 4. Active Navigation State via IntersectionObserver ---
    const sections = document.querySelectorAll('main > section[id]');
    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-30% 0px -60% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${currentId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // --- 5. Video Demo Modal ---
    const openModal = () => {
        if (!videoModal) return;
        videoModal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
        if (modalCloseBtn) modalCloseBtn.focus();
    };

    const closeModal = () => {
        if (!videoModal) return;
        videoModal.setAttribute('hidden', '');
        document.body.style.overflow = '';
        if (watchVideoBtn) watchVideoBtn.focus();
    };

    if (watchVideoBtn && videoModal) {
        watchVideoBtn.addEventListener('click', openModal);
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !videoModal.hasAttribute('hidden')) {
                closeModal();
            }
        });
    }

    // --- 7. Real-Time Viewport & Breakpoint Tracker ---
    const widthEl = document.getElementById('liveViewportWidth');
    const bpEl = document.getElementById('liveActiveBreakpoint');
    const bpItems = document.querySelectorAll('.bp-item');

    const updateViewportStatus = () => {
        const width = window.innerWidth;
        if (widthEl) widthEl.textContent = `${width}px`;

        let activeBp = 'desktop';
        let bpName = 'Desktop';

        if (width <= 480) {
            activeBp = 'small-mobile';
            bpName = 'Small Mobile';
        } else if (width <= 767) {
            activeBp = 'mobile';
            bpName = 'Mobile';
        } else if (width <= 1023) {
            activeBp = 'tablet';
            bpName = 'Tablet';
        } else if (width <= 1279) {
            activeBp = 'laptop';
            bpName = 'Laptop';
        } else {
            activeBp = 'desktop';
            bpName = 'Desktop';
        }

        if (bpEl) bpEl.textContent = bpName;

        bpItems.forEach(item => {
            if (item.getAttribute('data-bp') === activeBp) {
                item.classList.add('active-bp');
            } else {
                item.classList.remove('active-bp');
            }
        });
    };

    window.addEventListener('resize', updateViewportStatus, { passive: true });
    updateViewportStatus();
});

// --- 6. Contact & Newsletter Form Submission Handler ---
function handleSubscribe() {
    const emailInput = document.getElementById('userEmail');
    const feedback = document.getElementById('formFeedback');

    if (!emailInput || !feedback) return;

    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please enter a valid email address.';
        emailInput.focus();
        return;
    }

    // Success response
    feedback.className = 'form-feedback success';
    feedback.textContent = '🎉 Thank you! Your free responsive web consultation request is confirmed.';
    emailInput.value = '';

    setTimeout(() => {
        feedback.textContent = '';
    }, 6000);
}
