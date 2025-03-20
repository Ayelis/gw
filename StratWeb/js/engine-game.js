import { DEBUG } from './index.js';
import { touch,units } from './engine-gamestate.js';
import { button,drawUnitPoint } from "./engine-renderer.js";
import { Unit } from "./class-unit.js"; //(id, point, x, y, type, speed, owner, graphic)
import { Territory } from "./class-territory.js"; //(id, owner, terrainType, originCountry, coordinates)

	//Selection variables for toggleSelect
	const selectionRadius = 50;
	let lastClickPoint;
	let nearbyUnits = [];

export function toggleSelect(point){ //temporary, select toggling, for testing only!
	if (DEBUG) console.log("Point: "+JSON.stringify(point));
	if (DEBUG) console.log("X: "+point.x+", Y: "+point.y);

	// Find all nearby units within selectionRadius, sorted by distance
	let nearbyUnits = units
		.map((unit, id) => {
			if (!unit.point || !unit.point.position) return null;
			const unitPos = unit.point.position;
			return { id, dist: unitPos.subtract(point).length };
		})
		.filter(u => u && u.dist <= selectionRadius)
		.sort((a, b) => a.dist - b.dist);

	if (nearbyUnits.length === 0) {
		// No units nearby, just select the terrain
		pickLand(0);
		return;
	}

	let nextIndex = 0;

	if (touch.selected === 1) {
		// Find the index of the currently selected unit
		nextIndex = nearbyUnits.findIndex(u => u.id === touch.which) + 1;
		if (nextIndex >= nearbyUnits.length) {
			// If we've cycled through all units, select the terrain
			pickLand(0);
			return;
		}
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
	// Keep track of terrain selected
	// Unhighlight terrain
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
	touch.selected=2;touch.which=id;
	if(DEBUG) console.log("Select land: "+id);
	// Keep track of terrain selected
	// Highlight terrain
}
