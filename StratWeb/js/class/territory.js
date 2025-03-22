// territory.js
import { DEBUG } from './index.js';

export class Territory {
  constructor(id, owner, terrainType, coordinates) {
    this.id = id; // Unique identifier / origin country
    this.owner = owner; // Current owner UID (e.g., 12)
    this.terrainType = terrainType; // Terrain type (e.g., 1 = grassland)
    this.coordinates = coordinates; // Array of { x, y } points
    this.polygon = null; // Paper.js Path object
    this.buildings = []; // Array of buildings in the territory
    this.nodes = []; // Array of nodes (e.g., resource nodes, strategic points)
  }

  // Create a Paper.js polygon for the territory
  createPolygon() {
    this.polygon = new paper.Path({
      segments: this.coordinates,
      closed: true,
      fillColor: this.getTerrainColor(),
      strokeColor: "black",
      strokeWidth: 2
    });

    // Store a reference to the territory in the polygon for easy lookup
    this.polygon.data = { territory: this };
  }

  // Get the color for the territory based on terrain type
  getTerrainColor() {
    switch (this.terrainType) {
      case 0: return "gray"; // Urban
      case 1: return "forestgreen"; // Grassland
      case 2: return "burlywood"; // Desert
      case 3: return "darkgoldenrod"; // Mountain
      case 4: return "darkgreen"; // Forest
      case 5: return "darkolivegreen"; // Swamp
      case 6: return "aliceblue"; // Tundra
      // Add more cases as needed
      default: return "darkorchid"; // Unknown
    }
  }

  // Assign a new owner to the territory
  assignNewOwner(newOwnerId) {
    this.owner = newOwnerId;
    this.polygon.fillColor = this.getTerrainColor(); // Update color to reflect new owner
    console.log(`Territory ${this.id} now belongs to ${newOwnerId}`);
  }

  // Add a building to the territory
  addBuilding(building) {
    this.buildings.push(building);
  }

  // Add a node to the territory
  addNode(node) {
    this.nodes.push(node);
  }
}
