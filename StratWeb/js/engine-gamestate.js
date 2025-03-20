export let tool = new paper.Tool();
export let units = [];
export let territories = new Map(); // Add territories if needed
export let paths = [];

export let touch = {
  mode: 0, // [0-build, 1-select, 2-move]
  selected: 0, // [0-unselected, 1-unit, 2-land]
  which: 0 // [id of unit/land]
};

export const player = {
  id: 0,
  name: "user0",
  xp: 0
};
