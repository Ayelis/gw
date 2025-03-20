import { DEBUG } from './index.js';
import { initializeGame } from './engine-gameinit.js';
import { gameLoop } from './engine-gameloop.js';
import { paths } from './engine-gamestate.js';

export const button = document.getElementById("mode");
const canvas = document.getElementById("myCanvas");

// Make the paper scope global, by injecting it into window:
paper.install(window);

// Exportable events used in input functions
export function doCanvasResize() {
    if (DEBUG) console.log("Window size update!");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    paper.view.viewSize = new paper.Size(window.innerWidth, window.innerHeight);
}
export function drawUnitPoint(x, y, c) {
    return new Path.Circle({
        position: [x, y],
        center: [0, 0],
        radius: 3,
        fillColor: c
    });
}
export function drawPath(a, b, c, d) {
	console.log("a,b",a,b);
	console.log("c,d",c,d);
    var pl = paths.length || 0;
    paths[pl] = new Path();
    paths[pl].strokeColor = 'gray';
    var start = new Point(a, b);
    var end = new Point(c, d);
    paths[pl].moveTo(start);
    paths[pl].lineTo(end);
}
export function translateView(delta) {
    view.translate(delta);// Translate the viewport
}

// Only execute our code once the DOM is ready.
window.onload = function() {
    doCanvasResize(); // initial setup
}