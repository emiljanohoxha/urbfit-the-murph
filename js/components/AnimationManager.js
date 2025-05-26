import { Utils } from '../utils.js';
import { CONFIG } from '../config.js';

export class AnimationManager {
    constructor() {
        this.animatedSections = new Set();
        this.observer = null;
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.addAnimationStyles();
    }
    
    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedSections.has(entry.target.id)) {
                    this.animatedSections.add(entry.target.id);
                    this.animateSection(entry.target);
                }
            });
        }, CONFIG.INTERSECTION_OBSERVER);
        
        // Observe sections for scroll animations
        const sections = Utils.queryAll('.coach-section, .challenge-section, .progress-section, .community-section');
        sections.forEach(section => {
            section.classList.add('animate-section');
            this.observer.observe(section);
        });
    }
    
    animateSection(section) {
        section.classList.add('animate-in');
        
        // Animate child elements with stagger
        const children = section.querySelectorAll('.coach-content > *, .challenge-content > *, .progress-dashboard > *, .community-content > *');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate-child-in');
            }, index * CONFIG.ANIMATION.STAGGER_DELAY);
        });
    }
    
    addAnimationStyles() {
        if (Utils.query('#animation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            .animate-section {
                opacity: 0;
                transform: translateY(50px);
                transition: all 0.8s ${CONFIG.ANIMATION.EASING};
            }
            
            .animate-section.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .animate-section > * {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ${CONFIG.ANIMATION.EASING};
            }
            
            .animate-section > *.animate-child-in {
                opacity: 1;
                transform: translateY(0);
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
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}
