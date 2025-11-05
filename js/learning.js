import { KeyboardComponent } from './modules/keyboard.js';

document.addEventListener('DOMContentLoaded', () => {
  
  const keyboard = new KeyboardComponent('#keyboard-wrapper', {
    jsonPath: 'learning-texts.JSON',
    showPractice: true,
    onComplete: () => {
      alert('Congratulations! You completed all lines in this lesson!');
    },
    onLineComplete: (lineIndex) => {
    },
    onKeyPress: (key) => {
    }
  });
  
});
