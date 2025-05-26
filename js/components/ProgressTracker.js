import { Utils } from '../utils.js';
import { CONFIG } from '../config.js';

export class ProgressTracker {
    constructor() {
        this.workouts = Utils.getFromStorage(CONFIG.STORAGE_KEYS.WORKOUTS, []);
        this.chart = null;
        
        this.elements = {
            totalWorkouts: Utils.query('#totalWorkouts'),
            bestTime: Utils.query('#bestTime'),
            currentStreak: Utils.query('#currentStreak'),
            chartCanvas: Utils.query('#progressChart'),
            workoutForm: Utils.query('.workout-form')
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateStats();
        this.setupChart();
    }
    
    setupEventListeners() {
        if (this.elements.workoutForm) {
            this.elements.workoutForm.addEventListener('submit', (e) => {
                this.logWorkout(e);
            });
        }
    }
    
    logWorkout(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const workout = {
            date: new Date().toISOString(),
            time: parseInt(formData.get('workoutTime')),
            difficulty: formData.get('difficulty'),
            notes: formData.get('notes') || '',
            id: Date.now()
        };
        
        this.workouts.push(workout);
        Utils.setToStorage(CONFIG.STORAGE_KEYS.WORKOUTS, this.workouts);
        
        this.updateStats();
        this.setupChart();
        
        // Show success notification
        this.showNotification('Workout logged successfully! 🎉', 'success');
        
        // Reset form
        event.target.reset();
    }
    
    updateStats() {
        const totalWorkouts = this.workouts.length;
        const bestTime = this.workouts.length > 0 ? Math.min(...this.workouts.map(w => w.time)) : 0;
        const currentStreak = this.calculateStreak();
        
        if (this.elements.totalWorkouts) {
            Utils.animateValue(this.elements.totalWorkouts, 0, totalWorkouts, CONFIG.ANIMATION.DURATION.MEDIUM);
        }
        
        if (this.elements.bestTime) {
            this.elements.bestTime.textContent = bestTime > 0 ? `${bestTime}:00` : '--:--';
        }
        
        if (this.elements.currentStreak) {
            Utils.animateValue(this.elements.currentStreak, 0, currentStreak, CONFIG.ANIMATION.DURATION.MEDIUM);
        }
    }
    
    calculateStreak() {
        const sortedWorkouts = [...this.workouts].sort((a, b) => new Date(b.date) - new Date(a.date));
        let streak = 0;
        let currentDate = new Date();
        
        for (let workout of sortedWorkouts) {
            const workoutDate = new Date(workout.date);
            const dayDiff = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
            
            if (dayDiff <= streak + 1) {
                streak++;
                currentDate = workoutDate;
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    setupChart() {
        if (!this.elements.chartCanvas || typeof Chart === 'undefined') return;
        
        const sortedWorkouts = [...this.workouts].sort((a, b) => new Date(a.date) - new Date(b.date));
        const labels = sortedWorkouts.map((_, index) => `Workout ${index + 1}`);
        const data = sortedWorkouts.map(w => w.time);
        
        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }
        
        this.chart = new Chart(this.elements.chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Completion Time (minutes)',
                    data: data,
                    borderColor: '#ff6b35',
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ff6b35',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#fff' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#ccc' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#ccc' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            z-index: 4000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    getWorkouts() {
        return this.workouts;
    }
}
