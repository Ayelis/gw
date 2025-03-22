import {	DEBUG, setupInputHandlers, drawPath,
          player, tool, touch, paths }
	from './index.js';

export function initializeGame() {
	// Set up input handlers
	setupInputHandlers(tool, touch);

	if(DEBUG) console.log("Game initialized!");
}
