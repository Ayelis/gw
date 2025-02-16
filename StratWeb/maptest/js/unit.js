// units.js
export class Unit {
  constructor(id, point, type = 3, speed = 1, owner = 0, graphic = null) {
    this.id = id;
	this.point = point;
    this.type = type; //1 land 2 sea 3 air
    this.speed = speed;
    this.owner = owner; //neutral
	this.graphic = graphic;
    this.x = point.x;
    this.y = point.y;
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
  updateGraphic(){
	  if(this.graphic){
	  }
  }
}
