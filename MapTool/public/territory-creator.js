paper.install(window);
window.onload = () => {
  paper.setup(document.getElementById("territoryCanvas"));

  // Initialize the tool
  const tool = new paper.Tool(); // Add this line

  const terrainColors = {
    0: "grey",      // City
    1: "green",     // Grassland
    2: "yellow",    // Desert
    3: "orange",    // Mountain
    4: "darkgreen", // Forest
    5: "olive",     // Swamp
    6: "aliceblue"  // Tundra
  };

  let currentTerritory = {
    id: 1, // Start with ID 1
    owner: null,
    terrainType: 0, // Default to Ocean
    coordinates: [],
    polygon: null
  };

  const terrainTypeSelect = document.getElementById("terrainType");
  const nextButton = document.getElementById("nextButton");
  const saveButton = document.getElementById("saveButton");

  // Handle canvas clicks
  tool.onMouseDown = (event) => {
    const point = event.point;
    currentTerritory.coordinates.push({ x: point.x, y: point.y });

    // Draw the point
    new paper.Path.Circle({
      center: point,
      radius: 5,
      fillColor: "red"
    });

    // Draw the polygon
    if (currentTerritory.polygon) {
      currentTerritory.polygon.remove();
    }
    currentTerritory.polygon = new paper.Path({
      segments: currentTerritory.coordinates,
      strokeColor: "black",
      fillColor: terrainColors[currentTerritory.terrainType],
      closed: true
    });
  };

  // Handle terrain type changes
  terrainTypeSelect.addEventListener("change", () => {
    currentTerritory.terrainType = parseInt(terrainTypeSelect.value);
    if (currentTerritory.polygon) {
      currentTerritory.polygon.fillColor = terrainColors[currentTerritory.terrainType];
    }
  });

  // Handle "Next" button click
  nextButton.addEventListener("click", () => {
    saveTerritory(currentTerritory);
    currentTerritory = {
      id: currentTerritory.id + 1, // Increment ID
      owner: null,
      terrainType: 0, // Reset to Ocean
      coordinates: [],
      polygon: null
    };
    terrainTypeSelect.value = 0; // Reset terrain type
    paper.project.activeLayer.removeChildren(); // Clear the canvas
  });

  // Handle "Save" button click
  saveButton.addEventListener("click", () => {
    saveTerritory(currentTerritory);
    saveMapToDatabase();
  });

  // Save the current territory to a list (for now)
  const territories = [];
  function saveTerritory(territory) {
    territories.push(territory);
    console.log("Territory saved:", territory);
  }

  // Save the map to the database
  async function saveMapToDatabase() {
    const response = await fetch("/api/maps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(territories)
    });
    if (response.ok) {
      console.log("Map saved to database!");
    } else {
      console.error("Failed to save map:", await response.text());
    }
  }
};