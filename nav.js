/**
 * nav.js — Navbar interactivity
 * Handles: hamburger toggle, smooth scroll, active link tracking,
 * scroll-based navbar darkening, and mobile menu auto-close.
 */

(function () {
    'use strict';

    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    // All navigable sections (hero + content sections)
    const sections = document.querySelectorAll(
        "#home, #about, #education, #skills, #projects, #contact"
    );
    /* ─── Hamburger toggle ─────────────────────────────────── */
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        navLinksEl.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    /* ─── Close mobile menu when a link is clicked ─────────── */
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinksEl.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
        });
    });

    /* ─── Smooth scroll ────────────────────────────────────── */
    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            // Offset for fixed navbar height (64px)
            const offset = 64;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ─── Navbar darkens after scrolling past 40px ─────────── */
    function handleNavbarScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // run once on load

    /* ─── Active link via IntersectionObserver ─────────────── */
    function setActive(id) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));

})();
