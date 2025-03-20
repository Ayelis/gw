import { DEBUG } from './index.js';
import { setupInputHandlers } from './input-handler.js';
import { drawPath, button } from './engine-renderer.js';
import { player, tool, touch, paths } from './engine-gamestate.js';

export function initializeGame() {
  // Set up input handlers
  setupInputHandlers(tool, button, touch);

  if(DEBUG) console.log("Game initialized!");
}