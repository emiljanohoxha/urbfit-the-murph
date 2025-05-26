import { Utils } from '../utils.js';

export class Timer {
    constructor() {
        this.state = {
            startTime: null,
            elapsedTime: 0,
            isRunning: false,
            interval: null
        };
        
        this.elements = {
            modal: Utils.query('#timerModal'),
            display: Utils.query('#timerDisplay'),
            startBtn: Utils.query('#startBtn'),
            pauseBtn: Utils.query('#pauseBtn'),
            resetBtn: Utils.query('#resetBtn')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    setupEventListeners() {
        // Modal close events
        const closeBtn = Utils.query('.close');
        if (closeBtn) {
            closeBtn.onclick = () => this.hideModal();
        }
        
        window.addEventListener('click', (event) => {
            if (event.target === this.elements.modal) {
                this.hideModal();
            }
        });
    }
    
    showModal() {
        if (this.elements.modal) {
            this.elements.modal.style.display = 'block';
            
            const modalContent = this.elements.modal.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'scale(0.7)';
                modalContent.style.opacity = '0';
                modalContent.style.transition = 'all 0.3s ease';
                
                requestAnimationFrame(() => {
                    modalContent.style.transform = 'scale(1)';
                    modalContent.style.opacity = '1';
                });
            }
        }
    }
    
    hideModal() {
        if (this.elements.modal) {
            this.elements.modal.style.display = 'none';
        }
    }
    
    start() {
        if (!this.state.isRunning) {
            this.state.startTime = Date.now() - this.state.elapsedTime;
            this.state.isRunning = true;
            this.state.interval = setInterval(() => this.updateDisplay(), 10);
            
            this.updateButtons();
        }
    }
    
    pause() {
        if (this.state.isRunning) {
            this.state.isRunning = false;
            clearInterval(this.state.interval);
            
            this.updateButtons();
        }
    }
    
    reset() {
        this.state.isRunning = false;
        this.state.elapsedTime = 0;
        clearInterval(this.state.interval);
        
        this.updateDisplay();
        this.updateButtons();
    }
    
    updateDisplay() {
        if (this.state.isRunning) {
            this.state.elapsedTime = Date.now() - this.state.startTime;
        }
        
        if (this.elements.display) {
            this.elements.display.textContent = Utils.formatTime(this.state.elapsedTime);
        }
    }
    
    updateButtons() {
        if (this.elements.startBtn && this.elements.pauseBtn) {
            if (this.state.isRunning) {
                this.elements.startBtn.style.display = 'none';
                this.elements.pauseBtn.style.display = 'inline-flex';
            } else {
                this.elements.startBtn.style.display = 'inline-flex';
                this.elements.pauseBtn.style.display = 'none';
            }
        }
    }
    
    getElapsedTime() {
        return this.state.elapsedTime;
    }
    
    isActive() {
        return this.state.isRunning;
    }
}
