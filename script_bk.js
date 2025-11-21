// Hamburger Menu Toggle
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// Mobile Navigation Toggle
function initMobileNav() {
    const nav = document.querySelector('.floating-nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (window.innerWidth <= 1023) {
        // Create hamburger menu for mobile
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        
        // Add hamburger styles
        const style = document.createElement('style');
        style.textContent = `
            .hamburger {
                display: flex;
                flex-direction: column;
                gap: 4px;
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
            }
            .hamburger span {
                width: 24px;
                height: 2px;
                background: #1A1A1A;
                transition: all 0.3s ease;
            }
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
            .mobile-nav {
                position: fixed;
                top: 60px;
                left: 0;
                right: 0;
                width: 100%;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 20px;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
                z-index: 99;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            @media (max-width: 767px) {
                .mobile-nav {
                    top: 56px;
                }
            }
            
            @media (max-width: 480px) {
                .mobile-nav {
                    top: 52px;
                }
            }
            .mobile-nav.active {
                transform: translateY(0);
            }
            .mobile-nav .nav-link {
                display: block;
                padding: 16px 0;
                font-size: 16px;
                text-align: center;
                border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            }
            .mobile-nav .nav-link:last-child {
                border-bottom: none;
            }
        `;
        document.head.appendChild(style);
        
        // Insert hamburger before nav-controls
        const navControls = document.querySelector('.nav-controls');
        navControls.insertBefore(hamburger, navControls.firstChild);
        
        // Create mobile nav overlay
        const mobileNav = document.createElement('div');
        mobileNav.className = 'mobile-nav';
        mobileNav.innerHTML = navLinks.innerHTML;
        nav.appendChild(mobileNav);
        
        // Hide original nav links on mobile
        navLinks.style.display = 'none';
        
        // Toggle functionality
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        
        // Close on link click
        mobileNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }
}

// Food Card Interactions
function initFoodCards() {
    const foodCards = document.querySelectorAll('.food-card');
    
    foodCards.forEach(card => {
        const orderBtn = card.querySelector('.order-btn');
        const detailBtn = card.querySelector('.detail-btn');
        
        // Card hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.06)';
        });
        
        // Order button interactions - toggle handled by order-overlay.js
        // Keep this for any additional card-specific logic
        orderBtn.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // Detail button interactions
        detailBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Add your detail modal logic here
            console.log('Detail button clicked for:', card.querySelector('.food-name').textContent);
        });
    });
}

// Category Navigation
function initCategoryNav() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Add your category filtering logic here
            console.log('Category selected:', btn.textContent);
        });
    });
}

// Video Interactions
function initVideoInteractions() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            container.style.transform = 'scale(1.01)';
            container.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.12)';
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.transform = 'scale(1)';
            container.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.10)';
        });
    });
}

// Booking Form Validation and Submission
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Form validation
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            const fieldContainer = field.closest('.form-group');
            
            // Remove existing error
            const existingError = fieldContainer.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            if (!value) {
                isValid = false;
                showFieldError(field, 'This field is required');
            } else if (field.type === 'email' && !isValidEmail(value)) {
                isValid = false;
                showFieldError(field, 'Please enter a valid email address');
            } else if (field.type === 'tel' && !isValidPhone(value)) {
                isValid = false;
                showFieldError(field, 'Please enter a valid phone number');
            }
        });
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        const fieldContainer = field.closest('.form-group');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#8B0000';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        fieldContainer.appendChild(errorDiv);
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateForm();
        });
    });
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            submitBtn.textContent = 'PROCESSING...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                showSuccessMessage();
                form.reset();
                submitBtn.textContent = 'RESERVE';
                submitBtn.disabled = false;
            }, 2000);
        }
    });
    
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            background: #D4EDDA;
            color: #155724;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            text-align: center;
            font-weight: 700;
        `;
        successDiv.textContent = 'Thanks! Your table is reserved.';
        
        form.insertBefore(successDiv, form.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle anchor links (starting with #), allow full page navigation
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // If href doesn't start with #, allow normal navigation (e.g., menu.html, index.html)
        });
    });
}

// Menu Category Card Navigation
function initMenuCategoryCards() {
    const categoryCards = document.querySelectorAll('.menu-category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            if (category) {
                window.location.href = `menu.html#${category}`;
            }
        });
    });
}

// Reserve a Table Button - Scroll to Booking Section
function initReserveTableButton() {
    const reserveButtons = document.querySelectorAll('.cta-btn');
    
    reserveButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Only handle if on index.html
            if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
                e.preventDefault();
                const bookingSection = document.getElementById('booking');
                if (bookingSection) {
                    const offsetTop = bookingSection.offsetTop - 80; // Account for fixed nav
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initHamburgerMenu();
    initMobileNav();
    initFoodCards();
    initCategoryNav();
    initVideoInteractions();
    initBookingForm();
    initSmoothScrolling();
    initMenuCategoryCards();
    initReserveTableButton();
});

// Handle window resize for mobile nav
window.addEventListener('resize', () => {
    const nav = document.querySelector('.floating-nav');
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (window.innerWidth > 1023) {
        // Desktop: show nav links, hide mobile nav
        if (navLinks) navLinks.style.display = 'flex';
        if (hamburger) hamburger.style.display = 'none';
        if (mobileNav) mobileNav.style.display = 'none';
    } else {
        // Mobile: hide nav links, show hamburger
        if (navLinks) navLinks.style.display = 'none';
        if (hamburger) hamburger.style.display = 'flex';
        if (mobileNav) mobileNav.style.display = 'block';
    }
});

// Add loading states and performance optimizations
window.addEventListener('load', () => {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Add loading animation
    document.body.classList.add('loaded');
});
