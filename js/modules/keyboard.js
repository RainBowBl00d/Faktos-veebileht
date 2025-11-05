export class KeyboardComponent {
  constructor(containerSelector, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.options = {
      practiceText: options.practiceText || "the quick brown fox jumps over the lazy dog",
      showPractice: options.showPractice !== false,
      onComplete: options.onComplete || null,
      onKeyPress: options.onKeyPress || null,
      onLineComplete: options.onLineComplete || null,
      jsonPath: options.jsonPath || null,
      lessonId: options.lessonId || null,
      ...options
    };
    
    this.currentIndex = 0;
    this.errors = 0;
    this.totalKeyPresses = 0;
    this.practiceTextElement = null;
    this.progressElement = null;
    this.totalElement = null;
    this.accuracyElement = null;
    this.errorsElement = null;
    this.lessons = null;
    this.currentLesson = null;
    this.currentLineIndex = 0;
    this.lines = [];
    
    this.init();
  }
  
  async init() {
    if (!this.container) {
      console.error('Keyboard container not found');
      return;
    }
    
    if (this.options.jsonPath) {
      await this.loadLessons();
    }
    
    this.render();
    this.attachEventListeners();
    this.initializeStatsElements();
    
    if (this.lessons) {
      this.renderLessonSelector();
    }
    
    if (this.options.showPractice) {
      this.displayPracticeText();
    }
    
    this.updateStats();
  }
  
  async loadLessons() {
    try {
      const response = await fetch(this.options.jsonPath);
      const data = await response.json();
      this.lessons = data.lessons;
      
      if (this.options.lessonId) {
        this.currentLesson = this.lessons.find(l => l.id === this.options.lessonId);
      } else {
        this.currentLesson = this.lessons[0];
      }
      
      if (this.currentLesson) {
        this.lines = this.currentLesson.lines;
        this.options.practiceText = this.lines[0];
      }
    } catch (error) {
      console.error('Failed to load lessons:', error);
    }
  }
  
  initializeStatsElements() {
    this.progressElement = document.getElementById('progress');
    this.totalElement = document.getElementById('total');
    this.accuracyElement = document.getElementById('accuracy');
    this.errorsElement = document.getElementById('errors');
    this.currentLineElement = document.getElementById('current-line');
    this.totalLinesElement = document.getElementById('total-lines');
  }
  
  updateStats() {
    if (this.progressElement) {
      this.progressElement.textContent = this.currentIndex;
    }
    if (this.totalElement) {
      this.totalElement.textContent = this.options.practiceText.length;
    }
    if (this.errorsElement) {
      this.errorsElement.textContent = this.errors;
    }
    if (this.accuracyElement) {
      const accuracy = this.totalKeyPresses === 0 ? 100 : 
        Math.round(((this.totalKeyPresses - this.errors) / this.totalKeyPresses) * 100);
      this.accuracyElement.textContent = accuracy + '%';
    }
    if (this.currentLineElement) {
      this.currentLineElement.textContent = this.currentLineIndex + 1;
    }
    if (this.totalLinesElement) {
      this.totalLinesElement.textContent = this.lines ? this.lines.length : 1;
    }
  }
  
  renderLessonSelector() {
    const selectorDropdown = document.getElementById('lesson-selector');
    if (!selectorDropdown || !this.lessons) return;
    
    selectorDropdown.innerHTML = '';
    
    this.lessons.forEach(lesson => {
      const option = document.createElement('option');
      option.value = lesson.id;
      option.textContent = `${lesson.title} (${lesson.lines.length} lines)`;
      
      if (this.currentLesson && lesson.id === this.currentLesson.id) {
        option.selected = true;
      }
      
      selectorDropdown.appendChild(option);
    });
    
    selectorDropdown.addEventListener('change', (e) => {
      const lessonId = parseInt(e.target.value);
      this.setLesson(lessonId);
    });
  }
  
  render() {
    const html = `
      ${this.options.showPractice ? this.getPracticeHTML() : ''}
      ${this.getKeyboardHTML()}
    `;
    
    this.container.innerHTML = html;
    
    if (this.options.showPractice) {
      this.practiceTextElement = document.getElementById('practice-text');
      this.progressElement = document.getElementById('progress');
      this.totalElement = document.getElementById('total');
    }
  }
  
  getPracticeHTML() {
    return `
      <div class="practice-section">
        <div id="practice-text" class="practice-text"></div>
        <div class="stats">
          <span>Progress: <span id="progress">0</span>/<span id="total">0</span></span>
        </div>
      </div>
    `;
  }
  
  getKeyboardHTML() {
    return `
      <div class="keyboard-container">
        <!-- Row 1 -->
        <div class="keyboard-row">
          <div class="key finger-left-pinky" data-key="\`">~<br>\`</div>
          <div class="key finger-left-pinky" data-key="1">!<br>1</div>
          <div class="key finger-left-ring" data-key="2">@<br>2</div>
          <div class="key finger-left-middle" data-key="3">#<br>3</div>
          <div class="key finger-left-index" data-key="4">$<br>4</div>
          <div class="key finger-left-index" data-key="5">%<br>5</div>
          <div class="key finger-right-index" data-key="6">^<br>6</div>
          <div class="key finger-right-index" data-key="7">&<br>7</div>
          <div class="key finger-right-middle" data-key="8">*<br>8</div>
          <div class="key finger-right-ring" data-key="9">(<br>9</div>
          <div class="key finger-right-pinky" data-key="0">)<br>0</div>
          <div class="key finger-right-pinky" data-key="-">_<br>-</div>
          <div class="key finger-right-pinky" data-key="=">+<br>=</div>
          <div class="key key-wide finger-right-pinky" data-key="Backspace">Backspace</div>
        </div>

        <!-- Row 2 -->
        <div class="keyboard-row">
          <div class="key key-wide finger-left-pinky" data-key="Tab">Tab</div>
          <div class="key finger-left-pinky" data-key="q">Q</div>
          <div class="key finger-left-ring" data-key="w">W</div>
          <div class="key finger-left-middle" data-key="e">E</div>
          <div class="key finger-left-index" data-key="r">R</div>
          <div class="key finger-left-index" data-key="t">T</div>
          <div class="key finger-right-index" data-key="y">Y</div>
          <div class="key finger-right-index" data-key="u">U</div>
          <div class="key finger-right-middle" data-key="i">I</div>
          <div class="key finger-right-ring" data-key="o">O</div>
          <div class="key finger-right-pinky" data-key="p">P</div>
          <div class="key finger-right-pinky" data-key="[">{<br>[</div>
          <div class="key finger-right-pinky" data-key="]">}<br>]</div>
          <div class="key key-wide finger-right-pinky" data-key="\\">|<br>\\</div>
        </div>

        <!-- Row 3 -->
        <div class="keyboard-row">
          <div class="key key-wider finger-left-pinky" data-key="CapsLock">Caps Lock</div>
          <div class="key finger-left-pinky" data-key="a">A</div>
          <div class="key finger-left-ring" data-key="s">S</div>
          <div class="key finger-left-middle" data-key="d">D</div>
          <div class="key finger-left-index" data-key="f">F</div>
          <div class="key finger-left-index" data-key="g">G</div>
          <div class="key finger-right-index" data-key="h">H</div>
          <div class="key finger-right-index" data-key="j">J</div>
          <div class="key finger-right-middle" data-key="k">K</div>
          <div class="key finger-right-ring" data-key="l">L</div>
          <div class="key finger-right-pinky" data-key=";">:<br>;</div>
          <div class="key finger-right-pinky" data-key="'">"<br>'</div>
          <div class="key key-wider finger-right-pinky" data-key="Enter">Enter</div>
        </div>

        <!-- Row 4 -->
        <div class="keyboard-row">
          <div class="key key-widest finger-left-pinky" data-key="Shift">Shift</div>
          <div class="key finger-left-pinky" data-key="z">Z</div>
          <div class="key finger-left-ring" data-key="x">X</div>
          <div class="key finger-left-middle" data-key="c">C</div>
          <div class="key finger-left-index" data-key="v">V</div>
          <div class="key finger-left-index" data-key="b">B</div>
          <div class="key finger-right-index" data-key="n">N</div>
          <div class="key finger-right-index" data-key="m">M</div>
          <div class="key finger-right-middle" data-key=",">&lt;<br>,</div>
          <div class="key finger-right-ring" data-key=".">&gt;<br>.</div>
          <div class="key finger-right-pinky" data-key="/">?<br>/</div>
          <div class="key key-widest finger-right-pinky" data-key="Shift">Shift</div>
        </div>

        <!-- Row 5 -->
        <div class="keyboard-row">
          <div class="key key-wide" data-key="Control">Ctrl</div>
          <div class="key key-wide" data-key="Meta">Win</div>
          <div class="key key-wide finger-thumb" data-key="Alt">Alt</div>
          <div class="key key-space finger-thumb" data-key=" ">Space</div>
          <div class="key key-wide finger-thumb" data-key="Alt">Alt</div>
          <div class="key key-wide" data-key="Meta">Win</div>
          <div class="key key-wide" data-key="Control">Ctrl</div>
        </div>
      </div>
    `;
  }
  
  attachEventListeners() {
    this.keydownHandler = (event) => this.handleKeyDown(event);
    this.keyupHandler = (event) => this.handleKeyUp(event);
    
    document.addEventListener('keydown', this.keydownHandler);
    document.addEventListener('keyup', this.keyupHandler);
  }
  
  handleKeyDown(event) {
    const key = event.key;
    
    // Check if typing practice is enabled
    if (this.options.showPractice && this.currentIndex < this.options.practiceText.length) {
      const expectedKey = this.options.practiceText[this.currentIndex];
      
      this.totalKeyPresses++;
      
      if (key === expectedKey) {
        this.currentIndex++;
        this.displayPracticeText();
        
        // Check if completed
        if (this.currentIndex === this.options.practiceText.length) {
          setTimeout(() => {
            // Check if there are more lines
            if (this.lines && this.lines.length > 0 && this.currentLineIndex < this.lines.length - 1) {
              this.nextLine();
            } else {
              // All lines completed
              if (this.options.onComplete) {
                this.options.onComplete();
              } else {
                alert('Congratulations! You completed all lines!');
              }
              this.reset();
            }
          }, 100);
        }
      } else {
        // Wrong key pressed
        this.errors++;
      }
      
      this.updateStats();
    }
    
    // Visual feedback for key press
    const keyLower = key.toLowerCase();
    this.highlightKey(keyLower);
    
    // Custom callback
    if (this.options.onKeyPress) {
      this.options.onKeyPress(key);
    }
  }
  
  handleKeyUp(event) {
    const key = event.key.toLowerCase();
    this.unhighlightKey(key);
  }
  
  displayPracticeText() {
    if (!this.practiceTextElement) return;
    
    this.practiceTextElement.innerHTML = '';
    
    for (let i = 0; i < this.options.practiceText.length; i++) {
      const span = document.createElement('span');
      span.textContent = this.options.practiceText[i];
      span.classList.add('char');
      
      if (i < this.currentIndex) {
        span.classList.add('typed');
      } else if (i === this.currentIndex) {
        span.classList.add('current');
      }
      
      this.practiceTextElement.appendChild(span);
    }
    
    // Highlight the next key to press
    this.highlightNextKey();
  }
  
  highlightNextKey() {
    // Remove previous next-key highlights
    this.container.querySelectorAll('.next-key').forEach(el => {
      el.classList.remove('next-key');
    });
    
    if (this.options.showPractice && this.currentIndex < this.options.practiceText.length) {
      const nextChar = this.options.practiceText[this.currentIndex];
      const keyToFind = nextChar === ' ' ? ' ' : nextChar.toLowerCase();
      
      const keys = this.container.querySelectorAll(`[data-key="${keyToFind}"]`);
      keys.forEach(keyElement => {
        keyElement.classList.add('next-key');
      });
    }
  }
  
  highlightKey(key) {
    let keyToFind = this.normalizeKey(key);
    
    const keys = this.container.querySelectorAll(`[data-key="${keyToFind}"]`);
    keys.forEach(keyElement => {
      keyElement.classList.add('active');
    });
  }
  
  unhighlightKey(key) {
    let keyToFind = this.normalizeKey(key);
    
    const keys = this.container.querySelectorAll(`[data-key="${keyToFind}"]`);
    keys.forEach(keyElement => {
      keyElement.classList.remove('active');
    });
  }
  
  normalizeKey(key) {
    const keyMap = {
      ' ': ' ',
      'shift': 'Shift',
      'control': 'Control',
      'alt': 'Alt',
      'meta': 'Meta',
      'enter': 'Enter',
      'backspace': 'Backspace',
      'tab': 'Tab',
      'capslock': 'CapsLock'
    };
    
    return keyMap[key.toLowerCase()] || key;
  }
  
  nextLine() {
    this.currentLineIndex++;
    if (this.lines && this.currentLineIndex < this.lines.length) {
      this.options.practiceText = this.lines[this.currentLineIndex];
      this.currentIndex = 0;
      this.displayPracticeText();
      
      if (this.options.onLineComplete) {
        this.options.onLineComplete(this.currentLineIndex);
      }
    }
  }
  
  reset() {
    this.currentIndex = 0;
    this.currentLineIndex = 0;
    this.errors = 0;
    this.totalKeyPresses = 0;
    
    // Reset to first line if using lessons
    if (this.lines && this.lines.length > 0) {
      this.options.practiceText = this.lines[0];
    }
    
    if (this.options.showPractice) {
      this.displayPracticeText();
    }
    this.updateStats();
  }
  
  setPracticeText(text) {
    this.options.practiceText = text;
    this.reset();
  }
  
  setLesson(lessonId) {
    if (!this.lessons) return;
    
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (lesson) {
      this.currentLesson = lesson;
      this.lines = lesson.lines;
      this.currentLineIndex = 0;
      this.currentIndex = 0;
      this.errors = 0;
      this.totalKeyPresses = 0;
      this.options.practiceText = this.lines[0];
      this.displayPracticeText();
      this.updateStats();
    }
  }
  
  getCurrentLine() {
    return this.currentLineIndex + 1;
  }
  
  getTotalLines() {
    return this.lines ? this.lines.length : 1;
  }
  
  destroy() {
    document.removeEventListener('keydown', this.keydownHandler);
    document.removeEventListener('keyup', this.keyupHandler);
    this.container.innerHTML = '';
  }
}

export default KeyboardComponent;
