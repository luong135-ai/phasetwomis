// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initLazyLoading();
    initMenuInteractions();
    initBookingForm();
    initVideoInteractions();
    initNavigation();
});

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => img.classList.add('loaded'));
    }
}

// Navigation Functionality
function initNavigation() {
    const nav = document.querySelector('.floating-nav');
    if (!nav) return;   // phòng trường hợp page nào đó không có nav

    // Check xem trang này có hero không (chỉ home mới có)
    const hero = document.querySelector('.hero-section');
    const hasHero = !!hero;

    // Mobile / tablet: vẫn dùng menu riêng
    if (window.innerWidth <= 1023) {
        createMobileMenu();
    }

    let heroHeight = hasHero ? hero.offsetHeight : 0;

    function updateNavOnScroll() {
        const scrollY = window.scrollY;

        // 📱 MOBILE & TABLET: nav đã fixed sẵn bằng CSS, chỉ chỉnh shadow
        if (window.innerWidth <= 1023) {
            nav.classList.remove('sticky');

            nav.style.boxShadow = scrollY > 20
                ? '0 4px 12px rgba(0,0,0,0.12)'
                : '0 8px 24px rgba(0,0,0,0.15)';

            return;
        }

        // 💻 DESKTOP
        let triggerPoint;

        if (hasHero) {
            // Home: có hero → sticky sau khi cuộn gần hết hero
            triggerPoint = heroHeight - nav.offsetHeight - 40;
        } else {
            // About, Menu, Contact, Game: không có hero → cho sticky sau ~80px
            triggerPoint = 80;
        }

        if (scrollY > triggerPoint) {
            nav.classList.add('sticky');
            nav.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
        } else {
            nav.classList.remove('sticky');
            nav.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
        }
    }

    // chạy 1 lần lúc load
    updateNavOnScroll();

    // khi scroll
    window.addEventListener('scroll', updateNavOnScroll);

    // khi resize: cập nhật lại heroHeight nếu có hero
    window.addEventListener('resize', debounce(function () {
        if (hasHero && hero) {
            heroHeight = hero.offsetHeight;
        }
        updateNavOnScroll();
    }, 150));
}


// Create Mobile Menu
function createMobileMenu() {
    const nav = document.querySelector('.floating-nav');
    const hamburger = document.querySelector('.hamburger-menu');
    
    if (!hamburger) return;
    
    // Create mobile menu overlay
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = `
        <div class="mobile-menu-content">
            <button class="mobile-menu-close" aria-label="Close navigation menu">✕</button>
            <a href="index.html" class="mobile-nav-link">HOME</a>
            <a href="about.html" class="mobile-nav-link">ABOUT</a>
            <a href="menu.html" class="mobile-nav-link">MENU</a>
            <a href="contactus.html" class="mobile-nav-link">CONTACT US</a>
            <a href="game.html" class="mobile-nav-link">GAME</a>
        </div>
    `;
    
    // Add styles for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .mobile-menu.active {
            display: flex;
            opacity: 1;
        }
        
        .mobile-menu-content {
            position: absolute;
            top: 0;
            right: 0;
            width: 250px;
            height: 100vh;
            background: white;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 0;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 10000;
            box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
            overflow-y: auto;
        }
        
        .mobile-menu.active .mobile-menu-content {
            transform: translateX(0);
        }
        
        .mobile-menu-close {
            align-self: flex-end;
            background: none;
            border: none;
            font-size: 28px;
            color: #1A1A1A;
            cursor: pointer;
            padding: 8px 12px;
            margin-bottom: 20px;
            transition: color 0.3s ease;
        }
        
        .mobile-menu-close:hover {
            color: #DAA520;
        }
        
        .mobile-nav-link {
            font-family: 'Special Gothic', Arial, sans-serif;
            font-weight: bold;
            font-size: 16px;
            text-transform: uppercase;
            color: #1A1A1A;
            text-decoration: none;
            padding: 16px 0;
            border-bottom: 1px solid #E5E5E5;
            transition: color 0.3s ease;
            display: block;
        }
        
        .mobile-nav-link:last-child {
            border-bottom: none;
        }
        
        .mobile-nav-link:hover {
            color: #DAA520;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(mobileMenu);
    
    // Toggle mobile menu on hamburger click
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking close button
    const closeBtn = mobileMenu.querySelector('.mobile-menu-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close menu when clicking a link
    const mobileNavLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Menu Interactions
function initMenuInteractions() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const foodCards = document.querySelectorAll('.food-card');
    const orderBtns = document.querySelectorAll('.order-btn');
    const detailBtns = document.querySelectorAll('.detail-btn');
    
    // Category button interactions
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Food card hover effects
    foodCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)';
        });
    });
    
    // Order button interactions
    orderBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Check if button already has the is-added class
            const isAlreadyAdded = this.classList.contains('is-added');
            
            // Toggle the is-added class
            this.classList.toggle('is-added');
            
            const checkbox = this.querySelector('.checkbox-icon');
            if (checkbox) {
                if (isAlreadyAdded) {
                    // Second click - removing item
                    checkbox.style.background = 'transparent';
                    checkbox.innerHTML = '';
                    checkbox.style.color = '';
                    showNotification('Item removed from order!', 'error');
                } else {
                    // First click - adding item
                    checkbox.style.background = '#004B3C';
                    checkbox.innerHTML = '✓';
                    checkbox.style.color = 'white';
                    showNotification('Item added to order!', 'success');
                }
            }
        });
    });

    
    // Detail button interactions
    detailBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Detail view coming soon!', 'info');
        });
    });
}

function initBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;
    const submitBtn = form.querySelector('.submit-btn');
    const requiredFields = form.querySelectorAll('[required]');
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            const fieldName = field.getAttribute('name');
            
            // Remove existing error styling
            field.style.borderColor = '#E5E5E5';
            const existingError = field.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Validate based on field type
            if (!value) {
                showFieldError(field, `${getFieldLabel(fieldName)} is required`);
                isValid = false;
            } else if (fieldName === 'phone' && !isValidPhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            } else if (fieldName === 'email' && value && !isValidEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.style.borderColor = '#8B0000';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#8B0000';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    function getFieldLabel(fieldName) {
        const labels = {
            'fullName': 'Full Name',
            'phone': 'Mobile Phone',
            'email': 'Email',
            'dob': 'Date of Birth',
            'gender': 'Gender',
            'area': 'Area',
            'date': 'Reservation Date',
            'timeHour': 'Time Hour',
            'timeMinute': 'Time Minute',
            'partySize': 'Party Size'
        };
        return labels[fieldName] || fieldName;
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Real-time validation
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            const value = this.value.trim();
            if (!value) {
                showFieldError(this, `${getFieldLabel(this.name)} is required`);
            } else {
                this.style.borderColor = '#E5E5E5';
                const existingError = this.parentNode.querySelector('.error-message');
                if (existingError) {
                    existingError.remove();
                }
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            submitBtn.textContent = 'RESERVING...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showBookingSuccess();
                form.reset();
                submitBtn.textContent = 'RESERVE';
                submitBtn.disabled = false;
            }, 2000);
        }
    });
}

function showBookingSuccess() {
    const form = document.getElementById('bookingForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'booking-success';
    successDiv.innerHTML = `
        <div style="background: #D4EDDA; color: #155724; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
            <strong>Thanks! Your table is reserved.</strong><br>
            <small>We'll send you a confirmation email shortly.</small>
        </div>
    `;
    form.insertBefore(successDiv, form.firstChild);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Video Interactions
function initVideoInteractions() {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)';
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '6px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });
    
    // Set background color based on type
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'info': '#17a2b8',
        'warning': '#ffc107'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('resize', debounce(function() {
    if (window.innerWidth <= 1023) {
        // Chỉ tạo nếu chưa có
        if (!document.querySelector('.mobile-menu')) {
            createMobileMenu();
        }
    } else {
        // Xóa overlay, trả body về bình thường
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger-menu');
        if (mobileMenu) {
            mobileMenu.remove();
        }
        if (hamburger) {
            hamburger.classList.remove('active');
        }
        document.body.style.overflow = '';

        // Hiện nav-links lại (desktop)
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.style.display = 'flex';
    }
}, 250));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
