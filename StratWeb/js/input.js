//get variables
import { DEBUG,touch,units } from './main.js';
import { button, translateView } from './renderer.js';
//get functions
import { doCanvasResize } from "./renderer.js";
import { toggleSelect,buildUnit } from "./game.js";

let isPanning = false;
let startPoint = null;
const panThreshold = 10; // Min pixels to trigger panning

function doTouch(point){
	if(DEBUG) console.log("TOUCHED at: "+point);
	if(DEBUG) console.log("Touch: "+touch.mode+", "+touch.selected+", "+touch.which);
	switch(touch.mode){
		case 2: //move unit
			var id=touch.which;
			if(typeof(units[id]) != typeof(undefined)){
				if(touch.selected==1){
					units[id].destination = point; //move the 0th unit
					if(DEBUG) console.log("Unit "+touch.which+" moving to "+point);
				}else{
					if(DEBUG) console.log("Warning! Unit not selected!");						
				}
			}else{
				if(DEBUG) console.log("ERROR! Undefined ID: "+touch.which);
			}
		break;
		case 1: //select object // TOGGLE!!
			toggleSelect(point);
		break;
		default: //build unit // ANYWHERE!!
			let newguy = units.length||0;
			buildUnit(newguy,point,units);
		break;
	}
}
function doModeBuild(){
	button.value="Mode: Build";		
	touch.mode=0;
}
function doModeSelect(){
	if(touch.mode!=1){
		button.value="Mode: Select";		
		touch.mode=1;
	}
	let point = {x:0,y:0};
	toggleSelect(point);
}
function doModeMove(){
	button.value="Mode: Move";		
	touch.mode=2;
}
function doButtonInc(mode){
	if(isNaN(mode))mode=0;
	mode++;
	if(mode==3)mode=0;
	return mode;
}
function doButtonClick(button,touch){
	let buttonmode =touch.mode= doButtonInc(touch.mode);
	switch(buttonmode){
		case 1:
			button.value="Mode: Select";
		break;
		case 2:
			button.value="Mode: Move";
		break;
		default:
			button.value="Mode: Build";
	}
}
function onMouseWheel(event) {
    let zoomFactor = 1.05; // Zoom factor for each scroll step

    let direction = event.tool.deltaY < 0 ? 1 : -1; // Scroll up: 1 (zoom in), scroll down: -1 (zoom out)

    // Calculate new zoom level based on current zoom and direction
    let newZoom = view.zoom * (direction === 1 ? zoomFactor : 1 / zoomFactor);

    // Limit zoom range
    newZoom = Math.max(0.5, Math.min(newZoom, 5)); // Min zoom: 0.5, Max zoom: 5

    // Get the mouse position in view coordinates
    let mousePos = new paper.Point(event.tool.x, event.tool.y);

    // Convert mouse position to project coordinates
    let mousePosProject = view.viewToProject(mousePos);

    // Calculate the delta needed to keep the mouse position fixed
    let zoomRatio = newZoom / view.zoom;
    let inverseZoom = 1 / zoomRatio; // Step 1: Calculate inverse zoom
    let scaleFactor = 1 - inverseZoom; // Step 2: Subtract from 1

	let delta = view.center.subtract(mousePosProject).multiply(1 - 1 / zoomRatio);
    view.zoom = newZoom; // Apply the new zoom
    view.translate(delta); // Translate the view to keep the mouse position fixed
}

export function setupInputHandlers(tool, button, touch) {
	//INPUTS
	tool.onMouseDown = function(event) {
		startPoint = event.point;
		isPanning = false; // Reset panning state
	}
    tool.onMouseDrag = function(event) {
		if (!isPanning && startPoint) {
			let movedDistance = startPoint.getDistance(event.point);
			if (movedDistance > panThreshold) {
				isPanning = true; // Enable panning only after threshold is met
				if (DEBUG) console.log("panning!");
			}
		}
		if (isPanning) {
			translateView(event.delta); // Call Renderer.js to move the viewport
		}
	};
    tool.onMouseUp = function(event) {
		if (!isPanning) {
			doTouch(event.point); // Call existing touch handler
		};
	}
	button.addEventListener("click", ()=>{doButtonClick(button,touch);});
	window.addEventListener("resize", doCanvasResize);
	document.addEventListener("wheel", (event) => {
		onMouseWheel(new paper.ToolEvent(event));
	}, { passive: false });
	document.addEventListener("keydown", (event) => {
		switch (event.key.toLowerCase()) {
			case "s":doModeSelect();break;
			case "m":doModeMove();break;
			case "b":doModeBuild();break;
		}
	});
}
