// Make the paper scope global, by injecting it into window:
paper.install(window);

// Only executed our code once the DOM is ready.
window.onload = function() {
	// Get a reference to the canvas object if paper not scoped global
	// var canvas = document.getElementById('myCanvas'); paper.setup(canvas);
//INIT
	paper.setup('myCanvas');
	var paths = [], units = [];
	var tool = new paper.Tool();
	let touch = { //mode, type, id
		mode:0, //[0-select, 1-move, 2-new dot(dev)]
		selected:0, //[0-unselected, 1-unit, 2-terrain]
		which:0, //[id of terrain/unit]
		next:0,
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
				button.value="Mode: Move";
			break;
			case 2:
				button.value="Mode: Build";
			break;
			default:
				button.value="Mode: Select";
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
		console.log("Select Nothing!");
	}
	function buildUnit(id){
		console.log("Building unit "+id+"...");
		if(typeof(units[id]) == typeof(undefined)){
			console.log("No unit exists yet, perfect!");
			units[id]=drawUnitPoint(-10,-10,'black');
			console.log("Unit added to draw queue");
		}
		pickUnit(id);
		console.log("Unit selected");
	}
	function pickUnit(id){ //picks a single unit by id
		unpickAllUnits();
		console.log("Unselected everything else");
		touch.selected=1;
		console.log("Selection mode implemented");
		if(typeof(units[id]) != typeof(undefined)){
			touch.which=id;
			console.log("Selected unit: "+id);
			units[id].fillColor='red';
			console.log("Dot highlighted");
			touch.next=id+1;
		}else{
			console.log("ERROR! Undefined ID! Unit "+id+" doesn't exist!");
			touch.next=0;
			touch.which=0;
			touch.selected=0;
		}
	}
	function pickLand(id){ //picks a land by id
		touch={selected:2,which:+id};
		console.log("Select land: "+id);
	}
	function doTouch(point){ //todo: Remove arbitrary selection test code
		console.log(touch);
		switch(touch.mode){
			case 2: //new unit
				console.log("ENTERING BUILD MODE");
				console.log(touch.next);
				let newguy = touch.next||0;
				buildUnit(newguy);
				units[newguy].position = point; //move the new unit
			break;
			case 1: //move unit //teleport!!
				console.log("ENTERING MOVE MODE");
				if(typeof(units[touch.which]) != typeof(undefined)){
					if(touch.selected==1)
						units[touch.which].position = point; //move the 0th unit
				}else{
					console.log("ERROR! Undefined ID: "+touch.which);
				}
			break;
			default:
				console.log("ENTERING SELECT MODE");
				if(touch.selected==0 && touch.which==0){
					touch.selected = 1;
					pickUnit(touch.next); //select this one
				}else if(touch.selected == 1){
					//cycle through units
					pickUnit(touch.next); //select this one
					if(touch.which == units.count)
						pickNone(); //unselect all
				}else{
					//whatever lol
				}
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
		point: [0, 0],
		size: [view.size.width, view.size.height],
		strokeColor: 'lightgreen',
		fillColor: 'lightgreen',
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
