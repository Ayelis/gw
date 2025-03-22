import { units } from './index.js';

export function gameLoop(delta) {
  // Update all units
  units.forEach(unit => unit.update(delta));
}