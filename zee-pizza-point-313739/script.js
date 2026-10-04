document.addEventListener('DOMContentLoaded', function() {
    // 1. Mobile menu toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    if (mobileMenuButton && navLinks && navbar) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('open');
            navbar.classList.toggle('open');
            const isExpanded = navLinks.classList.contains('open');
            this.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                    navbar.classList.remove('open');
                    mobileMenuButton.setAttribute('aria-expanded', false);
                }
            });
        });
    }

    // 2. Smooth scrolling for nav anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Exclude the WhatsApp floating button from smooth scroll logic if it's an anchor
        if (anchor.classList.contains('whatsapp-float')) {
            return;
        }

        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. IntersectionObserver that adds the 'visible' class to '.reveal' elements
    const revealElements = document.querySelectorAll('.reveal-element');

    if (revealElements.length > 0) {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the element must be visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // 4. Sticky-nav shadow on scroll
    // The header already has position: sticky and a shadow defined in CSS.
    // This script will add a 'header-scrolled' class to potentially enhance the shadow
    // or provide a different visual state when scrolled down.
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) { // Adjust scroll threshold as needed
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
        });
    }

    // 5. Current-year in footer
    const copyrightParagraph = document.querySelector('.footer p');

    if (copyrightParagraph) {
        const currentYear = new Date().getFullYear();
        // Replace '2024' with the current year in the copyright text
        copyrightParagraph.textContent = copyrightParagraph.textContent.replace('2024', currentYear);
    }

    // 6. Gallery/menu tab logic - Not applicable based on provided HTML structure.
    // The menu items are all displayed without any tabbed navigation.
});