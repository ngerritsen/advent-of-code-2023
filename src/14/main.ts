import input from "./input.txt";

const dirs = ["N", "W", "S", "E"];

const main = () => {
  console.log(getNorthWeight(tiltGrid(parseGrid(input), "N")));
  console.log(getNorthWeightAfterCycles(parseGrid(input), 1e9));
};

const getNorthWeightAfterCycles = (grid: string[][], cycles: number) => {
  const hist = new Map<string, number>();
  let g = grid;

  for (let i = 0; i < cycles; i++) {
    g = cycleGrid(g);
    const hash = hashGrid(g);
    const prev = hist.get(hash);

    if (prev) {
      const r = (cycles - i) % (i - prev);
      i = cycles - r;
    }

    hist.set(hash, i);
  }

  return getNorthWeight(g);
};

const cycleGrid = (grid: string[][]) =>
  dirs.reduce((g, d) => tiltGrid(g, d), grid);

const hashGrid = (grid: string[][]) =>
  grid.reduce((h, r) => h + r.join(""), "");

const tiltGrid = (grid: string[][], dir: string) => {
  const horz = dir === "W" || dir === "E";
  const width = horz ? grid.length : grid[0].length;
  const length = horz ? grid[0].length : grid.length;

  for (let w = 0; w < width; w++) {
    let s = 0;

    for (let l = 0; l < length; l++) {
      const [x, y] = getCoords(w, l, dir, grid);

      switch (grid[y][x]) {
        case "#": {
          s = l + 1;
          break;
        }
        case "O": {
          const [sx, sy] = getCoords(w, s, dir, grid);
          grid[y][x] = ".";
          grid[sy][sx] = "O";
          s++;
        }
      }
    }
  }

  return grid;
};

const getCoords = (w: number, l: number, dir: string, grid: string[][]) => {
  switch (dir) {
    case "W":
      return [l, w];
    case "S":
      return [w, grid.length - l - 1];
    case "E":
      return [grid[0].length - l - 1, w];
    default:
      return [w, l];
  }
};

const getNorthWeight = (grid: string[][]) => {
  let weight = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] === "O") weight += grid.length - y;
    }
  }
  return weight;
};

const parseGrid = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((row) => row.split(""));

main();
