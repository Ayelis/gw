// Core imports
import { initializeGame, gameLoop, initializeTerritories }
	from './engine/index.js';

// Debug mode
export const DEBUG = true;

document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM fully loaded"); // Debugging

	if (!paper.view) {
		paper.setup('myCanvas');
	}
	console.log("paper.view:", paper.view); // Debugging

	// Initialize the game
	initializeGame();
	// Add the map
	initializeTerritories();

	// Start the game loop
	paper.view.onFrame = (event) => {
		gameLoop(event.delta);
	};
});