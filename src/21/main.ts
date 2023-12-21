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

  console.log(getGardenCount(grid, 64));
};

const getGardenCount = (grid: string[][], steps: number) => {
  const start = findStart(grid);
  const queue: [Coord, number][] = [[start, steps]];
  const visited = new Set<string>();

  while (queue.length) {
    const [[x, y], s] = queue.shift() as [Coord, number];
    const k = x + "," + y + "|" + s;

    if (visited.has(k) || !grid[y] || !".S".includes(grid[y][x])) continue;

    visited.add(k);

    if (s === 0) continue;

    for (const [dx, dy] of dirs) {
      const nx = dx + x;
      const ny = dy + y;

      queue.push([[nx, ny], s - 1]);
    }
  }

  return Array.from(visited.values()).filter((k) => k.endsWith("|0")).length;
};

const findStart = (grid: string[][]): Coord => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "S") return [x, y];
    }
  }
  return [0, 0];
};

const parseGrid = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((l) => l.split(""));

main();
