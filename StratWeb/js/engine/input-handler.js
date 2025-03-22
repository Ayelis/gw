import { 	DEBUG, touch, units, translateView, doCanvasResize,
			toggleSelect, buildUnit }
	from './index.js';

export const buttonMove = document.getElementById("move");
export const buttonBuild = document.getElementById("build");

let isPanning = false;
let startPoint = null;
const panThreshold = 10; // Min pixels to trigger panning

function doTouch(point){
	if(DEBUG) console.log("TOUCHED at: " + point + " | TouchType(MSW): "+touch.mode+", "+touch.selected+", "+touch.which);
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
			doModeSelect(); //and return to select mode
		break;
		case 1: //select object // TOGGLE!!
			toggleSelect(point);
		break;
		default: //build unit // ANYWHERE!!
			let newguy = units.length||0;
			buildUnit(newguy,point,units);
			doModeSelect(); //and return to select mode
		break;
	}
}
function doModeBuild(){
	if(DEBUG) console.log("[Build Mode selected]");
	buttonMove.value="Move";
	buttonBuild.value="Build!";
	touch.mode=0;
}
function doModeSelect(){
	if(DEBUG) console.log("[Select Mode selected]");
	buttonMove.value="Move";
	buttonBuild.value="Build";
	if(touch.mode!=1){
		touch.mode=1;
	}
	let point = {x:0,y:0};
}
function doModeMove(){
	if(DEBUG) console.log("[Move Mode selected]");
	if(units.length===0){
		if(DEBUG) console.log("No units to move! Canceling...");
		return;
	}
	if(touch.selected !== 1){
		if(DEBUG) console.log("Unit not selected! Canceling...");
		return;
	}
	buttonBuild.value="Build";
	buttonMove.value="Move!";
	touch.mode=2;
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
	buttonBuild.addEventListener("click", ()=>{
		doModeBuild();
	});
	buttonMove.addEventListener("click", ()=>{
		doModeMove();
	});
	window.addEventListener("resize", doCanvasResize);
	document.addEventListener("wheel", (event) => {
		onMouseWheel(new paper.ToolEvent(event));
	}, { passive: false });
	document.addEventListener("keydown", (event) => {
		switch (event.key.toLowerCase()) {
			case "m":doModeMove();break;
			case "s":doModeSelect();break;
			case "b":doModeBuild();break;
		}
	});
	
	// Interface Button listeners
	// Show window when nav button is clicked
	document.querySelectorAll("nav button").forEach(button => {
	  button.addEventListener("click", () => {
		const windowId = button.getAttribute("data-window") + "-window";
		const window = document.getElementById(windowId);
		const overlay = document.querySelector(".overlay");

			if (window && overlay) {
			  window.classList.add("active");
			  overlay.classList.add("active");
			} else if (overlay) {
			  console.error("window not found!");
			} else if (window) {
			  console.error("overlay not found!");
			}
	  });
	});

	// Close window when close button is clicked or clicking outside
	document.querySelectorAll(".window").forEach(window => {
	  window.addEventListener("click", (event) => {
		if (event.target.classList.contains("close-btn") || event.target === window) {
		  window.classList.remove("active");
		  document.querySelector(".overlay").classList.remove("active");
		}
	  });
	});

	// Close window when clicking on the overlay
	document.querySelector(".overlay").addEventListener("click", () => {
	  document.querySelectorAll(".window").forEach(window => {
		window.classList.remove("active");
	  });
	  document.querySelector(".overlay").classList.remove("active");
	});

}
