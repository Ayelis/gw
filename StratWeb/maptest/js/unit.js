// units.js
class Unit {
  constructor(x, y, type, countryUID) {
    this.x = x;
    this.y = y;
    this.type = type; //1 land 2 sea 3 air
    this.countryUID = 0; //neutral
  }

  move(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}

export default Unit;