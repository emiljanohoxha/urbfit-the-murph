import { Timer } from './components/Timer.js';
import { Navigation } from './components/Navigation.js';
import { ProgressTracker } from './components/ProgressTracker.js';
import { AnimationManager } from './components/AnimationManager.js';
import { CONFIG } from './config.js';
import { Utils } from './utils.js';

class URBFITApp {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Initialize all components
        this.components.timer = new Timer();
        this.components.navigation = new Navigation();
        this.components.progressTracker = new ProgressTracker();
        this.components.animationManager = new AnimationManager();
        
        // Setup global event handlers
        this.setupGlobalEvents();
        this.populateLeaderboard();
        this.setupImageHandling();
        
        // Ensure proper height calculation
        this.fixDocumentHeight();
    }
    
    setupGlobalEvents() {
        // Gallery image clicks
        Utils.queryAll('.gallery-item').forEach(img => {
            img.addEventListener('click', () => this.openImageModal(img.src));
        });
        
        // Prevent default scroll behavior on specific elements
        Utils.queryAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });
    }
    
    fixDocumentHeight() {
        // Ensure document height is properly calculated
        const body = document.body;
        const html = document.documentElement;
        
        // Force proper height calculation
        const height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        
        // Set a maximum height to prevent infinite extension
        document.documentElement.style.maxHeight = `${height}px`;
        
        // Add scroll bounds
        this.addScrollBounds();
    }
    
    addScrollBounds() {
        let scrollTimeout;
        
        const handleScroll = () => {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                
                // Prevent scroll beyond document bounds
                if (scrollTop + windowHeight >= documentHeight) {
                    window.scrollTo({
                        top: documentHeight - windowHeight,
                        behavior: 'instant'
                    });
                }
            }, 16);
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    setupImageHandling() {
        // Global image error handling
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                const alt = e.target.alt || 'Image';
                const width = e.target.offsetWidth || 400;
                const height = e.target.offsetHeight || 300;
                
                Utils.handleImageError(e.target, alt, width, height);
            }
        }, true);
        
        // Add loading states to images
        Utils.queryAll('img').forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0.5';
                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                    img.style.transition = 'opacity 0.3s ease';
                });
            }
        });
    }
    
    populateLeaderboard() {
        const leaderboardEl = Utils.query('#leaderboard');
        if (!leaderboardEl) return;
        
        const leaderboardHTML = CONFIG.LEADERBOARD_DATA.map((athlete, index) => `
            <div class="leaderboard-item" style="animation: fadeInUp 0.5s ease ${index * 0.1}s both;">
                <div class="rank">${index + 1}</div>
                <img src="${athlete.avatar}" alt="${athlete.name}" class="athlete-avatar" 
                     onerror="this.src='https://via.placeholder.com/50x50/1a1a1a/ff6b35?text=${athlete.name.charAt(0)}'">
                <div class="athlete-info">
                    <div class="athlete-name">${athlete.name}</div>
                    <div class="athlete-time">${athlete.time}</div>
                </div>
                ${index === 0 ? '<div class="crown"><i class="fas fa-crown"></i></div>' : ''}
            </div>
        `).join('');
        
        leaderboardEl.innerHTML = leaderboardHTML;
        this.addLeaderboardStyles();
    }
    
    addLeaderboardStyles() {
        if (Utils.query('#leaderboard-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'leaderboard-styles';
        style.textContent = `
            .leaderboard-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(255, 107, 53, 0.1);
                border-radius: 10px;
                margin-bottom: 0.5rem;
                border: 1px solid rgba(255, 107, 53, 0.2);
                position: relative;
                transition: transform 0.3s ease;
            }
            
            .leaderboard-item:hover {
                transform: translateX(5px);
            }
            
            .rank {
                font-size: 1.5rem;
                font-weight: 700;
                color: #ff6b35;
                width: 30px;
            }
            
            .athlete-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
            }
            
            .athlete-info {
                flex: 1;
            }
            
            .athlete-name {
                color: #fff;
                font-weight: 600;
                margin-bottom: 0.2rem;
            }
            
            .athlete-time {
                color: #ff6b35;
                font-weight: 500;
            }
            
            .crown {
                color: #ffd700;
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(style);
    }
    
    openImageModal(imageSrc) {
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <span class="close-image">&times;</span>
                <img src="${imageSrc}" alt="Gallery image">
            </div>
        `;
        
        modal.style.cssText = `
            display: block;
            position: fixed;
            z-index: 3000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(5px);
        `;
        
        const content = modal.querySelector('.image-modal-content');
        content.style.cssText = `
            position: relative;
            margin: 5% auto;
            width: 90%;
            max-width: 800px;
            text-align: center;
        `;
        
        const img = modal.querySelector('img');
        img.style.cssText = `
            width: 100%;
            height: auto;
            border-radius: 10px;
        `;
        
        const closeBtn = modal.querySelector('.close-image');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            color: #fff;
            font-size: 2rem;
            cursor: pointer;
            z-index: 3001;
        `;
        
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
        
        document.body.appendChild(modal);
    }
    
    // Public API methods
    startChallenge() {
        this.components.timer.showModal();
    }
    
    scrollToCoach() {
        this.components.navigation.scrollToCoach();
    }
    
    startTimer() {
        this.components.timer.start();
    }
    
    pauseTimer() {
        this.components.timer.pause();
    }
    
    resetTimer() {
        this.components.timer.reset();
    }
    
    logWorkout(event) {
        this.components.progressTracker.logWorkout(event);
    }
    
    destroy() {
        if (this.components.animationManager) {
            this.components.animationManager.destroy();
        }
    }
}

// Global functions for HTML onclick events
window.startChallenge = () => window.urbfitApp?.startChallenge();
window.scrollToCoach = () => window.urbfitApp?.scrollToCoach();
window.startTimer = () => window.urbfitApp?.startTimer();
window.pauseTimer = () => window.urbfitApp?.pauseTimer();
window.resetTimer = () => window.urbfitApp?.resetTimer();
window.logWorkout = (event) => window.urbfitApp?.logWorkout(event);

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.urbfitApp = new URBFITApp();
});

export default URBFITApp;
