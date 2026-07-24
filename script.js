/**
 * Stars Dental Clinic - Main JavaScript Engine
 * Language: English
 * Provides complete interactivity, validation, slider navigation, modals, and animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive modules
  initNavigation();
  initTestimonialSlider();
  initGalleryFilter();
  initFAQAccordion();
  initAppointmentForm();
  initServiceModal();
  initBlogModal();
  initScrollEffects();
  initDateConstraints();
});

/* ==========================================================================
   1. Navigation & Header Logic
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileBackdrop = document.querySelector('.mobile-nav-backdrop');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileClose = document.querySelector('.mobile-close-btn');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile drawer open/close
  const toggleDrawer = (open) => {
    if (open) {
      mobileBackdrop.classList.add('active');
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      mobileBackdrop.classList.remove('active');
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleDrawer(true));
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => toggleDrawer(false));
  }
  if (mobileBackdrop) {
    mobileBackdrop.addEventListener('click', () => toggleDrawer(false));
  }

  // Smooth scroll and close mobile drawer
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          toggleDrawer(false);
          const headerOffset = 90;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"]`).forEach((a) => {
          a.classList.add('active');
        });
        document.querySelectorAll(`.mobile-nav-link[href*="${sectionId}"]`).forEach((a) => {
          a.classList.add('active');
        });
      } else {
        document.querySelectorAll(`.nav-link[href*="${sectionId}"]`).forEach((a) => {
          a.classList.remove('active');
        });
        document.querySelectorAll(`.mobile-nav-link[href*="${sectionId}"]`).forEach((a) => {
          a.classList.remove('active');
        });
      }
    });
  });
}

/* ==========================================================================
   2. Patient Reviews & Testimonial Slider
   ========================================================================== */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dotsContainer = document.querySelector('.slider-dots');

  if (!track) return;

  const slides = Array.from(track.children);
  if (slides.length === 0) return;

  let currentIndex = 0;
  let autoPlayTimer = null;

  // Calculate visible slides based on screen width
  const getVisibleSlides = () => {
    const width = window.innerWidth;
    if (width <= 640) return 1;
    if (width <= 1024) return 2;
    return 3;
  };

  const getMaxIndex = () => {
    return Math.max(0, slides.length - getVisibleSlides());
  };

  // Build dots
  const createDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const totalDots = getMaxIndex() + 1;

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = Array.from(dotsContainer.children);
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  };

  const goToSlide = (index) => {
    const maxIndex = getMaxIndex();
    currentIndex = Math.max(0, Math.min(index, maxIndex));

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 32; // 2rem gap
    const moveAmount = (slideWidth + gap) * currentIndex;

    track.style.transform = `translateX(-${moveAmount}px)`;
    updateDots();
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else {
        goToSlide(getMaxIndex());
      }
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < getMaxIndex()) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(0);
      }
      resetAutoPlay();
    });
  }

  // Auto Play
  const startAutoPlay = () => {
    autoPlayTimer = setInterval(() => {
      if (currentIndex < getMaxIndex()) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(0);
      }
    }, 5000);
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  };

  // Touch Swipe Support
  let startX = 0;
  let currentX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    currentX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    const diffX = startX - currentX;
    if (Math.abs(diffX) > 50) {
      if (diffX > 0 && currentIndex < getMaxIndex()) {
        goToSlide(currentIndex + 1);
      } else if (diffX < 0 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
      resetAutoPlay();
    }
  });

  window.addEventListener('resize', () => {
    createDots();
    goToSlide(currentIndex);
  });

  createDots();
  startAutoPlay();
}

/* ==========================================================================
   3. Gallery Filter & Lightbox Viewer
   ========================================================================== */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || filterValue === category) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox click handler
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || 'Stars Dental Clinic';
      const category = item.querySelector('.gallery-category')?.textContent || '';

      openLightbox(img.src, title, category);
    });
  });
}

function openLightbox(src, title, category) {
  let backdrop = document.querySelector('.lightbox-backdrop');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop lightbox-backdrop';
    backdrop.innerHTML = `
      <div class="modal-card" style="max-width: 800px; padding: 1.5rem; text-align: center;">
        <button class="modal-close-btn">&times;</button>
        <img class="lightbox-img" src="" alt="" style="width: 100%; max-height: 70vh; object-fit: contain; border-radius: 12px; margin-bottom: 1rem;" />
        <h3 class="lightbox-title" style="font-size: 1.25rem; font-weight: 700; color: var(--secondary);"></h3>
        <p class="lightbox-category" style="font-size: 0.85rem; color: var(--primary); font-weight: 600; text-transform: uppercase; margin-bottom: 0;"></p>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.querySelector('.modal-close-btn').addEventListener('click', () => {
      backdrop.classList.remove('active');
    });

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.classList.remove('active');
    });
  }

  backdrop.querySelector('.lightbox-img').src = src;
  backdrop.querySelector('.lightbox-title').textContent = title;
  backdrop.querySelector('.lightbox-category').textContent = category;
  backdrop.classList.add('active');
}

/* ==========================================================================
   4. FAQ Accordion Toggle
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach((other) => other.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   5. Service Detail Modal System
   ========================================================================== */
const serviceDetailsData = {
  'dental-implants': {
    title: 'Dental Implants',
    icon: 'fa-tooth',
    description: 'Permanent, natural-looking tooth replacement solution designed to restore strength, aesthetics, and full chewing functionality.',
    procedure: 'Dental implants are titanium posts surgically positioned into the jawbone beneath your gums. Once in place, they allow your dentist to mount replacement teeth onto them.',
    benefits: [
      'Looks, feels, and functions like a natural tooth',
      'Prevents jawbone deterioration',
      'Does not damage adjacent natural teeth',
      'Lifelong durability with proper oral care'
    ]
  },
  'root-canal': {
    title: 'Root Canal Treatment (RCT)',
    icon: 'fa-x-ray',
    description: 'Painless single-sitting RCT to save infected or severely damaged natural teeth without extraction.',
    procedure: 'Under precise local anesthesia, the infected dental pulp is thoroughly cleansed, disinfected, shaped, and sealed with biocompatible material, followed by a protective crown.',
    benefits: [
      'Relieves severe tooth pain immediately',
      'Saves your natural tooth structure',
      'Prevents infection from spreading',
      'Restores normal biting and chewing'
    ]
  },
  'tooth-extraction': {
    title: 'Tooth Extraction',
    icon: 'fa-user-nurse',
    description: 'Gentle, safe, and stress-free extraction procedure performed under local anesthesia.',
    procedure: 'Used when a tooth is unsalvageable due to deep decay, trauma, or severe crowding. Our experienced dentists ensure a painless process with minimal downtime.',
    benefits: [
      'Eliminates chronic pain and infection source',
      'Prevents damage to neighboring teeth',
      'Prepares mouth for orthodontic or implant procedures',
      'Comprehensive post-extraction care instructions'
    ]
  },
  'wisdom-tooth': {
    title: 'Wisdom Tooth Removal',
    icon: 'fa-head-side-mask',
    description: 'Surgical & non-surgical wisdom tooth removal to treat impacted, painful, or misaligned third molars.',
    procedure: 'Precise extraction of impacted wisdom teeth causing jaw pain, swelling, or crowding, conducted with modern surgical techniques for rapid recovery.',
    benefits: [
      'Prevents overcrowding and shifting of adjacent teeth',
      'Eliminates jaw stiffness and gum inflammation',
      'Reduces risk of cyst formation',
      'Quick healing with soft-tissue laser assistance'
    ]
  },
  'teeth-cleaning': {
    title: 'Teeth Cleaning & Polishing',
    icon: 'fa-sparkles',
    description: 'Professional ultrasonic scaling and polishing to remove stubborn plaque, tartar, and surface stains.',
    procedure: 'Our dental hygienists use gentle ultrasonic scalers to remove plaque buildup above and below the gumline, finishing with high-gloss fluoride polishing.',
    benefits: [
      'Prevents gum disease (Gingivitis & Periodontitis)',
      'Eliminates bad breath (Halitosis)',
      'Brightens natural tooth surface',
      'Essential bi-annual preventative maintenance'
    ]
  },
  'teeth-whitening': {
    title: 'Teeth Whitening',
    icon: 'fa-wand-magic-sparkles',
    description: 'Advanced laser teeth whitening that lightens discoloration by up to 8 shades in a single clinic visit.',
    procedure: 'Application of professional-grade whitening gel activated by specialized LED light, delivering safe, immediate, and dazzling results.',
    benefits: [
      'Instant transformation in under 60 minutes',
      'Safe for enamel and gums',
      'Removes deep coffee, tea, and tobacco stains',
      'Boosts self-confidence for special occasions'
    ]
  },
  'dental-crowns': {
    title: 'Dental Crowns & Bridges',
    icon: 'fa-crown',
    description: 'Durable ceramic, zirconia, and porcelain crowns to protect weakened teeth and restore gaps.',
    procedure: 'Custom-crafted dental caps fitted over damaged teeth or attached to implants to restore shape, size, strength, and appearance.',
    benefits: [
      'High aesthetic match with natural teeth',
      'Long-lasting protection for root canal treated teeth',
      'Restores bite alignment',
      'Chipping and stain resistant zirconia options'
    ]
  },
  'dental-fillings': {
    title: 'Composite Dental Fillings',
    icon: 'fa-shield-halved',
    description: 'Tooth-colored composite resin fillings that seamlessly repair cavities and minor fractures.',
    procedure: 'Decayed tooth tissue is removed, cleaned, and filled with shade-matched composite material cured under specialized light.',
    benefits: [
      'Blends invisibly with natural enamel',
      'Bonds directly to tooth structure',
      'Mercury-free, bio-safe material',
      'Prevents further decay progression'
    ]
  },
  'emergency-dental': {
    title: 'Emergency Dental Care',
    icon: 'fa-kit-medical',
    description: 'Immediate, compassionate dental care for severe toothaches, broken teeth, bleeding gums, or oral trauma.',
    procedure: 'Priority walk-in and appointment slots available for urgent pain relief, trauma stabilization, and emergency procedures.',
    benefits: [
      'Same-day pain relief',
      'Immediate diagnostic digital X-rays',
      'Prompt intervention for knocked-out teeth',
      'Available during all working hours (+91 93546 52164)'
    ]
  }
};

function initServiceModal() {
  const serviceCards = document.querySelectorAll('.service-card');

  serviceCards.forEach((card) => {
    const btn = card.querySelector('.service-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const serviceKey = card.getAttribute('data-service-key');
      const data = serviceDetailsData[serviceKey] || {
        title: card.querySelector('.service-title')?.textContent || 'Dental Care',
        description: card.querySelector('.service-description')?.textContent || '',
        procedure: 'Consult our expert dentists at Stars Dental Clinic for a personalized diagnostic evaluation.',
        benefits: ['Expert consultation', 'Modern technology', 'Painless treatment', 'Affordable plans']
      };

      openServiceModal(data);
    });
  });
}

function openServiceModal(data) {
  let modal = document.querySelector('.service-modal-backdrop');

  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-backdrop service-modal-backdrop';
    modal.innerHTML = `
      <div class="modal-card">
        <button class="modal-close-btn">&times;</button>
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.25rem;">
          <div style="width: 50px; height: 50px; border-radius: 12px; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
            <i class="fa-solid fa-tooth modal-service-icon"></i>
          </div>
          <div>
            <h3 class="modal-service-title" style="font-size: 1.4rem; font-weight: 700; color: var(--secondary);"></h3>
            <span style="font-size: 0.8rem; color: var(--accent); font-weight: 600; text-transform: uppercase;">Stars Dental Specialty</span>
          </div>
        </div>
        <p class="modal-service-desc" style="font-size: 1rem; color: var(--slate-600); margin-bottom: 1rem;"></p>
        <div style="background-color: var(--bg-soft); padding: 1.25rem; border-radius: 12px; margin-bottom: 1.25rem; border: 1px solid var(--border-light);">
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem;">Procedure Overview</h4>
          <p class="modal-service-procedure" style="font-size: 0.9rem; color: var(--slate-600); margin-bottom: 0;"></p>
        </div>
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem;">Key Benefits</h4>
        <ul class="modal-service-benefits" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 2rem;"></ul>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="#appointment" class="btn btn-primary modal-book-btn" style="flex: 1;">
            <i class="fa-solid fa-calendar-check"></i> Book Consultation
          </a>
          <a href="tel:+919354652164" class="btn btn-outline">
            <i class="fa-solid fa-phone"></i> Call Clinic
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    modal.querySelector('.modal-book-btn').addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.querySelector('.modal-service-title').textContent = data.title;
  modal.querySelector('.modal-service-desc').textContent = data.description;
  modal.querySelector('.modal-service-procedure').textContent = data.procedure;

  const benefitsList = modal.querySelector('.modal-service-benefits');
  benefitsList.innerHTML = '';
  data.benefits.forEach((b) => {
    const li = document.createElement('li');
    li.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--secondary);';
    li.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--accent);"></i> ${b}`;
    benefitsList.appendChild(li);
  });

  modal.classList.add('active');
}

/* ==========================================================================
   6. Blog Reader Modal System
   ========================================================================== */
const blogPostsData = {
  'visit-frequency': {
    title: 'How Often Should You Visit a Dentist?',
    date: 'July 15, 2026',
    author: 'Dr. Gaurav',
    tag: 'Dental Wellness',
    content: `
      <p>Regular dental checkups are the cornerstone of good oral health. Most dental associations recommend visiting your dentist at least <strong>twice a year (every 6 months)</strong> for a comprehensive checkup and professional cleaning.</p>
      <h4>Why Are Bi-Annual Visits Crucial?</h4>
      <ul>
        <li><strong>Early Cavity Detection:</strong> Small cavities can be filled easily before they reach the nerve and require root canal therapy.</li>
        <li><strong>Gum Disease Prevention:</strong> Professional ultrasonic scaling removes hardened tartar that regular brushing cannot eliminate.</li>
        <li><strong>Oral Cancer Screening:</strong> Dentists evaluate soft tissues in your mouth for early signs of abnormalities.</li>
      </ul>
      <p>If you experience bleeding gums, persistent tooth sensitivity, or jaw discomfort, schedule a consultation at Stars Dental Clinic without waiting for your 6-month mark.</p>
    `
  },
  'implants-benefits': {
    title: 'Benefits of Dental Implants vs Traditional Dentures',
    date: 'July 02, 2026',
    author: 'Dr. Gaurav',
    tag: 'Implantology',
    content: `
      <p>Missing teeth can impact your confidence, speech, and ability to enjoy your favorite foods. Dental implants offer a permanent, natural-looking replacement solution that behaves just like natural teeth.</p>
      <h4>Top Reasons to Choose Dental Implants:</h4>
      <ul>
        <li><strong>Bone Loss Prevention:</strong> Implants stimulate the jawbone, preventing facial sagging and bone deterioration.</li>
        <li><strong>Lifelong Durability:</strong> With proper hygiene, implants can last a lifetime, unlike bridges or dentures which need replacement every 5-10 years.</li>
        <li><strong>No Damage to Adjacent Teeth:</strong> Unlike dental bridges, implants do not require grinding down neighboring healthy teeth.</li>
      </ul>
      <p>At Stars Dental Clinic, Uttam Nagar, we perform precision implant placements using advanced digital diagnostics.</p>
    `
  },
  'healthy-teeth-tips': {
    title: '10 Essential Tips for Maintaining Healthy Teeth',
    date: 'June 20, 2026',
    author: 'Stars Dental Team',
    tag: 'Oral Hygiene',
    content: `
      <p>A bright, healthy smile starts with daily habit consistency. Here are our top expert tips to keep your teeth strong and cavity-free:</p>
      <ol>
        <li>Brush twice daily for at least two minutes using soft-bristled brushes.</li>
        <li>Floss daily to remove trapped food particles between teeth.</li>
        <li>Use fluoride toothpaste to strengthen enamel.</li>
        <li>Limit sugary snacks and acidic beverages that erode tooth enamel.</li>
        <li>Stay hydrated to encourage healthy saliva production.</li>
        <li>Replace your toothbrush every 3 months or after recovering from illness.</li>
      </ol>
      <p>Schedule your bi-annual cleaning at Stars Dental Clinic to keep your smile shining bright!</p>
    `
  }
};

function initBlogModal() {
  const blogCards = document.querySelectorAll('.blog-card');

  blogCards.forEach((card) => {
    const btn = card.querySelector('.read-article-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const blogKey = card.getAttribute('data-blog-key');
      const post = blogPostsData[blogKey];
      if (post) openBlogModal(post);
    });
  });
}

function openBlogModal(post) {
  let modal = document.querySelector('.blog-modal-backdrop');

  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-backdrop blog-modal-backdrop';
    modal.innerHTML = `
      <div class="modal-card" style="max-width: 720px;">
        <button class="modal-close-btn">&times;</button>
        <div style="margin-bottom: 1rem;">
          <span class="blog-modal-tag badge badge-blue" style="margin-bottom: 0.5rem;"></span>
          <h2 class="blog-modal-title" style="font-size: 1.6rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem;"></h2>
          <div style="font-size: 0.85rem; color: var(--slate-400); display: flex; gap: 1rem;">
            <span><i class="fa-regular fa-calendar"></i> <span class="blog-modal-date"></span></span>
            <span><i class="fa-regular fa-user"></i> <span class="blog-modal-author"></span></span>
          </div>
        </div>
        <hr style="border: 0; border-top: 1px solid var(--border-light); margin-bottom: 1.5rem;" />
        <div class="blog-modal-content" style="color: var(--slate-600); line-height: 1.7; font-size: 0.95rem;"></div>
        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border-light); text-align: right;">
          <a href="#appointment" class="btn btn-primary blog-modal-book" style="display: inline-flex;">
            <i class="fa-solid fa-calendar-check"></i> Schedule Consultation
          </a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    modal.querySelector('.blog-modal-book').addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.querySelector('.blog-modal-tag').textContent = post.tag;
  modal.querySelector('.blog-modal-title').textContent = post.title;
  modal.querySelector('.blog-modal-date').textContent = post.date;
  modal.querySelector('.blog-modal-author').textContent = post.author;
  modal.querySelector('.blog-modal-content').innerHTML = post.content;

  modal.classList.add('active');
}

/* ==========================================================================
   7. Appointment Form & JavaScript Validation
   ========================================================================== */
function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Inputs
    const nameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const dateInput = document.getElementById('preferredDate');
    const timeInput = document.getElementById('preferredTime');
    const treatmentInput = document.getElementById('treatmentRequired');

    // Validation rules
    if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
      showError(nameInput, 'Please enter your full name (at least 3 characters).');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    const phoneValue = phoneInput.value.trim();
    const phoneRegex = /^(\+91[\-\s]?)?[0-9]{10}$/;
    if (!phoneRegex.test(phoneValue)) {
      showError(phoneInput, 'Please enter a valid 10-digit phone number.');
      isValid = false;
    } else {
      clearError(phoneInput);
    }

    if (emailInput.value.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(emailInput);
      }
    } else {
      clearError(emailInput);
    }

    if (!dateInput.value) {
      showError(dateInput, 'Please select a preferred date.');
      isValid = false;
    } else {
      clearError(dateInput);
    }

    if (!timeInput.value) {
      showError(timeInput, 'Please select a preferred time slot.');
      isValid = false;
    } else {
      clearError(timeInput);
    }

    if (!treatmentInput.value) {
      showError(treatmentInput, 'Please select a required treatment.');
      isValid = false;
    } else {
      clearError(treatmentInput);
    }

    if (isValid) {
      // Show confirmation popup & reset form
      showAppointmentConfirmationModal({
        name: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        date: dateInput.value,
        time: timeInput.value,
        treatment: treatmentInput.options[treatmentInput.selectedIndex].text
      });

      form.reset();
      initDateConstraints();
    }
  });
}

function showError(inputElement, message) {
  const formGroup = inputElement.closest('.form-group');
  if (formGroup) {
    formGroup.classList.add('error');
    const errorText = formGroup.querySelector('.error-text');
    if (errorText) errorText.textContent = message;
  }
}

function clearError(inputElement) {
  const formGroup = inputElement.closest('.form-group');
  if (formGroup) {
    formGroup.classList.remove('error');
  }
}

function showAppointmentConfirmationModal(data) {
  let modal = document.querySelector('.confirmation-modal-backdrop');

  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal-backdrop confirmation-modal-backdrop';
    modal.innerHTML = `
      <div class="modal-card" style="text-align: center; max-width: 520px;">
        <button class="modal-close-btn">&times;</button>
        <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--accent-light); color: var(--accent); font-size: 2.2rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem auto;">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h3 style="font-size: 1.6rem; font-weight: 700; color: var(--secondary); margin-bottom: 0.5rem;">Appointment Requested!</h3>
        <p style="font-size: 0.95rem; color: var(--slate-600); margin-bottom: 1.5rem;">
          Thank you <strong class="conf-name"></strong>. Our dental reception team will call you back shortly at <strong class="conf-phone"></strong> to confirm your appointment.
        </p>
        <div style="background-color: var(--bg-soft); padding: 1.25rem; border-radius: 12px; text-align: left; margin-bottom: 1.5rem; font-size: 0.9rem; border: 1px solid var(--border-light);">
          <div style="margin-bottom: 0.5rem;"><strong>Treatment:</strong> <span class="conf-treatment"></span></div>
          <div style="margin-bottom: 0.5rem;"><strong>Date:</strong> <span class="conf-date"></span></div>
          <div><strong>Time Slot:</strong> <span class="conf-time"></span></div>
        </div>
        <button class="btn btn-primary conf-done-btn" style="width: 100%;">
          Great, Thank You!
        </button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close-btn').addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.querySelector('.conf-done-btn').addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  modal.querySelector('.conf-name').textContent = data.name;
  modal.querySelector('.conf-phone').textContent = data.phone;
  modal.querySelector('.conf-date').textContent = data.date;
  modal.querySelector('.conf-time').textContent = data.time;
  modal.querySelector('.conf-treatment').textContent = data.treatment;

  modal.classList.add('active');
}

/* Set min date on datepicker to today */
function initDateConstraints() {
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
}

/* ==========================================================================
   8. Scroll Effects & Floating Scroll-To-Top
   ========================================================================== */
function initScrollEffects() {
  const scrollTopBtn = document.querySelector('.scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // IntersectionObserver for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeInUp');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .service-card, .why-card, .testimonial-card, .gallery-item, .blog-card').forEach((el) => {
    observer.observe(el);
  });
}

/* Toast helper function */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check" style="color: var(--success); font-size: 1.2rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
