// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.innerHTML = isOpen ? '\u00d7' : '\u2630;';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}

// Close mobile menu when clicking a link
const navLinkElements = document.querySelectorAll('.nav-link');
navLinkElements.forEach(link => {
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.innerHTML = '\u2630;';
      document.body.style.overflow = '';
    }
  });
});

// Smooth scroll for nav links (500ms)
navLinkElements.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('data-target') || link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      e.preventDefault();
      const navHeight = document.querySelector('.navbar').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without scroll
      history.pushState(null, '', `#${targetId}`);
    } else {
      const targetIdFromHref = link.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetIdFromHref);
      if (targetEl) {
        e.preventDefault();
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        history.pushState(null, '', `#${targetIdFromHref}`);
      }
    }
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const observerOptions = {
  rootMargin: '-20% 0px -80% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkElements.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-target') === id);
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// IntersectionObserver for reveal animations
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// Menu accordion functionality
const categoryHeaders = document.querySelectorAll('.menu-category-header');
categoryHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    const panelId = header.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    
    header.setAttribute('aria-expanded', !isExpanded);
    if (panel) {
      panel.hidden = isExpanded;
    }
  });
});

// Contact form validation
const contactForm = document.getElementById('contact-form');
const formStatus = contactForm?.querySelector('.form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    
    // Basic validation
    if (!name || !email || !message) {
      showFormStatus('Please fill in all fields.', 'error');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormStatus('Please enter a valid email address.', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        showFormStatus('Thank you! Your message has been sent.', 'success');
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      showFormStatus('Something went wrong. Please try again or contact us directly.', 'error');
    }
    finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showFormStatus(message, type) {
  if (formStatus) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 5000);
  }
}

// Gallery lightbox
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
const lightboxNext = lightbox?.querySelector('.lightbox-next');

let currentImageIndex = 0;
const galleryImages = Array.from(galleryItems);

function openLightbox(index) {
  currentImageIndex = index;
  const img = galleryImages[index];
  if (img && lightbox && lightboxImage && lightboxCaption) {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = img.nextElementSibling?.textContent || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleLightboxKeydown);
  }
}

function closeLightbox() {
  if (lightbox) {
    lightbox.hidden = true;
    lightboxImage.src = '';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleLightboxKeydown);
  }
}

function showPrevImage() {
  currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  openLightbox(currentImageIndex);
}

function showNextImage() {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  openLightbox(currentImageIndex);
}

function handleLightboxKeydown(e) {
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowLeft') showPrevImage();
  else if (e.key === 'ArrowRight') showNextImage();
}

if (galleryItems.length > 0) {
  galleryItems.forEach((img, index) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => openLightbox(index));
  });
}

if (lightboxClose) lightboxClose?.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev?.addEventListener('click', showPrevImage);
if (lightboxNext) lightboxNext?.addEventListener('click', showNextImage);

if (lightbox) lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Reviews carousel
const reviewsTrack = document.querySelector('.reviews-track');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');

if (reviewsTrack && prevBtn && nextBtn) {
  const scrollAmount = 320;
  
  prevBtn.addEventListener('click', () => {
    reviewsTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
  
  nextBtn.addEventListener('click', () => {
    reviewsTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

console.log('Bashir Ahmed Karahi Gosht - All scripts loaded');
