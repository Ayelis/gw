// Log issues to console?
const DEBUG=true;
import{Unit}from "./unit.js"; //(id, point, x, y, type, speed, owner, graphic)


// Make the paper scope global, by injecting it into window:
paper.install(window);

// Only executed our code once the DOM is ready.
window.onload = function() {
	//Stay in sync if the window resizes...
	paper.setup('myCanvas');
	const canvas = document.getElementById("myCanvas");
	const button = document.getElementById("mode");
	button.addEventListener("click", doButtonClick);
	window.addEventListener("resize", doCanvasResize);

//INIT
	var paths = [], units = [];
	var tool = new paper.Tool();
	let touch = { //mode, selected(0-none, 1-unit, 2-land), which
		mode:0, //[0-build, 1-select, 2-move]
		selected:0, //[0-unselected, 1-unit, 2-land]
		which:0, //[id of unit/land]
	};
	var player = { //id, name, xp
		id:0,
		name:"user0",
		xp:0
	};
//FUNCTIONALITY
	//events
	function doCanvasResize() {
		if(DEBUG) console.log("Window size update!");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);
	}
	function doButtonClick(){
		let buttonmode = doButtonInc();
		switch(buttonmode){
			case 1:
				button.value="Mode: Select";
				if(DEBUG) console.log("ENTERING SELECT MODE");
			break;
			case 2:
				button.value="Mode: Move";
				if(DEBUG) console.log("ENTERING MOVE MODE");
			break;
			default:
				button.value="Mode: Build";
				if(DEBUG) console.log("ENTERING BUILD MODE");
		}
	};
	function doTouch(point){ //todo: Remove arbitrary selection test code
		switch(touch.mode){
			case 2: //move unit // TELEPORT!!
				var id=touch.which;
				if(typeof(units[id]) != typeof(undefined)){
					if(touch.selected==1){
						units[id].point.position = point; //move the 0th unit
						units[id].x = point.x;
						units[id].y = point.y;
						if(DEBUG) console.log("Unit "+touch.which+" moved to "+point);
					}else{
						if(DEBUG) console.log("Warning! Unit not selected!");						
					}
				}else{
					if(DEBUG) console.log("ERROR! Undefined ID: "+touch.which);
				}
			break;
			case 1: //select object // TOGGLE!!
				if(touch.selected==0 && touch.which==0){
					touch.selected = 1;
					pickUnit(0);
				}else if(touch.selected == 1){
					//cycle through units
					pickUnit(touch.which+1); //select this one
				}
			break;
			default: //build unit // ANYWHERE!!
				let newguy = units.length||0;
				buildUnit(newguy,point);
			break;
		}
	}
	function doButtonInc(){
		if(isNaN(touch.mode))touch.mode=0;
		touch.mode++;
		if(touch.mode==3)touch.mode=0;
		return touch.mode;
	}
	//checks
	function unitIdExists(id, unitArray) {
		return unitArray.some(unit => unit.id === id);
	}
	//drawing
	function drawPath(a,b,c,d){ //x,y, x,y
		var pl=paths.length||0;
		paths[pl] = new Path();
		paths[pl].strokeColor = 'gray';
		var start = new Point(a, b);
		var end = new Point(c, d);
		paths[pl].moveTo(start);
		paths[pl].lineTo(end);	
	}
	function drawUnitPoint(x,y,c){ //x,y, color
		return new Path.Circle({
			position: [x,y],
			center: [0, 0],
			radius: 3,
			fillColor: c
		});
	}
	function buildUnit(id,pt){ //id, point
		if(!unitIdExists(id,units)){
			if(DEBUG) console.log("Building unit "+id+"...");
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
	//selection
	function unpickAllUnits(){ //not optimized, just unpick selected unit list!
		units.forEach(unit=>{
			unit.point.fillColor='black';
		});
	}
	function unpickAllLands(){ //unfinished
	}
	function pickNone(){
		unpickAllUnits();
		unpickAllLands();
		touch.selected=0;
		touch.which=0;
		if(DEBUG) console.log("Select Nothing!");
	}
	function pickUnit(id){ //picks a single unit by id
		unpickAllUnits();
		touch.selected=1;
		if(typeof(units[id]) != typeof(undefined)){
			rect.selected = false;
			rect.fillColor="lightgreen";
			touch.which=id;
			if(DEBUG) console.log("Selected unit: "+id);
			units[id].point.fillColor='red';
		}else{
			touch.selected=0;
			touch.which=0;
			if(DEBUG) console.log("Terrain Selected!");
			rect.selected = true;
			rect.fillColor="#ccffcc";
		}
	}
	function pickLand(id){ //picks a land by id
		touch={selected:2,which:+id};
		if(DEBUG) console.log("Select land: "+id);
	}

//INPUTS
	tool.onMouseDown = function(event) {
		doTouch(event.point);
	}

//GAME PREDEFINED [void this, eventually]
	// Terrain
	var rect = new Path.Rectangle({
		point: [0, 0], //display origin
		size: [7680,4320], //8k
		fillColor: 'lightgreen', //grass
		selected: false
	}); rect.sendToBack();
	// Paths
	let nodes = [
		[100,100,200,200],
		[200,200,150,300]
	];
	nodes.forEach(row=>{
		drawPath(row[0],row[1], row[2],row[3]);
	});

//TICK
	/*function onFrame(){
		units.forEach(unit=>{
			unit.position += unit.delta;
		});
	}*/
	doCanvasResize(); // initial setup
}
