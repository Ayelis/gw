import { drawPath,button } from './renderer.js'; // Only import what's needed
import { setupInputHandlers } from './input.js';
import { toggleSelect, buildUnit } from './game.js';
import { Unit } from './unit.js';
export const DEBUG = false;

// Game state and logic vars
export const player = {
    id: 0,
    name: "user0",
    xp: 0
};
export let tool = new paper.Tool();
export let paths = [], units = [];
export let touch = {
    mode: 0, // [0-build, 1-select, 2-move]
    selected: 0, // [0-unselected, 1-unit, 2-land]
    which: 0 // [id of unit/land]
};

// Predefined paths and terrain [VOID eventually and replace with SVG?]
export const nodes = [
    [100, 100, 200, 200],
    [200, 200, 150, 300]
];
export let land = {
	point: [0, 0], // display origin
	size: [7680, 4320], // 8k
	fillColor: 'lightgreen', // grass
	selected: false
};

// Initialize game [++VOID]
export function initializeGame() {
    setupInputHandlers(tool, button, touch);
	//VOID when terrain nodes!?
    nodes.forEach(row => {
        drawPath(row[0], row[1], row[2], row[3]);
    });
}

// Game loop
export function gameLoop(delta) {
    units.forEach(unit => unit.update(delta));
}