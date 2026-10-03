document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate on Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            offset: 100,
            once: true
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'white';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
            navLinks.style.textAlign = 'center';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
            // Close mobile menu if open
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            }
        });
    });

    // Form Submission Placeholder
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});