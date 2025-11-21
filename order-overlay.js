// Order Overlay JavaScript

// Note: Add to Cart toggle is now handled in script.js for consistency

// Order Overlay State Management
const OrderOverlay = {
    currentStep: 'select',
    overlay: null,
    dialog: null,
    successModal: null,
    
    init() {
        this.overlay = document.querySelector('.order-overlay');
        this.dialog = document.querySelector('.order-overlay-dialog');
        this.successModal = document.querySelector('.success-modal');
        
        // If overlay doesn't exist, only initialize Add to Cart functionality
        if (!this.overlay) return;
        
        // Initialize success modal
        if (this.successModal) {
            const okBtn = this.successModal.querySelector('.success-modal-ok');
            if (okBtn) {
                okBtn.addEventListener('click', () => {
                    this.closeSuccessModal();
                });
            }
            
            const closeBtn = this.successModal.querySelector('.success-modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.closeSuccessModal();
                });
            }
            
            // Close on backdrop click
            const backdrop = this.successModal.querySelector('.success-modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    this.closeSuccessModal();
                });
            }
        }
        
        // Initialize sidebar button
        const sidebarOrderBtn = document.querySelector('.sidebar-order-now');
        if (sidebarOrderBtn) {
            sidebarOrderBtn.addEventListener('click', () => {
                this.openStep('select');
            });
        }
        
        // Initialize close buttons (attach to ALL close buttons so each step can be closed)
        const closeBtns = this.overlay.querySelectorAll('.order-overlay-close');
        if (closeBtns && closeBtns.length) {
            closeBtns.forEach(btn => {
                // use pointerdown to react earlier than iframe focus and also support click
                btn.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    this.close();
                });
                // keep click as a fallback
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.close();
                });
            });
        }
        
        // Close on backdrop click
        const backdrop = this.overlay.querySelector('.order-overlay-backdrop');
        if (backdrop) {
            // clicks on the backdrop (outside the dialog) should close the overlay
            backdrop.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.close();
            });
            // keep click as fallback
            backdrop.addEventListener('click', () => {
                this.close();
            });
        }

        // Close overlay / modals on Escape key
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // If success modal is open, close it first
                if (this.successModal && this.successModal.classList.contains('is-open')) {
                    this.closeSuccessModal();
                    return;
                }
                if (this.overlay && this.overlay.classList.contains('is-open')) {
                    this.close();
                }
            }
        });
        
        // Initialize step navigation
        this.initStepNavigation();
        
        // Initialize form handlers
        this.initFormHandlers();
    },
    
    openStep(step) {
        if (!this.overlay) return;
        
        this.currentStep = step;
        
        // Hide all steps
        const allSteps = this.overlay.querySelectorAll('.overlay-step');
        allSteps.forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Show the requested step
        const targetStep = this.overlay.querySelector(`.overlay-step-${step}`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
        
        // Show overlay
        this.overlay.classList.add('is-open');
        this.overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Update tab states
        this.updateTabStates(step);
    },
    
    close() {
        if (!this.overlay) return;
        
        this.overlay.classList.remove('is-open');
        this.overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Reset to select step for next time
        // setTimeout(() => {
        //     this.openStep('select');
        // }, 300);
    },
    
    showSuccessModal(type) {
        if (!this.successModal) return;
        
        const messageEl = this.successModal.querySelector('.success-modal-message');
        if (messageEl) {
            if (type === 'delivery') {
                messageEl.textContent = 'Your delivery order has been placed successfully.';
            } else if (type === 'carryout') {
                messageEl.textContent = 'Your carryout order has been registered successfully.';
            }
        }
        
        this.successModal.classList.add('is-open');
        this.successModal.setAttribute('aria-hidden', 'false');
    },
    
    closeSuccessModal() {
        if (!this.successModal) return;
        
        this.successModal.classList.remove('is-open');
        this.successModal.setAttribute('aria-hidden', 'true');
        
        // Close the entire overlay as well
        this.close();
        
        // Redirect to menu.html page
        window.location.href = 'menu.html';
    },
    
    initStepNavigation() {
        // Delivery/Carryout option cards
        const optionArrows = this.overlay.querySelectorAll('.order-option-arrow');
        optionArrows.forEach(arrow => {
            arrow.addEventListener('click', (e) => {
                const step = arrow.getAttribute('data-step');
                if (step) {
                    this.openStep(step);
                }
            });
        });
        
        // Also allow clicking the whole card
        const optionCards = this.overlay.querySelectorAll('.order-option-card');
        optionCards.forEach(card => {
            const arrow = card.querySelector('.order-option-arrow');
            if (arrow) {
                card.addEventListener('click', (e) => {
                    // Don't trigger if clicking the arrow itself
                    if (!e.target.closest('.order-option-arrow')) {
                        const step = arrow.getAttribute('data-step');
                        if (step) {
                            this.openStep(step);
                        }
                    }
                });
            }
        });
        
        // Tab navigation
        const tabs = this.overlay.querySelectorAll('.delivery-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                if (targetTab === 'delivery') {
                    this.openStep('delivery');
                } else if (targetTab === 'carryout') {
                    this.openStep('carryout');
                }
            });
        });
    },
    
    updateTabStates(step) {
        const tabs = this.overlay.querySelectorAll('.delivery-tab');
        tabs.forEach(tab => {
            const tabType = tab.getAttribute('data-tab');
            if (step === tabType) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    },
    
    initFormHandlers() {
        // Use My Location buttons
        const useLocationBtns = this.overlay.querySelectorAll('.use-location-btn');
        useLocationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Use my location clicked');
                // TODO: Implement geolocation API
            });
        });
        
        // Delivery form submission
        const deliveryForm = this.overlay.querySelector('.delivery-form');
        if (deliveryForm) {
            deliveryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(deliveryForm);
                const data = Object.fromEntries(formData);
                console.log('Delivery form submitted:', data);
                // Show success modal for delivery
                this.showSuccessModal('delivery');
            });
        }
        
        // Find Store button
        const findStoreBtn = this.overlay.querySelector('.find-store-btn');
        if (findStoreBtn) {
            findStoreBtn.addEventListener('click', () => {
                const zip = document.getElementById('carryoutZip')?.value;
                const city = document.getElementById('carryoutCity')?.value;
                const state = document.getElementById('carryoutState')?.value;
                console.log('Find a store clicked:', { zip, city, state });
                // Show success modal for carryout
                this.showSuccessModal('carryout');
            });
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    OrderOverlay.init();
});

