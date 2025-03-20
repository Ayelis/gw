import { units } from './engine-gamestate.js';

export function gameLoop(delta) {
  // Update all units
  units.forEach(unit => unit.update(delta));
}