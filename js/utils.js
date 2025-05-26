export const Utils = {
    // DOM utilities
    query: (selector) => document.querySelector(selector),
    queryAll: (selector) => document.querySelectorAll(selector),
    
    // Animation utilities
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    
    animateValue: (element, start, end, duration, callback = null) => {
        const range = end - start;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = Math.floor(start + (range * Utils.easeOutCubic(progress)));
            element.textContent = value;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };
        
        requestAnimationFrame(animate);
    },
    
    // Time utilities
    formatTime: (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    
    // Storage utilities
    getFromStorage: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.warn(`Error reading from localStorage: ${error}`);
            return defaultValue;
        }
    },
    
    setToStorage: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Error writing to localStorage: ${error}`);
        }
    },
    
    // Debounce utility
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Image error handling
    handleImageError: (img, alt, width = 400, height = 300) => {
        if (!img.src.includes('placeholder') && !img.src.includes('via.placeholder')) {
            img.src = `https://via.placeholder.com/${width}x${height}/1a1a1a/ff6b35?text=${encodeURIComponent(alt)}`;
        }
    }
};
