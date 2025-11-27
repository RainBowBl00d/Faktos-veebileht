import { User } from "./modules/user.js";

// Race state management
const race = {
    active: false,
    started: false,
    startTime: null,
    elapsedTime: 0,
    racers: [],
    texts: [],
    currentTextId: null,
    tekst: "",

    async loadTexts() {
        try {
            const response = await fetch('./data/race-texts.json');
            const data = await response.json();
            this.texts = data.texts;
            this.populateTextSelector();
            if (this.texts.length > 0) {
                this.selectText(this.texts[0].id);
            }
        } catch (error) {
            console.error('Error loading texts:', error);
            this.tekst = "The quick brown fox jumps over the lazy dog.";
            this.updateTextContainer(playerracer);
        }
    },

    populateTextSelector() {
        const selector = document.getElementById('text-selector');
        selector.innerHTML = '';
        
        this.texts.forEach(text => {
            const option = document.createElement('option');
            option.value = text.id;
            option.textContent = `${text.title} (${text.difficulty})`;
            selector.appendChild(option);
        });
    },

    selectText(textId) {
        const text = this.texts.find(t => t.id === parseInt(textId));
        if (text) {
            this.currentTextId = text.id;
            this.tekst = text.text;
            this.reset();
        }
    },

    reset() {
        this.active = false;
        this.started = false;
        this.startTime = null;
        this.elapsedTime = 0;
        
        playerracer.typingIndex = 0;
        playerracer.errorCount = 0;
        playerracer.completedrace = false;
        
        document.getElementById('wpmContainer').textContent = '0';
        document.getElementById('accuracyContainer').innerHTML = '100<small>%</small>';
        document.getElementById('timeContainer').innerHTML = '0.0<small>s</small>';
        
        this.showReadyState();
    },

    showReadyState() {
        const container = document.getElementById('textContainer');
        // Show first char as current to indicate start typing here
        const firstChar = this.tekst.charAt(0);
        const remaining = this.tekst.slice(1);
        container.innerHTML = `<span class="current">${firstChar}</span><span class="remaining">${remaining}</span>`;
    },

    start() {
        if (this.started) return;
        
        this.active = true;
        this.started = true;
        this.startTime = performance.now();
        this.updateTextContainer(playerracer);
        
        document.getElementById('startBtn').textContent = 'Racing...';
        document.getElementById('startBtn').disabled = true;
    },

    updateTextContainer(playerracer) {
        const container = document.getElementById("textContainer");
        const typed = this.tekst.slice(0, playerracer.typingIndex);
        const current = this.tekst.charAt(playerracer.typingIndex);
        const remaining = this.tekst.slice(playerracer.typingIndex + 1);

        container.innerHTML = `<span class="typed">${typed}</span><span class="current">${current}</span><span class="remaining">${remaining}</span>`;
    },

    updateTime() {
        if (!this.active || !this.startTime) return;
        
        this.elapsedTime = (performance.now() - this.startTime) / 1000;
        document.getElementById('timeContainer').innerHTML = 
            `${this.elapsedTime.toFixed(1)}<small>s</small>`;
    },

    showCompletion(wpm, accuracy, time) {
        document.getElementById('finalWpm').textContent = wpm;
        document.getElementById('finalAccuracy').textContent = `${accuracy}%`;
        document.getElementById('finalTime').textContent = `${time.toFixed(1)}s`;
        document.getElementById('completeOverlay').classList.add('active');
    },

    hideCompletion() {
        document.getElementById('completeOverlay').classList.remove('active');
    }
};

const playerracer = new User("Player", true);
race.racers.push(playerracer);

// Event Listeners
document.addEventListener("keydown", (event) => {
    // Handle backspace
    if (event.key === 'Backspace') {
        event.preventDefault();
        if (race.active && playerracer.typingIndex > 0) {
            playerracer.typingIndex--;
            race.updateTextContainer(playerracer);
        }
        return;
    }
});

document.addEventListener("keypress", (event) => {
    // Auto-start on first correct keypress
    if (!race.active && race.tekst && !race.started) {
        if (event.key === race.tekst.charAt(0)) {
            race.start();
            // Continue to process this keypress below
        } else {
            // Wrong first key - show error feedback
            const container = document.getElementById('textContainer');
            container.classList.add('error-shake');
            setTimeout(() => container.classList.remove('error-shake'), 200);
            return;
        }
    }
    
    if (!race.active) return;

    if (event.key === race.tekst.charAt(playerracer.typingIndex)) {
        playerracer.typingIndex++;
        race.updateTextContainer(playerracer);

        if (playerracer.typingIndex >= race.tekst.length) {
            race.active = false;
            const wpm = playerracer.updateStats(race.elapsedTime, race.tekst);
            const accuracy = Math.round(((race.tekst.length - playerracer.errorCount) / race.tekst.length) * 100);
            playerracer.finishRace(race.elapsedTime, race.tekst);
            
            // Save stats to localStorage
            playerracer.saveStats(playerracer.wordsperminute, accuracy, race.elapsedTime);
            
            race.showCompletion(playerracer.wordsperminute, accuracy, race.elapsedTime);
        }
    } else {
        playerracer.errorCount++;
        // Visual error feedback - shake and flash red
        const container = document.getElementById('textContainer');
        container.classList.add('error-shake');
        
        // Flash the current character red
        const currentSpan = container.querySelector('.current');
        if (currentSpan) {
            currentSpan.classList.add('error');
            setTimeout(() => currentSpan.classList.remove('error'), 300);
        }
        
        setTimeout(() => container.classList.remove('error-shake'), 200);
    }
});

// UI Controls
document.getElementById('text-selector').addEventListener('change', (e) => {
    if (e.target.value) {
        race.selectText(e.target.value);
    }
});

document.getElementById('startBtn').addEventListener('click', () => {
    // Focus hint - just start typing!
    document.getElementById('textContainer').focus();
});

document.getElementById('restartBtn').addEventListener('click', () => {
    race.reset();
    document.getElementById('startBtn').textContent = 'Start typing...';
    document.getElementById('startBtn').disabled = true;
});

document.getElementById('tryAgainBtn').addEventListener('click', () => {
    race.hideCompletion();
    race.reset();
    document.getElementById('startBtn').textContent = 'Start typing...';
    document.getElementById('startBtn').disabled = true;
});

// Timer update loop using requestAnimationFrame for smooth updates
function gameLoop() {
    race.updateTime();
    if (race.active && race.startTime && !playerracer.completedrace) {
        // Calculate fresh elapsed time for accurate WPM
        const currentElapsed = (performance.now() - race.startTime) / 1000;
        playerracer.updateStats(currentElapsed, race.tekst);
    }
    requestAnimationFrame(gameLoop);
}

// Initialize
race.loadTexts();
requestAnimationFrame(gameLoop);
