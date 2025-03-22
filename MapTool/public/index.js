import { initializeCanvas } from "./canvasManager.js";
import { initializeTerritoryManager } from "./territoryManager.js";

window.onload = () => {
  const canvas = document.getElementById("territoryCanvas");
  const terrainTypeSelect = document.getElementById("terrainType");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const saveButton = document.getElementById("saveButton");

  // Initialize canvas and get the onMouseDown function
  const { onMouseDown } = initializeCanvas(canvas);

  // Initialize territory manager and pass the onMouseDown function
  const { handleNext, handlePrev, handleSave } = initializeTerritoryManager(
    canvas,
    terrainTypeSelect,
    onMouseDown
  );

  // Attach event listeners
  nextButton.addEventListener("click", handleNext);
  prevButton.addEventListener("click", handlePrev);
  saveButton.addEventListener("click", handleSave);
};