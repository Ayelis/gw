// Log issues to console?
const DEBUG=true;

// Make the paper scope global, by injecting it into window:
paper.install(window);

// Only executed our code once the DOM is ready.
window.onload = function() {
	//Stay in sync if the window resizes...
	paper.setup('myCanvas');
	const canvas = document.getElementById("myCanvas");
	function resizeCanvas() {
		if(DEBUG) console.log("Window size update!");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);
	}
	window.addEventListener("resize", resizeCanvas);
	resizeCanvas(); // initial setup

//INIT
	var paths = [], units = [];
	var unitsCount=0;
	var tool = new paper.Tool();
	let touch = { //mode, selected(0none, 1unit, 2land), which, next
		mode:0, //[0-build, 1-select, 2-move]
		selected:0, //[0-unselected, 1-unit, 2-land]
		which:0, //[id of unit/land]
		next:0, //id of next unit in selection queue
	};
	var player = { //id, name, xp
		id:0,
		name:"user0",
		xp:0
	};
//FUNCTIONALITY
	function doButtonClick(){
		let buttonmode = incButtonmode();
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
	function incButtonmode(){
		if(isNaN(touch.mode))touch.mode=0;
		touch.mode++;
		if(touch.mode==3)touch.mode=0;
		return touch.mode;
	}
	function addPath(a,b,c,d){ //x,y, x,y
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
			//position: [x,y],
			center: [0, 0],
			radius: 3,
			fillColor: c
		});
	}
	function unpickAllUnits(){ //not optimized, just unpick selected unit list!
		units.forEach(unit=>{
			unit.fillColor='black';
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
	function buildUnit(id){
		if(typeof(units[id]) == typeof(undefined)){
			units[id]=drawUnitPoint(-10,-10,'black');
			if(DEBUG) console.log("Building unit "+id+"...");
			pickUnit(id);
			unitsCount++;
		}else{
			if(DEBUG) console.log("ERROR: Unit ["+id+"] not built!");
		}
	}
	function pickUnit(id){ //picks a single unit by id
		unpickAllUnits();
		touch.selected=1;
		if(typeof(units[id]) != typeof(undefined)){
			rect.selected = false;
			rect.fillColor="lightgreen";
			touch.which=id;
			if(DEBUG) console.log("Selected unit: "+id);
			units[id].fillColor='red';
			touch.next=id+1;
		}else{
			touch.next=0;
			touch.which=0;
			touch.selected=0;
			if(DEBUG) console.log("Terrain Selected!");
			rect.selected = true;
			rect.fillColor="#ccffcc";
		}
	}
	function pickLand(id){ //picks a land by id
		touch={selected:2,which:+id};
		if(DEBUG) console.log("Select land: "+id);
	}
	function doTouch(point){ //todo: Remove arbitrary selection test code
		switch(touch.mode){
			case 2: //move unit // TELEPORT!!
				if(typeof(units[touch.which]) != typeof(undefined)){
					if(touch.selected==1){
						units[touch.which].position = point; //move the 0th unit
						if(DEBUG) console.log("Unit "+touch.which+" moved to "+point);
					}else{
						if(DEBUG) console.log("Warning! Unit not selected!");						
					}
				}else{
					if(DEBUG) console.log("ERROR! Undefined ID: "+touch.which);
				}
			break;
			case 1: //select object // TOGGLE!!
				if(touch.selected==0 && touch.which==0)
					touch.selected = 1;				
				if(touch.selected == 1){
					//cycle through units
					pickUnit(touch.next); //select this one
					if(touch.which == units.count)
						pickNone(); //unselect all
				}else{
					//whatever lol
				}
			break;
			default: //build unit // ANYWHERE!!
				let newguy = unitsCount;
				buildUnit(newguy);
				units[newguy].position = point; //move the new unit
			break;
		}
	}

//INPUTS
	let button = document.querySelector('#mode');
	button.addEventListener('click', doButtonClick);
	tool.onMouseDown = function(event) {
		// Whenever the user clicks the mouse, move the dot to that position:
		doTouch(event.point);
	}

//DEFINE ARBITRARY BG STUFF
	// Terrain
	var rect = new Path.Rectangle({
		point: [0, 0], //display origin
		size: [7680,4320], //8k
		fillColor: 'lightgreen', //grass
		selected: false
	}); rect.sendToBack();
	let nodes = [
		[100,100,200,200],
		[200,200,150,300]
	];

//GAME PREDEFINED [void this]
	//Paths
	nodes.forEach(row=>{
		addPath(row[0],row[1], row[2],row[3]);
	});
}
//TICK
function onFrame(){
	units.forEach(unit=>{
		unit.position += unit.delta;
	});
}