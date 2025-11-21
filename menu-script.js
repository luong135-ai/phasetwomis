// Menu Page JavaScript

// Smooth scrolling and active section highlighting
function initMenuNavigation() {
    const categoryLinks = document.querySelectorAll('.category-link');
    const sections = document.querySelectorAll('.food-section');
    const categorySelect = document.getElementById('categorySelect');

    // Handle category link clicks
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active state
                updateActiveCategory(targetId);
            }
        });
    });

    // Handle mobile dropdown
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            const targetId = e.target.value;
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                updateActiveCategory(targetId);
            }
        });
    }

    // Update active category based on scroll position
    function updateActiveCategory(activeId) {
        categoryLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === activeId) {
                link.classList.add('active');
            }
        });

        if (categorySelect) {
            categorySelect.value = activeId;
        }
    }

    // Intersection Observer for active section highlighting
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                updateActiveCategory(sectionId);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Food card interactions
function initFoodCardInteractions() {
    const foodCards = document.querySelectorAll('.food-card');
    
    foodCards.forEach(card => {
        const orderBtn = card.querySelector('.order-btn');
        const detailBtn = card.querySelector('.detail-btn');
        
        // Order button click - toggle handled by order-overlay.js
        // Keep this for any additional card-specific logic
        orderBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Add to cart logic here
            console.log('Added to cart:', card.querySelector('.food-name').textContent);
        });
        
        // Detail button click
        // detailBtn.addEventListener('click', (e) => {
        //     e.stopPropagation();
        //     // Add detail modal logic here
        //     console.log('View details:', card.querySelector('.food-name').textContent);
        // });
    });
}

// Mobile Navigation Toggle
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initMenuNavigation();
    initFoodCardInteractions();
    
    // Set initial active category
    const firstSection = document.querySelector('.food-section');
    if (firstSection) {
        const firstId = firstSection.getAttribute('id');
        const firstLink = document.querySelector(`[data-section="${firstId}"]`);
        if (firstLink) {
            firstLink.classList.add('active');
        }
    }
});

// Handle window resize for mobile navigation
window.addEventListener('resize', () => {
    // Update active category on resize
    const sections = document.querySelectorAll('.food-section');
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                const categoryLinks = document.querySelectorAll('.category-link');
                const categorySelect = document.getElementById('categorySelect');
                
                categoryLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });

                if (categorySelect) {
                    categorySelect.value = sectionId;
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
