// Core imports
import { initializeGame } from './engine-gameinit.js';
import { gameLoop } from './engine-gameloop.js';

// Debug mode
export const DEBUG = false;

document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM fully loaded"); // Debugging

	if (!paper.view) {
		paper.setup('myCanvas');
	}
	console.log("paper.view:", paper.view); // Debugging

	// Initialize the game
	initializeGame();

	// Start the game loop
	paper.view.onFrame = (event) => {
		gameLoop(event.delta);
	};
});