class MurphWorkout {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.currentPhase = 1;
        
        this.reps = {
            pullups: 0,
            pushups: 0,
            squats: 0
        };
        
        this.targets = {
            pullups: 100,
            pushups: 200,
            squats: 300
        };
        
        this.phases = {
            1: { name: 'First Run', completed: false },
            2: { name: 'Strength Circuit', completed: false },
            3: { name: 'Final Run', completed: false }
        };
        
        this.restStartTime = null;
        this.restDuration = 0;
        
        this.motivationalQuotes = [
            "Courage is not the absence of fear, but action in spite of it.",
            "The body achieves what the mind believes.",
            "Pain is weakness leaving the body.",
            "Embrace the suck.",
            "Get comfortable being uncomfortable.",
            "Every rep counts. Every second matters.",
            "Honor those who served through your effort.",
            "Push beyond your limits."
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.rotateQuotes();
        this.setActivePhase(1);
    }
    
    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pause());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.isRunning && !this.isPaused) {
                    this.start();
                } else if (this.isRunning) {
                    this.pause();
                }
            }
        });
    }
    
    start() {
        if (this.isPaused) {
            this.pausedTime += Date.now() - this.pauseTime;
            this.isPaused = false;
        } else {
            this.startTime = Date.now();
            this.pausedTime = 0;
        }
        
        this.isRunning = true;
        this.updateButtons();
        this.updateTimer();
        
        // Play start sound
        this.playSound();
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            this.pauseTime = Date.now();
            this.updateButtons();
        }
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.currentPhase = 1;
        
        this.reps = { pullups: 0, pushups: 0, squats: 0 };
        this.phases = {
            1: { name: 'First Run', completed: false },
            2: { name: 'Strength Circuit', completed: false },
            3: { name: 'Final Run', completed: false }
        };
        
        this.updateButtons();
        this.updateDisplay();
        this.setActivePhase(1);
        this.resetPhaseStyles();
    }
    
    updateTimer() {
        if (!this.isRunning) return;
        
        const elapsed = Date.now() - this.startTime - this.pausedTime;
        const formatted = this.formatTime(elapsed);
        document.getElementById('totalTime').textContent = formatted;
        
        this.updatePace();
        this.updateEstimatedFinish();
        
        requestAnimationFrame(() => this.updateTimer());
    }
    
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateButtons() {
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (this.isRunning) {
            startBtn.disabled = true;
            pauseBtn.disabled = false;
            startBtn.textContent = 'RUNNING...';
        } else if (this.isPaused) {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            startBtn.textContent = 'RESUME';
        } else {
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            startBtn.textContent = 'START WORKOUT';
        }
    }
    
    addReps(exercise, amount) {
        if (this.reps[exercise] < this.targets[exercise]) {
            this.reps[exercise] = Math.min(this.reps[exercise] + amount, this.targets[exercise]);
            this.updateDisplay();
            this.checkPhase2Completion();
            this.playSound();
        }
    }
    
    subtractReps(exercise, amount) {
        if (this.reps[exercise] > 0) {
            this.reps[exercise] = Math.max(this.reps[exercise] - amount, 0);
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        // Update rep counters
        document.getElementById('pullupCount').textContent = `${this.reps.pullups}/${this.targets.pullups}`;
        document.getElementById('pushupCount').textContent = `${this.reps.pushups}/${this.targets.pushups}`;
        document.getElementById('squatCount').textContent = `${this.reps.squats}/${this.targets.squats}`;
        
        // Update progress bars
        this.updateProgressBar('pullupProgress', this.reps.pullups, this.targets.pullups);
        this.updateProgressBar('pushupProgress', this.reps.pushups, this.targets.pushups);
        this.updateProgressBar('squatProgress', this.reps.squats, this.targets.squats);
        
        // Update overall progress
        this.updateOverallProgress();
    }
    
    updateProgressBar(elementId, current, target) {
        const percentage = (current / target) * 100;
        const element = document.getElementById(elementId);
        element.style.width = `${percentage}%`;
    }
    
    updateOverallProgress() {
        const totalCompleted = this.phases[1].completed ? 1 : 0;
        const phase2Progress = (this.reps.pullups / this.targets.pullups + 
                              this.reps.pushups / this.targets.pushups + 
                              this.reps.squats / this.targets.squats) / 3;
        const phase3Progress = this.phases[3].completed ? 1 : 0;
        
        const overallProgress = (totalCompleted + phase2Progress + phase3Progress) / 3 * 100;
        
        document.getElementById('overallProgressFill').style.width = `${overallProgress}%`;
        document.getElementById('overallProgressText').textContent = `${Math.round(overallProgress)}% Complete`;
    }
    
    completePhase(phaseNumber) {
        this.phases[phaseNumber].completed = true;
        this.animatePhaseCompletion(phaseNumber);
        this.playSound();
        
        if (phaseNumber === 1) {
            this.setActivePhase(2);
        } else if (phaseNumber === 3) {
            this.completeWorkout();
        }
        
        this.updateDisplay();
    }
    
    checkPhase2Completion() {
        if (this.reps.pullups >= this.targets.pullups && 
            this.reps.pushups >= this.targets.pushups && 
            this.reps.squats >= this.targets.squats) {
            
            if (!this.phases[2].completed) {
                this.phases[2].completed = true;
                this.animatePhaseCompletion(2);
                this.setActivePhase(3);
            }
        }
    }
    
    setActivePhase(phaseNumber) {
        // Remove active class from all phases
        document.querySelectorAll('.phase-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to current phase
        const activePhase = document.getElementById(`phase${phaseNumber}`);
        if (activePhase && !this.phases[phaseNumber].completed) {
            activePhase.classList.add('active');
        }
        
        this.currentPhase = phaseNumber;
    }
    
    animatePhaseCompletion(phaseNumber) {
        const phaseCard = document.getElementById(`phase${phaseNumber}`);
        phaseCard.classList.add('completed', 'phase-completing');
        
        const statusElement = phaseCard.querySelector('.phase-status');
        statusElement.textContent = '✅';
        
        setTimeout(() => {
            phaseCard.classList.remove('phase-completing');
        }, 600);
    }
    
    resetPhaseStyles() {
        document.querySelectorAll('.phase-card').forEach(card => {
            card.classList.remove('active', 'completed', 'phase-completing');
        });
        
        document.querySelectorAll('.phase-status').forEach(status => {
            status.textContent = '⏳';
        });
    }
    
    completeWorkout() {
        this.pause();
        setTimeout(() => {
            alert(`🎉 CONGRATULATIONS! 🎉\n\nYou completed The Murph!\n\nTotal Time: ${document.getElementById('totalTime').textContent}\n\nHonor. Courage. Commitment.`);
        }, 1000);
    }
    
    setPartition(type) {
        if (type === 'cindy') {
            // Cindy style: 20 rounds of 5-10-15
            alert('Cindy Style Partition:\n20 rounds of:\n• 5 Pull-ups\n• 10 Push-ups\n• 15 Air Squats');
        } else if (type === 'quarter') {
            // Quarter method: 4 rounds of 25-50-75
            alert('Quarter Method:\n4 rounds of:\n• 25 Pull-ups\n• 50 Push-ups\n• 75 Air Squats');
        }
    }
    
    startRestTimer() {
        if (this.restStartTime) {
            // Stop rest timer
            this.restStartTime = null;
            document.getElementById('restBtn').textContent = 'Start Rest';
            document.getElementById('restTime').textContent = '00:00';
        } else {
            // Start rest timer
            this.restStartTime = Date.now();
            document.getElementById('restBtn').textContent = 'Stop Rest';
            this.updateRestTimer();
        }
    }
    
    updateRestTimer() {
        if (!this.restStartTime) return;
        
        const elapsed = Date.now() - this.restStartTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        document.getElementById('restTime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        
        requestAnimationFrame(() => this.updateRestTimer());
    }
    
    updatePace() {
        if (!this.startTime) return;
        
        const elapsed = Date.now() - this.startTime - this.pausedTime;
        const minutes = elapsed / 60000;
        
        // Calculate pace based on completion percentage
        const overallProgress = this.calculateOverallProgress();
        if (overallProgress > 0) {
            const estimatedTotal = minutes / (overallProgress / 100);
            const pace = estimatedTotal / 60; // hours
            document.getElementById('currentPace').textContent = this.formatTime(pace * 3600000);
        }
    }
    
    updateEstimatedFinish() {
        if (!this.startTime) return;
        
        const elapsed = Date.now() - this.startTime - this.pausedTime;
        const minutes = elapsed / 60000;
        const overallProgress = this.calculateOverallProgress();
        
        if (overallProgress > 5) { // Only show after 5% completion
            const estimatedTotal = minutes / (overallProgress / 100);
            const remaining = estimatedTotal - minutes;
            document.getElementById('estimatedFinish').textContent = this.formatTime(remaining * 60000);
        }
    }
    
    calculateOverallProgress() {
        const phase1Progress = this.phases[1].completed ? 33.33 : 0;
        const phase2Progress = ((this.reps.pullups / this.targets.pullups + 
                                this.reps.pushups / this.targets.pushups + 
                                this.reps.squats / this.targets.squats) / 3) * 33.33;
        const phase3Progress = this.phases[3].completed ? 33.33 : 0;
        
        return phase1Progress + phase2Progress + phase3Progress;
    }
    
    rotateQuotes() {
        let currentQuoteIndex = 0;
        const quoteElement = document.getElementById('motivationalQuote');
        
        setInterval(() => {
            currentQuoteIndex = (currentQuoteIndex + 1) % this.motivationalQuotes.length;
            quoteElement.style.opacity = '0';
            
            setTimeout(() => {
                quoteElement.textContent = `"${this.motivationalQuotes[currentQuoteIndex]}"`;
                quoteElement.style.opacity = '1';
            }, 300);
        }, 15000);
    }
    
    playSound() {
        const audio = document.getElementById('completeSound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Ignore audio play errors (autoplay restrictions)
            });
        }
    }
}

// Global functions for button clicks
function addReps(exercise, amount) {
    workout.addReps(exercise, amount);
}

function subtractReps(exercise, amount) {
    workout.subtractReps(exercise, amount);
}

function completePhase(phaseNumber) {
    workout.completePhase(phaseNumber);
}

function setPartition(type) {
    workout.setPartition(type);
}

function startRestTimer() {
    workout.startRestTimer();
}

// Initialize the workout app
const workout = new MurphWorkout();

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}
