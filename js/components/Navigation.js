import { Utils } from '../utils.js';

export class Navigation {
    constructor() {
        this.elements = {
            navbar: Utils.query('.navbar'),
            hamburger: Utils.query('.hamburger'),
            navMenu: Utils.query('.nav-menu'),
            navLinks: Utils.queryAll('.nav-link')
        };
        
        this.isScrolling = false;
        this.init();
    }
    
    init() {
        this.setupScrollHandler();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
    }
    
    setupScrollHandler() {
        const handleScroll = Utils.debounce(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (this.elements.navbar) {
                if (scrollTop > 100) {
                    this.elements.navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                    this.elements.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
                } else {
                    this.elements.navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                    this.elements.navbar.style.boxShadow = 'none';
                }
            }
        }, 16); // ~60fps
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    setupMobileMenu() {
        if (this.elements.hamburger && this.elements.navMenu) {
            this.elements.hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
            
            // Close menu when clicking nav links
            this.elements.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.elements.hamburger.contains(e.target) && 
                    !this.elements.navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    setupSmoothScrolling() {
        this.elements.navLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = Utils.query(targetId);
                
                if (target && !this.isScrolling) {
                    this.scrollToSection(target);
                }
            });
        });
    }
    
    scrollToSection(target) {
        this.isScrolling = true;
        
        target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        
        // Reset scrolling flag after animation completes
        setTimeout(() => {
            this.isScrolling = false;
        }, 1000);
    }
    
    toggleMobileMenu() {
        this.elements.hamburger.classList.toggle('active');
        this.elements.navMenu.classList.toggle('active');
    }
    
    closeMobileMenu() {
        this.elements.hamburger.classList.remove('active');
        this.elements.navMenu.classList.remove('active');
    }
    
    scrollToCoach() {
        const coachSection = Utils.query('#coach');
        if (coachSection) {
            this.scrollToSection(coachSection);
        }
    }
}
