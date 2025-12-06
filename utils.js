/**
 * Utility functions for Minesweeper: Oppenheimer Edition
 */

// LocalStorage Helper Functions
const Storage = {
    /**
     * Get high scores for a specific difficulty
     */
    getHighScore: function(difficulty) {
        const key = `minesweeper_highscore_${difficulty}`;
        const score = localStorage.getItem(key);
        return score ? JSON.parse(score) : null;
    },

    /**
     * Save high score for a specific difficulty
     */
    saveHighScore: function(difficulty, time, moves, accuracy) {
        const key = `minesweeper_highscore_${difficulty}`;
        const score = {
            time: time,
            moves: moves,
            accuracy: accuracy,
            date: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(score));
    },

    /**
     * Check if current score is a high score
     */
    isHighScore: function(difficulty, time) {
        const currentHigh = this.getHighScore(difficulty);
        return !currentHigh || time < currentHigh.time;
    },

    /**
     * Get all high scores
     */
    getAllHighScores: function() {
        const difficulties = ['beginner', 'intermediate', 'expert'];
        const scores = {};
        difficulties.forEach(diff => {
            scores[diff] = this.getHighScore(diff);
        });
        return scores;
    }
};

// Animation Utilities
const Animations = {
    /**
     * Create particle effect at a specific position
     */
    createParticles: function(x, y, count = 8, color = '#ff4500') {
        const container = document.body;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = color;
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 30 + Math.random() * 30;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            container.appendChild(particle);
            
            setTimeout(() => particle.remove(), 800);
        }
    },

    /**
     * Create explosion effect
     */
    createExplosion: function(x, y) {
        this.createParticles(x, y, 16, '#ff0000');
        
        // Add additional ring of particles
        setTimeout(() => {
            this.createParticles(x, y, 12, '#ff8c00');
        }, 100);
    },

    /**
     * Create confetti effect for victory
     */
    createConfetti: function(count = 50) {
        const container = document.body;
        const colors = ['#ffd700', '#ff4500', '#ff8c00', '#00ff00', '#0080ff'];
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * window.innerWidth + 'px';
                confetti.style.top = '-10px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.width = (5 + Math.random() * 10) + 'px';
                confetti.style.height = (5 + Math.random() * 10) + 'px';
                
                container.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    },

    /**
     * Get animation speed multiplier based on settings
     */
    getSpeedMultiplier: function() {
        const speed = localStorage.getItem('animation_speed') || 'normal';
        const multipliers = {
            slow: 2,
            normal: 1,
            fast: 0.5
        };
        return multipliers[speed] || 1;
    },

    /**
     * Set animation speed
     */
    setAnimationSpeed: function(speed) {
        localStorage.setItem('animation_speed', speed);
        const root = document.documentElement;
        const multiplier = this.getSpeedMultiplier();
        
        root.style.setProperty('--anim-fast', (0.15 * multiplier) + 's');
        root.style.setProperty('--anim-normal', (0.3 * multiplier) + 's');
        root.style.setProperty('--anim-slow', (0.6 * multiplier) + 's');
    }
};

// Sound Manager
const SoundManager = {
    enabled: true,
    
    /**
     * Initialize sound manager
     */
    init: function() {
        const savedState = localStorage.getItem('sound_enabled');
        this.enabled = savedState !== 'false';
    },

    /**
     * Toggle sound on/off
     */
    toggle: function() {
        this.enabled = !this.enabled;
        localStorage.setItem('sound_enabled', this.enabled);
        return this.enabled;
    },

    /**
     * Play a sound effect (placeholder for actual sound implementation)
     */
    play: function(soundType) {
        if (!this.enabled) return;
        
        // This is a placeholder. In a full implementation, you would:
        // 1. Load audio files
        // 2. Play the appropriate sound based on soundType
        // Sound types: 'click', 'flag', 'reveal', 'explosion', 'victory'
        
        console.log(`Sound: ${soundType}`);
    }
};

// Utility Functions
const Utils = {
    /**
     * Format time in MM:SS format
     */
    formatTime: function(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },

    /**
     * Calculate accuracy percentage
     */
    calculateAccuracy: function(totalCells, mines, moves) {
        const safeCells = totalCells - mines;
        if (moves === 0) return 0;
        const efficiency = Math.min((safeCells / moves) * 100, 100);
        return Math.round(efficiency);
    },

    /**
     * Get random Oppenheimer quote
     */
    getRandomQuote: function(isWin) {
        const winQuotes = [
            "Success. The test was a complete triumph.",
            "Theory has become reality.",
            "A new era has begun.",
            "The chain reaction is complete.",
            "You have mastered the power."
        ];
        
        const loseQuotes = [
            "Now I am become Death, the destroyer of worlds.",
            "The consequences cannot be undone.",
            "Theory and practice have diverged catastrophically.",
            "We knew the world would not be the same.",
            "The test has failed. Recalibration required."
        ];
        
        const quotes = isWin ? winQuotes : loseQuotes;
        return quotes[Math.floor(Math.random() * quotes.length)];
    },

    /**
     * Debounce function for performance
     */
    debounce: function(func, wait) {
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

    /**
     * Get cell position on screen
     */
    getCellPosition: function(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    },

    /**
     * Shuffle array (Fisher-Yates algorithm)
     */
    shuffleArray: function(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    SoundManager.init();
    Animations.setAnimationSpeed(localStorage.getItem('animation_speed') || 'normal');
});
