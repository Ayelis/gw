import { DEBUG } from './index.js';
import { touch,units,territories } from './engine-gamestate.js';
import { drawUnitPoint } from "./engine-renderer.js";
import { Unit } from "./class-unit.js"; //(id, point, x, y, type, speed, owner, graphic)
import { Territory } from "./class-territory.js"; //(id, owner, terrainType, originCountry, coordinates)

//Selection variables for toggleSelect
const selectionRadius = 50;
let lastClickPoint;
let nearbyUnits = [];

export function toggleSelect(point){ //temporary, select toggling, for testing only!
	if (DEBUG) console.log("Select X: "+point.x+", Y: "+point.y);

	// Find all nearby units within selectionRadius, sorted by distance
	let nearbyUnits = units
		.map((unit, id) => {
			if (!unit.point || !unit.point.position) return null;
			const unitPos = unit.point.position;
			return { id, dist: unitPos.subtract(point).length };
		})
		.filter(u => u && u.dist <= selectionRadius)
		.sort((a, b) => a.dist - b.dist);

	let lastUnitSelected = false; // Reset the flag
	let nextIndex = 0;
	if (touch.selected === 1) {
		if (DEBUG) console.log("A troop's selected. Find out which!");
		// Find the index of the currently selected unit
		nextIndex = nearbyUnits.findIndex(u => u.id === touch.which) + 1;
		if (DEBUG) console.log("Current: "+touch.which+" | Next: "+nextIndex+" | Nearby: "+nearbyUnits.length);
		if (nextIndex >= nearbyUnits.length) {
		if (DEBUG) console.log("Last Unit Selected, check territory!");
			// If we've cycled through all units, set the flag
			lastUnitSelected = true;
		}
	}
	if (DEBUG) console.log("Checking territory next");
	if (nearbyUnits.length === 0 || lastUnitSelected) {
	if (DEBUG) console.log("No nearby units, or last unit selected. Checking for territory to select");
		// No units nearby or we've cycled through all units, check for land!
		const hitResult = paper.project.hitTest(point);
		if (hitResult && hitResult.item) {
			if (DEBUG) console.log("Hit!");
			const territory = hitResult.item.data.territory;
			if (territory) {
				if (DEBUG) console.log("Selected territory:", territory.id);
				pickLand(territory.id); // Select the clicked territory
			}
		}else{
			if (DEBUG) console.log("Clicked on ocean or non-selectable area, all lands deselected");
			unpickAllUnits(); // Deselect all troops
			unpickAllLands(); // Deselect all lands
		}
		return;
	}

	// Select the next unit in the cycle
	pickUnit(nearbyUnits[nextIndex].id);
}
export function buildUnit(id,pt,units){ //id, point
	if(!unitIdExists(id,units)){
		if(DEBUG) console.log("Building unit "+id+" at "+pt+"...");
		//constructor(id, point, type, speed, owner, graphic)
		var x=pt.x;
		var y=pt.y;
		var dp=drawUnitPoint(x,y,'red');
		var newUnit = new Unit(id, dp);
		if(newUnit.point!==null)
			units.push(newUnit);
		pickUnit(id);
	}else{
		if(DEBUG) console.log("ERROR: Unit ["+id+"] already exists!");
	}
}
function unitIdExists(id, unitArray) {
	return unitArray.some(unit => unit.id === id);
}
function unpickAllUnits(){ //not optimized, just unpick selected unit list!
	units.forEach(unit=>{
		unit.point.fillColor='black';
	});
	if (touch.selected === 1) { // Only clear selection if troop was selected
		touch.selected = 0;
		touch.which = 0;
	}
}
function unpickAllLands(){ //unfinished
	// Deselect all lands
	territories.forEach(territory => {
		territory.polygon.strokeColor = "black"; // Reset stroke color
	});
	if (DEBUG) console.log("All lands deselected");
	if (touch.selected === 2) { // Only clear selection if land was selected
		touch.selected = 0;
		touch.which = 0;
	}
}
function pickNone(){
	unpickAllUnits();
	unpickAllLands();
	touch.selected=0;
	touch.which=0;
	if(DEBUG) console.log("Select Nothing!");
}
function pickUnit(id) {
	unpickAllUnits(); //deselect everything
	touch.selected = id >= 0 ? 1 : 0; //units are selected so set flag
	touch.which = id; //which unit is it

	if (id >= 0) { //select a unit
		unpickAllLands(); //deselect everything
		units[id].point.fillColor = 'red'; // Highlight selected unit
	} else {
		pickLand(0);
	}
}
function pickLand(id){ //picks a land by id
	unpickAllUnits();
	unpickAllLands();
	touch.selected=2;touch.which=id;
	// Select the specific territory
	const territory = territories.get(id);
	territory.polygon.strokeColor = "red"; // Highlight selected territory
	if (DEBUG) console.log("Selected territory:", id);
}
