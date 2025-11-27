import { KeyboardComponent } from './modules/keyboard.js';

document.addEventListener('DOMContentLoaded', () => {
  
  const keyboard = new KeyboardComponent('#keyboard-wrapper', {
    jsonPath: 'data/learning-texts.json',
    showPractice: true,
    onComplete: () => {
      // Modal is now handled internally by KeyboardComponent
    },
    onLineComplete: (lineIndex) => {
    },
    onKeyPress: (key) => {
    }
  });
  
  // Add restart button functionality
  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      keyboard.reset();
      // Remove focus from button so space doesn't trigger it
      restartBtn.blur();
    });
    
    // Prevent space from triggering button while typing
    restartBtn.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
      }
    });
  }
});
