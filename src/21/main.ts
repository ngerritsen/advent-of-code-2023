import { add } from "lodash";
import input from "./input.txt";

type Coord = [number, number];

const dirs = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const main = () => {
  const grid = parseGrid(input);
  const center = Math.floor(grid.length / 2);
  const start: Coord = [center, center];

  console.log(getGardenCount(grid, start, 64));
  console.log(getRepeatedGardenCount(grid, 26501365));
};

const getRepeatedGardenCount = (grid: string[][], steps: number) => {
  const size = grid.length;
  const center = Math.floor(size / 2);
  const reach = Math.floor(steps / size - 1);
  const odds = (Math.floor(reach / 2) * 2 + 1) ** 2;
  const evens = (Math.ceil(reach / 2) * 2) ** 2;
  const end = size - 1;

  const odd = getGardenCount(grid, [center, center], size);
  const even = getGardenCount(grid, [center, center], size + 1);

  const edgeSteps = size - 1;

  const top = getGardenCount(grid, [center, end], edgeSteps);
  const right = getGardenCount(grid, [0, center], edgeSteps);
  const bottom = getGardenCount(grid, [center, 0], edgeSteps);
  const left = getGardenCount(grid, [end, center], edgeSteps);

  const smallSteps = Math.floor(size / 2) - 1;

  const smallTopRight = getGardenCount(grid, [0, end], smallSteps);
  const smallBottomRight = getGardenCount(grid, [0, 0], smallSteps);
  const smallBottomLeft = getGardenCount(grid, [end, 0], smallSteps);
  const smallTopLeft = getGardenCount(grid, [end, end], smallSteps);

  const largeSteps = Math.floor((size * 3) / 2) - 1;

  const largeTopRight = getGardenCount(grid, [0, end], largeSteps);
  const largeBottomRight = getGardenCount(grid, [0, 0], largeSteps);
  const largeBottomLeft = getGardenCount(grid, [end, 0], largeSteps);
  const largeTopLeft = getGardenCount(grid, [end, end], largeSteps);

  return (
    odd * odds +
    even * evens +
    top +
    right +
    bottom +
    left +
    (smallTopRight + smallBottomRight + smallBottomLeft + smallTopLeft) *
      (reach + 1) +
    (largeTopRight + largeBottomRight + largeBottomLeft + largeTopLeft) * reach
  );
};

const getGardenCount = (grid: string[][], start: Coord, steps: number) => {
  const queue: [Coord, number][] = [[start, steps]];
  const visited = new Set<string>([start.join(",")]);
  const targets = new Set<string>();

  while (queue.length) {
    const [[x, y], s] = queue.shift() as [Coord, number];

    if (s % 2 === 0) targets.add(x + "," + y);
    if (s === 0) continue;

    for (const [dx, dy] of dirs) {
      const nx = dx + x;
      const ny = dy + y;
      const nk = nx + "," + ny;

      if (visited.has(nk) || !grid[ny] || !grid[ny][nx] || grid[ny][nx] === "#")
        continue;

      visited.add(nk);
      queue.push([[nx, ny], s - 1]);
    }
  }

  return targets.size;
};

const parseGrid = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((l) => l.split(""));

main();
