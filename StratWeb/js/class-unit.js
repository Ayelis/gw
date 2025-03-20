// units.js
import { DEBUG } from './index.js';

export class Unit {
	constructor(id, point, type = 3, speed = 1, owner = 0, graphic = null, destination = null) {
		this.id = id;
		this.point = point;
		this.type = type; //1 land 2 sea 3 air
		this.speed = speed;
		this.owner = owner; //neutral
		this.graphic = graphic;
		this.x = point.x;
		this.y = point.y;
		this.destination = destination;
		this.position = null;
	}
	update(delta) {
		if (!this.destination) return;

		// Ensure position is a Paper.Point object
		this.position = new Point(this.point.position.x, this.point.position.y);

		let vector = this.destination.subtract(this.position);
		let distance = vector.length;

		if (distance < this.speed * delta * 20) {
			this.position = this.destination.clone();
			this.destination = null;
			if (DEBUG) console.log("Point reached, stopping!");
		} else {
			let step = vector.normalize().multiply(this.speed * delta * 20);
			this.position = this.position.add(step); // Update logical position
		}

		// Update the Paper.js circle's position
		if (this.point) {
			this.point.position = this.position.clone();
		}
	}
}
