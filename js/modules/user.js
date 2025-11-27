/**
 * User class for tracking typing statistics and race progress
 * Renamed from Kasutaja (Estonian) to User for consistency
 */
class User {
    completedrace = false;
    errorCount = 0;
    lettersSkipped = 0;
    typingIndex = 0;
    wordsperminute = 0;
    accuracy = 0;
    raceFinishTime = 0;

    constructor(name, isPlayer = false) {
        this.name = name;
        this.isPlayer = isPlayer;
        
        // Load stored stats if player
        if (isPlayer) {
            this.loadStoredStats();
        }
    }
    
    // Load user stats from localStorage
    loadStoredStats() {
        const stored = localStorage.getItem('typingStats');
        if (stored) {
            const stats = JSON.parse(stored);
            // You can use stats.history, stats.lessons, etc.
            // This just ensures the data is available
            this.storedStats = stats;
        }
    }
    
    // Get best WPM from history
    getBestWpm() {
        if (!this.storedStats?.history?.length) return 0;
        return Math.max(...this.storedStats.history.map(h => h.wpm));
    }
    
    // Get average accuracy from history
    getAverageAccuracy() {
        if (!this.storedStats?.history?.length) return 100;
        const sum = this.storedStats.history.reduce((acc, h) => acc + h.accuracy, 0);
        return Math.round(sum / this.storedStats.history.length);
    }
    
    // Get total races completed
    getTotalRaces() {
        return this.storedStats?.history?.length || 0;
    }

    finishRace(elapsedSeconds, raceText) {
        this.raceFinishTime = elapsedSeconds;
        this.updateStats(elapsedSeconds, raceText);

        this.completedrace = true;

    }

    updateStats(elapsedSeconds, raceText) {
        // Calculate characters typed (standard: 5 characters = 1 word)
        let charCount = this.typingIndex - this.lettersSkipped;
        
        // Calculate time in minutes from seconds
        let timeInMinutes = elapsedSeconds / 60;
        
        // Calculate accuracy
        this.accuracy = Math.round(((raceText.length - this.errorCount) / raceText.length) * 100);
        
        // Calculate WPM (avoid division by zero, require at least 1 second)
        if (elapsedSeconds >= 1) {
            this.wordsperminute = Math.round((charCount / 5) / timeInMinutes);
        } else {
            this.wordsperminute = 0;
        }
        
        // Ensure WPM is not negative or unreasonably high
        this.wordsperminute = Math.max(0, Math.min(this.wordsperminute, 300));

        if (this.isPlayer) {
            const wpmEl = document.getElementById("wpmContainer");
            const accEl = document.getElementById("accuracyContainer");
            
            if (wpmEl) wpmEl.textContent = this.wordsperminute.toString();
            if (accEl) accEl.innerHTML = `${this.accuracy}<small>%</small>`;
        }
    }
    
    // Save race completion stats to localStorage
    saveStats(wpm, accuracy, time) {
        const stats = JSON.parse(localStorage.getItem('typingStats') || '{}');
        
        if (!stats.races) stats.races = [];
        if (!stats.history) stats.history = [];
        
        // Add to race history
        stats.races.push({
            date: new Date().toISOString(),
            wpm,
            accuracy,
            time: time.toFixed(2),
            errors: this.errorCount
        });
        
        // Also add to general history for cross-feature stats
        stats.history.push({
            date: new Date().toISOString(),
            type: 'race',
            wpm,
            accuracy,
            errors: this.errorCount
        });
        
        // Calculate and store best stats
        if (!stats.best) stats.best = { wpm: 0, accuracy: 0 };
        stats.best.wpm = Math.max(stats.best.wpm, wpm);
        stats.best.accuracy = Math.max(stats.best.accuracy, accuracy);
        
        // Keep only last 100 entries
        if (stats.races.length > 100) {
            stats.races = stats.races.slice(-100);
        }
        if (stats.history.length > 100) {
            stats.history = stats.history.slice(-100);
        }
        
        localStorage.setItem('typingStats', JSON.stringify(stats));
        
        // Update stored stats reference
        this.storedStats = stats;
    }
}

// Export both names for backward compatibility
export { User, User as Kasutaja };
export default User;
