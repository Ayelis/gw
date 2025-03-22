export const initializeCanvas = (canvas) => {
  paper.setup(canvas);

  const tool = new paper.Tool();

  const onMouseDown = (callback) => {
    tool.onMouseDown = (event) => {
      callback(event.point);
    };
    tool.activate(); // Activate the tool to ensure it listens for events
  };

  return { onMouseDown };
};

export const changeDots = (territory, color, radius) => {
  if (territory.polygon) {
    territory.polygon.strokeColor = "black";
    territory.polygon.fillColor = null; // Remove fill color

    // Remove existing dots
    if (territory.dots) {
      territory.dots.forEach((dot) => dot.remove());
    }

    // Create new dots
    territory.dots = territory.polygon.segments.map((segment) => {
      return new paper.Path.Circle({
        center: segment.point,
        radius: radius,
        fillColor: color,
      });
    });
  }
};