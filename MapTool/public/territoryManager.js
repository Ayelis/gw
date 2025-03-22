import { changeDots } from "./canvasManager.js";
import { saveMap } from "./apiManager.js";

const terrainColors = {
  0: "grey", 1: "green", 2: "yellow", 3: "orange",
  4: "darkgreen", 5: "olive", 6: "aliceblue"
};

let territories = []; // Store all territories
let currentTerritoryIndex = 0; // Track the current territory

export const initializeTerritoryManager = (canvas, terrainTypeSelect, onMouseDown) => {
  let currentTerritory = {
    id: 1,
    owner: null,
    terrainType: 0,
    coordinates: [],
    polygon: null,
    dots: [],
  };

  const handleMouseDown = (point) => {
    console.log("Mouse down callback triggered. Point received:", point); // Log the point

    // Check if the new segment crosses any existing segments
    let crosses = false;
    if (currentTerritory.coordinates.length >= 2) {
      const newSegment = new paper.Path.Line(
        currentTerritory.coordinates[currentTerritory.coordinates.length - 1],
        point
      );

      for (let i = 0; i < currentTerritory.coordinates.length - 2; i++) {
        const existingSegment = new paper.Path.Line(
          currentTerritory.coordinates[i],
          currentTerritory.coordinates[i + 1]
        );

        if (newSegment.intersects(existingSegment)) {
          crosses = true;
          break;
        }

        existingSegment.remove(); // Clean up temporary segment
      }

      newSegment.remove(); // Clean up temporary segment
    }

    if (crosses) {
      // Show a grey dot for 1 second
      const dot = new paper.Path.Circle({
        center: point,
        radius: 5,
        fillColor: "grey",
      });

      setTimeout(() => {
        dot.remove();
      }, 1000);
    } else {
      // Add the point to the coordinates
      currentTerritory.coordinates.push({ x: point.x, y: point.y });

      // Clear existing dots
      currentTerritory.dots.forEach((dot) => dot.remove());
      currentTerritory.dots = [];

      // Draw the point
      const newDot = new paper.Path.Circle({
        center: point,
        radius: 5,
        fillColor: "red",
      });

      // Store the new dot
      currentTerritory.dots.push(newDot);

      // Draw the polygon
      if (currentTerritory.polygon) {
        currentTerritory.polygon.remove();
      }
      currentTerritory.polygon = new paper.Path({
        segments: currentTerritory.coordinates,
        strokeColor: "black",
        fillColor: terrainColors[currentTerritory.terrainType],
        closed: true,
      });
    }
  };

  // Pass the handleMouseDown function to the canvas manager
  onMouseDown(handleMouseDown);

  const handleNext = () => {
    console.log("Next button clicked."); // Log button click

    // Save the current territory
    if (currentTerritory.coordinates.length > 0) {
      territories[currentTerritoryIndex] = { ...currentTerritory };
      changeDots(currentTerritory, "black", 3); // Smaller black dots
    }

	// Advance to next territory ID
	if(currentTerritoryIndex<territories.length) currentTerritoryIndex++;
	currentTerritory = { ...territories[currentTerritoryIndex] };

	// Redraw the territory if it was already drawn
	if (currentTerritory.polygon) {
		currentTerritory.polygon = new paper.Path({
		  segments: currentTerritory.coordinates,
		  strokeColor: "black",
		  fillColor: terrainColors[currentTerritory.terrainType],
		  closed: true,
		});

		currentTerritory.dots = currentTerritory.coordinates.map((coord) => {
		  return new paper.Path.Circle({
			center: coord,
			radius: 5,
			fillColor: "red",
		  });
		});
	}else{
		// Start a new territory
		currentTerritory = {
		  id: currentTerritoryIndex + 1,
		  owner: null,
		  terrainType: 0,
		  coordinates: [],
		  polygon: null,
		  dots: [],
		};
		terrainTypeSelect.value = 0;
	}
  };

  const handlePrev = () => {
    console.log("Prev button clicked."); // Log button click

    if (currentTerritoryIndex > 0) {
      // Save the current territory
      if (currentTerritory.coordinates.length > 0) {
        territories[currentTerritoryIndex] = { ...currentTerritory };
		changeDots(currentTerritory, "black", 3); // Smaller black dots
      }

      // Go back to the previous territory
      currentTerritoryIndex--;
      currentTerritory = { ...territories[currentTerritoryIndex] };

      // Redraw the previous territory
      if (currentTerritory.polygon) {
        currentTerritory.polygon = new paper.Path({
          segments: currentTerritory.coordinates,
          strokeColor: "black",
          fillColor: terrainColors[currentTerritory.terrainType],
          closed: true,
        });

        currentTerritory.dots = currentTerritory.coordinates.map((coord) => {
          return new paper.Path.Circle({
            center: coord,
            radius: 5,
            fillColor: "red",
          });
        });
      }
    }
  };

  const handleSave = () => {
    console.log("Save button clicked."); // Log button click
    saveMap(territories);
  };

  return { handleNext, handlePrev, handleSave };
};