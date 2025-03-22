import { Territory } from './index.js';

export let tool = new paper.Tool();
export let units = [];
export let territories = new Map(); // Add territories if needed
export let paths = [];

export let touch = {
	mode: 1, // [0-build, 1-select, 2-move]
	selected: 0, // [0-unselected, 1-unit, 2-land]
	which: 0 // [id of unit/land]
};

export const player = {
	id: 0,
	name: "user0",
	xp: 0
};
//Create a territory grid for testing purposes
// Territory size and spacing
const territorySize = 100; // Width and height of each territory
const spacing = 0; // Space between territories
const margin = 10; // Space around territories

export function initializeTerritories() {
	// Create a grid of territories
	for (let row = 0; row < 5; row++) {
		for (let col = 0; col < 5; col++) {
			// Calculate the top-left corner of the territory
			const x = col * (territorySize + spacing) + margin;
			const y = row * (territorySize + spacing) + margin;

			// Define the coordinates of the square territory
			const coordinates = [
				{ x, y },
				{ x: x + territorySize, y },
				{ x: x + territorySize, y: y + territorySize },
				{ x, y: y + territorySize }
			];

			// Create a new territory
			const territory = new Territory(
				territories.size + 1, // ID (auto-increment)
				null, // Owner (initially unowned)
				1, // Terrain type (e.g., 1 = grassland)
				coordinates // Coordinates of the territory
			);

			// Add the territory to the map
			territories.set(territory.id, territory);

			// Create the Paper.js polygon for the territory
			territory.createPolygon();
		}
	}
	console.log("Territories initialized!");
}
