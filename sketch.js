const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes/1000.json");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = ({ width, height }) => {
  const gridSize = 6;
  const margin = width * 0.1;
  const count = 3;
  const numberOfColors = random.rangeFloor(2, 6);
  const palette = random
    .shuffle(random.pick(palettes))
    .slice(0, numberOfColors);

  const createGrid = () => {
    const points = [];
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const u = x / (gridSize - 1);
        const v = y / (gridSize - 1);
        points.push([u, v]);
      }
    }
    return points;
  };

  const grid = createGrid();

  const createTrapezoids = () => {
    function translatePosition(position) {
      return position * (width - 2 * margin) + margin;
    }

    function createTrapezoid() {
      const pointA = random.pick(grid);

      let pointB = random.pick(grid);

      while (pointA[1] === pointB[1] || pointA[0] === pointB[0]) {
        pointB = random.pick(grid);
      }

      const pointC = [pointB[0], 1];
      const pointD = [pointA[0], 1];

      const points = [pointA, pointB, pointC, pointD];

      const translatedPoints = [];
      points.forEach((point) => {
        translatedPoints.push([
          translatePosition(point[0]),
          translatePosition(point[1]),
        ]);
      });
      return { positions: translatedPoints, color: random.pick(palette) };
    }

    const trapezoidArray = [];
    for (let index = 0; index < count; index++) {
      trapezoidArray.push(createTrapezoid());
    }
    return trapezoidArray;
  };

  const trapezoids = createTrapezoids();

  return ({ context, width, height }) => {
    grid.forEach(([u, v]) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(height - margin, margin, v);
      context.beginPath();
      context.arc(x, y, 10, 0, Math.PI * 2, false);
      context.fillStyle = "black";
      context.fill();
    });

    trapezoids.forEach((trapezoid) => {
      const { positions, color } = trapezoid;
      context.beginPath();
      context.moveTo(...positions[0]);
      context.lineTo(...positions[1]);
      context.lineTo(...positions[2]);
      context.lineTo(...positions[3]);
      context.closePath();
      context.fillStyle = color;
      context.strokeStyle = "black";
      context.lineWidth = 30;
      context.stroke();
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
