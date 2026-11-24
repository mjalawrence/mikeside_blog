import { Game } from './game.js';
import { setupControls } from './controls.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  game.init();
  setupControls(game);

  // Optional: expose the instance while debugging in the browser console.
  window.game = game;
});
