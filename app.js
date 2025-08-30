// Smooth scrolling and navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initSmoothScrolling();
    initMobileMenu();
    initScrollAnimations();
    initNavbarEffects();
    initNewsletterForm();
    initLanguageSelector();
    initNewsfeed(); // Fixed typo from initNewseed
    initBookInteractions();
    addMobileMenuStyles();
    addNavbarScrollStyles();
    addLoadingStyles();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Show feedback that navigation is working
                const sectionName = targetId.replace('#', '');
                showNotification(`Navigated to ${sectionName} section`, 'success');
            }
        });
    });
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = navMenu.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (navMenu && mobileMenuToggle) {
        navMenu.classList.toggle('mobile-menu-open');
        mobileMenuToggle.classList.toggle('active');
        
        // Toggle hamburger animation
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.transform = navMenu.classList.contains('mobile-menu-open') 
                ? getHamburgerTransform(index) 
                : 'none';
        });
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (navMenu && mobileMenuToggle) {
        navMenu.classList.remove('mobile-menu-open');
        mobileMenuToggle.classList.remove('active');
        
        const spans = mobileMenuToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = 'none';
        });
    }
}

function getHamburgerTransform(index) {
    switch(index) {
        case 0: return 'rotate(45deg) translate(5px, 5px)';
        case 1: return 'opacity(0)';
        case 2: return 'rotate(-45deg) translate(7px, -6px)';
        default: return 'none';
    }
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .review-card, .chapter-preview, .author-content');
    
    // Add scroll-animate class to elements
    animatedElements.forEach(el => {
        el.classList.add('scroll-animate');
    });
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animated elements
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Navbar scroll effects
function initNavbarEffects() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for styling
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (only hide when scrolling down fast)
            if (scrollTop > lastScrollTop && scrollTop > 300) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// Newsletter form handling - Fixed to show proper feedback
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const submitButton = form.querySelector('button[type="submit"]');
            
            if (emailInput && emailInput.value && submitButton) {
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                // Show loading state
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Subscribing...';
                submitButton.disabled = true;
                submitButton.style.opacity = '0.7';
                
                // Simulate subscription process
                setTimeout(() => {
                    // Show success state
                    submitButton.textContent = 'Subscribed!';
                    submitButton.style.background = 'var(--color-success)';
                    submitButton.style.opacity = '1';
                    emailInput.value = '';
                    
                    // Show success notification
                    showNotification('Successfully subscribed to newsletter! 🎉', 'success');
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                        submitButton.style.background = '';
                    }, 3000);
                }, 1500); // Longer delay to show the loading state
            } else if (!emailInput.value) {
                showNotification('Please enter your email address', 'warning');
            }
        });
    }
}

// Language selector functionality
function initLanguageSelector() {
    const languageSelector = document.getElementById('language-selector');
    
    if (languageSelector) {
        languageSelector.addEventListener('change', function() {
            const selectedLanguage = this.value;
            
            // Store language preference
            try {
                localStorage.setItem('preferredLanguage', selectedLanguage);
            } catch(e) {
                console.log('LocalStorage not available');
            }
            
            // Show notification about language change
            const languageNames = {
                'en': 'English',
                'es': 'Español',
                'fr': 'Français',
                'de': 'Deutsch'
            };
            
            showNotification(`Language changed to ${languageNames[selectedLanguage]}`, 'info');
        });
        
        // Load saved language preference
        try {
            const savedLanguage = localStorage.getItem('preferredLanguage');
            if (savedLanguage) {
                languageSelector.value = savedLanguage;
            }
        } catch(e) {
            console.log('LocalStorage not available');
        }
    }
}

// News feed functionality (simulated HuggingFace integration) - Fixed function name
function initNewsfeed() {
    const newsGrid = document.getElementById('news-grid');
    
    if (newsGrid) {
        // Simulate loading news articles
        setTimeout(() => {
            loadNewsArticles();
        }, 2000);
    }
}

function loadNewsArticles() {
    const newsGrid = document.getElementById('news-grid');
    
    if (!newsGrid) return;
    
    // Simulated news articles (in real implementation, this would fetch from HuggingFace)
    const newsArticles = [
        {
            title: "Latest Advances in Large Language Models",
            summary: "New research shows significant improvements in reasoning capabilities across multiple domains, pushing the boundaries of what's possible in AI...",
            date: "August 28, 2025",
            category: "AI Research"
        },
        {
            title: "Cognitive Computing Breakthroughs",
            summary: "Scientists discover new patterns in how AI systems process complex cognitive tasks, offering insights into human-machine collaboration...",
            date: "August 27, 2025",
            category: "Cognitive AI"
        },
        {
            title: "The Future of Human-AI Collaboration",
            summary: "Industry leaders discuss the evolving relationship between human creativity and AI assistance in programming and problem-solving...",
            date: "August 26, 2025",
            category: "Industry"
        }
    ];
    
    // Clear placeholder
    newsGrid.innerHTML = '';
    
    // Create news article cards
    newsArticles.forEach((article, index) => {
        setTimeout(() => {
            const articleCard = createNewsCard(article, index);
            newsGrid.appendChild(articleCard);
        }, index * 300);
    });
}

function createNewsCard(article, index) {
    const card = document.createElement('div');
    card.className = 'card scroll-animate';
    card.style.animationDelay = `${index * 0.2}s`;
    
    card.innerHTML = `
        <div class="card__body">
            <div class="status status--info" style="margin-bottom: var(--space-8);">${article.category}</div>
            <h4 style="margin-bottom: var(--space-12); color: var(--color-text);">${article.title}</h4>
            <p style="margin-bottom: var(--space-16); color: var(--color-text-secondary); line-height: 1.5;">${article.summary}</p>
            <div class="article-meta" style="color: var(--color-text-secondary);">
                <small>${article.date}</small>
            </div>
        </div>
    `;
    
    // Add hover effect
    card.style.cursor = 'pointer';
    card.style.transition = 'transform var(--duration-normal) var(--ease-standard)';
    
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
        card.style.boxShadow = 'var(--shadow-md)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = 'var(--shadow-sm)';
    });
    
    // Add click event for future article viewing
    card.addEventListener('click', () => {
        showNotification('Full article feature coming soon! 📰', 'info');
    });
    
    return card;
}

// Book interaction effects
function initBookInteractions() {
    const bookCover = document.querySelector('.book-cover');
    
    if (bookCover) {
        // Add click effect
        bookCover.addEventListener('click', function() {
            this.style.transform = 'rotateY(0deg) scale(1.1)';
            
            setTimeout(() => {
                this.style.transform = 'rotateY(-15deg)';
            }, 600);
            
            showNotification('📚 Available on Amazon!', 'info');
        });
        
        // Add subtle floating animation
        let floatDirection = 1;
        setInterval(() => {
            if (bookCover.matches(':hover')) return;
            
            const currentTransform = bookCover.style.transform || 'rotateY(-15deg) translateY(0px)';
            const newTransform = currentTransform.includes('translateY') 
                ? currentTransform.replace(/translateY\([^)]*\)/, `translateY(${floatDirection * 3}px)`)
                : currentTransform + ` translateY(${floatDirection * 3}px)`;
            
            bookCover.style.transform = newTransform;
            floatDirection *= -1;
        }, 3000);
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: var(--space-8);">&times;</button>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('.notification-styles')) {
        const style = document.createElement('style');
        style.className = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: var(--space-12) var(--space-16);
                border-radius: var(--radius-base);
                color: white;
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                box-shadow: var(--shadow-lg);
                animation: slideInRight 0.4s ease;
                font-weight: var(--font-weight-medium);
            }
            
            .notification--success {
                background: var(--color-success);
            }
            
            .notification--info {
                background: var(--color-info);
            }
            
            .notification--warning {
                background: var(--color-warning);
            }
            
            .notification--error {
                background: var(--color-error);
            }
            
            .notification button {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s ease;
            }
            
            .notification button:hover {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 480px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.4s ease reverse';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 400);
        }
    }, 5000);
}

// Add mobile menu styles
function addMobileMenuStyles() {
    if (!document.querySelector('.mobile-menu-styles')) {
        const style = document.createElement('style');
        style.className = 'mobile-menu-styles';
        style.textContent = `
            @media (max-width: 768px) {
                .nav-menu {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(10px);
                    flex-direction: column;
                    padding: var(--space-16);
                    box-shadow: var(--shadow-lg);
                    border-top: 1px solid var(--color-border);
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all var(--duration-normal) var(--ease-standard);
                }
                
                .nav-menu.mobile-menu-open {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                    display: flex;
                }
                
                .nav-menu .nav-link {
                    padding: var(--space-12) var(--space-16);
                    border-radius: var(--radius-base);
                    margin-bottom: var(--space-8);
                    text-align: center;
                }
                
                .mobile-menu-toggle.active span:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                
                .mobile-menu-toggle.active span:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-toggle.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -6px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add enhanced navbar scroll styles
function addNavbarScrollStyles() {
    if (!document.querySelector('.navbar-scroll-styles')) {
        const style = document.createElement('style');
        style.className = 'navbar-scroll-styles';
        style.textContent = `
            .navbar {
                transition: all var(--duration-normal) var(--ease-standard);
            }
            
            .navbar.scrolled {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(20px);
                box-shadow: var(--shadow-sm);
            }
            
            @media (prefers-color-scheme: dark) {
                .navbar {
                    background: rgba(31, 33, 33, 0.95);
                }
                
                .navbar.scrolled {
                    background: rgba(31, 33, 33, 0.98);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add loading animation for the page
function addLoadingStyles() {
    if (!document.querySelector('.loading-styles')) {
        const style = document.createElement('style');
        style.className = 'loading-styles';
        style.textContent = `
            body {
                opacity: 0;
                transition: opacity 0.6s ease;
            }
            
            body.page-loaded {
                opacity: 1;
            }
            
            .fade-in-up {
                animation: fadeInUp 0.8s ease-out forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    // Any expensive scroll operations can go here
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScrollHandler);

// Add page loaded event handling
window.addEventListener('load', function() {
    document.body.classList.add('page-loaded');
    
    // Trigger initial animations
    const heroElements = document.querySelectorAll('.hero-text > *, .hero-image');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.animationDelay = `${index * 0.2}s`;
            el.classList.add('fade-in-up');
        }, index * 100);
    });
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to The Cognitive Divide! 🧠', 'info');
    }, 2000);
});

// Error handling for any issues
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // Don't show error notifications to users in production
});

// Add smooth scroll behavior for browsers that don't support it natively
if (!('scrollBehavior' in document.documentElement.style)) {
    // Polyfill for smooth scrolling
    const smoothScrollPolyfill = {
        timer: null,
        
        scrollTo: function(element, to, duration) {
            if (duration <= 0) return;
            
            const difference = to - element.scrollTop;
            const perTick = difference / duration * 10;
            
            this.timer = setTimeout(() => {
                element.scrollTop = element.scrollTop + perTick;
                if (element.scrollTop === to) return;
                this.scrollTo(element, to, duration - 10);
            }, 10);
        }
    };
    
    // Override the smooth scrolling function for older browsers
    const originalScrollTo = window.scrollTo;
    window.scrollTo = function(options) {
        if (typeof options === 'object' && options.behavior === 'smooth') {
            smoothScrollPolyfill.scrollTo(document.documentElement, options.top, 500);
        } else if (typeof options === 'object') {
            originalScrollTo.call(window, options);
        } else {
            document.documentElement.scrollTop = options;
        }
    };
}



// Interactive Book Section Functionality
class InteractiveBookSection {
    constructor() {
        this.currentPage = 0;
        this.totalPages = 12;
        this.isOpen = false;
        this.isAnimating = false;

        this.book = document.getElementById('interactiveBook');
        this.bookCover = document.getElementById('interactiveBookCover');
        this.pages = document.querySelectorAll('#interactiveBookPages .page');
        this.pageIndicator = document.getElementById('interactivePageIndicator');
        this.loadingAnimation = document.getElementById('interactiveLoadingAnimation');

        if (this.book && this.bookCover && this.pages.length > 0) {
            this.initializeControls();
            this.initializePageClicks();
            this.addSoundEffects();
            this.initializePageVisibility();
        }
    }

    initializeControls() {
        const openBtn = document.getElementById('interactiveOpenBookBtn');
        const closeBtn = document.getElementById('interactiveCloseBookBtn');
        const prevBtn = document.getElementById('interactivePrevPageBtn');
        const nextBtn = document.getElementById('interactiveNextPageBtn');

        if (openBtn) openBtn.addEventListener('click', () => this.openBook());
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeBook());
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevPage());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextPage());

        // Arrow navigation
        const prevArrow = document.getElementById('interactivePrevArrow');
        const nextArrow = document.getElementById('interactiveNextArrow');
        
        if (prevArrow) prevArrow.addEventListener('click', () => this.prevPage());
        if (nextArrow) nextArrow.addEventListener('click', () => this.nextPage());

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && !this.isAnimating) {
                if (e.key === 'ArrowRight' || e.key === ' ') {
                    e.preventDefault();
                    this.nextPage();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevPage();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.closeBook();
                }
            }
        });
    }

    initializePageClicks() {
        if (this.bookCover) {
            this.bookCover.addEventListener('click', () => {
                if (!this.isOpen && !this.isAnimating) {
                    this.openBook();
                }
            });
        }

        this.pages.forEach((page, index) => {
            page.addEventListener('click', (e) => {
                if (this.isOpen && !this.isAnimating) {
                    this.handlePageClick(e, index);
                }
            });
        });
    }

    handlePageClick(e, pageIndex) {
        const page = e.currentTarget;
        const pageWidth = page.offsetWidth;
        const clickX = e.clientX - page.getBoundingClientRect().left;
        
        if (clickX < pageWidth / 2) {
            this.nextPage();
        } else {
            this.prevPage();
        }
    }

    initializePageVisibility() {
        this.pages.forEach((page, index) => {
            if (index === 0) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    }

    showPage(pageIndex) {
        this.pages.forEach((page, index) => {
            if (index === pageIndex) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
    }

    openBook() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.showLoadingAnimation();
        
        // Add opened class to trigger the 3D transform
        this.book.classList.add('opened');
        this.bookCover.classList.add('opened');
        this.isOpen = true;
        
        // Show the first page after book opens
        setTimeout(() => {
            this.showPage(0);
            this.isAnimating = false;
            this.hideLoadingAnimation();
            this.updateControls();
            this.updatePageIndicator();
        }, 2000);
    }

    closeBook() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.showLoadingAnimation();
        
        // Remove opened class to close the book
        this.book.classList.remove('opened');
        this.bookCover.classList.remove('opened');
        this.isOpen = false;
        this.currentPage = 0;
        
        // Reset all pages and hide them
        this.pages.forEach(page => {
            page.classList.remove('turned');
            page.classList.remove('active');
        });
        
        setTimeout(() => {
            this.isAnimating = false;
            this.hideLoadingAnimation();
            this.updateControls();
            this.updatePageIndicator();
        }, 2000);
    }

    nextPage() {
        if (!this.isOpen || this.isAnimating || this.currentPage >= this.totalPages) return;
        
        this.isAnimating = true;
        this.showLoadingAnimation();
        
        this.currentPage++;
        
        const currentPageElement = this.pages[this.currentPage];
        if (currentPageElement) {
            currentPageElement.classList.add('turned');
        }
        
        // Show the new page content
        this.showPage(this.currentPage);
        
        setTimeout(() => {
            this.isAnimating = false;
            this.hideLoadingAnimation();
            this.updateControls();
            this.updatePageIndicator();
        }, 1200);
    }

    prevPage() {
        if (!this.isOpen || this.isAnimating || this.currentPage <= 0) return;
        
        this.isAnimating = true;
        this.showLoadingAnimation();
        
        this.currentPage--;
        
        const currentPageElement = this.pages[this.currentPage];
        if (currentPageElement) {
            currentPageElement.classList.remove('turned');
        }
        
        // Show the new page content
        this.showPage(this.currentPage);
        
        setTimeout(() => {
            this.isAnimating = false;
            this.hideLoadingAnimation();
            this.updateControls();
            this.updatePageIndicator();
        }, 1200);
    }

    showLoadingAnimation() {
        if (this.loadingAnimation) {
            this.loadingAnimation.style.opacity = '1';
        }
    }

    hideLoadingAnimation() {
        if (this.loadingAnimation) {
            this.loadingAnimation.style.opacity = '0';
        }
    }

    updateControls() {
        const openBtn = document.getElementById('interactiveOpenBookBtn');
        const closeBtn = document.getElementById('interactiveCloseBookBtn');
        const prevBtn = document.getElementById('interactivePrevPageBtn');
        const nextBtn = document.getElementById('interactiveNextPageBtn');
        const prevArrow = document.getElementById('interactivePrevArrow');
        const nextArrow = document.getElementById('interactiveNextArrow');
        
        if (this.isOpen) {
            if (openBtn) openBtn.disabled = true;
            if (closeBtn) closeBtn.disabled = false;
            if (prevBtn) prevBtn.disabled = this.currentPage <= 0;
            if (nextBtn) nextBtn.disabled = this.currentPage >= this.totalPages;
            
            // Update arrows
            if (prevArrow) {
                if (this.currentPage <= 0) {
                    prevArrow.classList.add('disabled');
                } else {
                    prevArrow.classList.remove('disabled');
                }
            }
            if (nextArrow) {
                if (this.currentPage >= this.totalPages) {
                    nextArrow.classList.add('disabled');
                } else {
                    nextArrow.classList.remove('disabled');
                }
            }
        } else {
            if (openBtn) openBtn.disabled = false;
            if (closeBtn) closeBtn.disabled = true;
            if (prevBtn) prevBtn.disabled = true;
            if (nextBtn) nextBtn.disabled = true;
            
            // Hide arrows when book is closed
            if (prevArrow) prevArrow.classList.add('disabled');
            if (nextArrow) nextArrow.classList.add('disabled');
        }
    }

    updatePageIndicator() {
        if (!this.pageIndicator) return;
        
        if (!this.isOpen) {
            this.pageIndicator.textContent = 'Cover';
        } else if (this.currentPage === 0) {
            this.pageIndicator.textContent = 'Title Page';
        } else if (this.currentPage === this.totalPages) {
            this.pageIndicator.textContent = 'Back Cover';
        } else {
            this.pageIndicator.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
    }

    addSoundEffects() {
        // Optional: Add page turning sound effects
        this.playPageTurnSound = () => {
            // Create a subtle page turning sound
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        };
    }
}

// Initialize the interactive book when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing Interactive Book Section');

    // Initialize interactive book section if elements exist
    if (document.getElementById('interactiveBook')) {
        console.log('Interactive book section element found, initializing InteractiveBookSection');
        new InteractiveBookSection();
    } else {
        console.log('Interactive book section element not found');
    }

    // Initialize existing functionality (with error handling)
    try {
        if (typeof initSmoothScrolling === 'function') initSmoothScrolling();
        if (typeof initMobileMenu === 'function') initMobileMenu();
        if (typeof initScrollAnimations === 'function') initScrollAnimations();
        if (typeof initNavbarEffects === 'function') initNavbarEffects();
        if (typeof initNewsletterForm === 'function') initNewsletterForm();
        if (typeof initLanguageSelector === 'function') initLanguageSelector();
        if (typeof initNewsfeed === 'function') initNewsfeed();
        if (typeof initBookInteractions === 'function') initBookInteractions();
        if (typeof addMobileMenuStyles === 'function') addMobileMenuStyles();
        if (typeof addNavbarScrollStyles === 'function') addNavbarScrollStyles();
        if (typeof addLoadingStyles === 'function') addLoadingStyles();
    } catch (error) {
        console.log('Some initialization functions not available:', error);
    }
});

// Add 3D book movement on mouse move
document.addEventListener('mousemove', (e) => {
    const book = document.getElementById('book');
    if (book && !book.classList.contains('opened')) {
        const rect = book.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const rotateX = (mouseY - centerY) / 20;
        const rotateY = (mouseX - centerX) / 20;
        
        book.style.transform = `rotateY(${-20 + rotateY}deg) rotateX(${10 - rotateX}deg)`;
    }
});