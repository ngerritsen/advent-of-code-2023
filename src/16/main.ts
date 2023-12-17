// Using the import syntax messes up the backslashes
const input = await Bun.file(import.meta.dir + "/input.txt").text();

type Coord = [number, number];
type Grid = string[];
type Visited = Map<string, Set<string>>;

const main = () => {
  const grid = input.trim().split("\n");
  console.log(energizeTiles(grid, [0, 0], [1, 0]));
  console.log(getMaxEnergizedTiles(grid));
};

const getMaxEnergizedTiles = (grid: Grid) => {
  const w = grid[0].length;
  const h = grid.length;
  let max = 0;

  for (let x = 0; x < w; x++) {
    max = Math.max(energizeTiles(grid, [x, 0], [0, 1]), max);
    max = Math.max(energizeTiles(grid, [x, h - 1], [0, -1]), max);
  }

  for (let y = 0; y < h; y++) {
    max = Math.max(energizeTiles(grid, [0, y], [1, 0]), max);
    max = Math.max(energizeTiles(grid, [w - 1, y], [-1, 0]), max);
  }

  return max;
};

const energizeTiles = (grid: Grid, coord: Coord, dir: Coord) => {
  const visited = new Map<string, Set<string>>();
  runBeam(grid, coord, dir, visited);
  return visited.size;
};

const runBeam = (
  grid: Grid,
  coord: Coord,
  dir: Coord,
  visited: Visited,
): void => {
  if (outOfBounds(grid, coord)) return;

  const visitedDirs = visited.get(coord.join(","));

  if (!visitedDirs) {
    visited.set(coord.join(","), new Set([dir.join(",")]));
  } else {
    if (visitedDirs.has(dir.join(","))) return;
    visitedDirs.add(dir.join(","));
  }

  const v = grid[coord[1]][coord[0]];
  let [dx, dy] = dir;

  if (v === "/" || v === "\\") {
    const m = v === "/" ? -1 : 1;
    const d: Coord = isVert(dir) ? [dy * m, 0] : [0, dx * m];
    return moveBeam(grid, coord, d, visited);
  } else if (v === "|" && isHorz(dir)) {
    return splitBeam(grid, coord, [dy, dx], visited);
  } else if (v === "-" && isVert(dir)) {
    return splitBeam(grid, coord, [dy, dx], visited);
  }

  return moveBeam(grid, coord, dir, visited);
};

const splitBeam = (grid: Grid, coord: Coord, dir: Coord, visited: Visited) =>
  [dir, invert(dir)].forEach((d) => moveBeam(grid, coord, d, visited));

const moveBeam = (grid: Grid, coord: Coord, dir: Coord, visited: Visited) =>
  runBeam(grid, add(coord, dir), dir, visited);

const isHorz = (dir: Coord) => dir[1] === 0;
const isVert = (dir: Coord) => !isHorz(dir);
const invert = (dir: Coord): Coord => [dir[0] * -1, dir[1] * -1];

const outOfBounds = (grid: Grid, [x, y]: Coord) =>
  x < 0 || y < 0 || x >= grid[0].length || y >= grid.length;

const add = (a: Coord, b: Coord): Coord => [a[0] + b[0], a[1] + b[1]];

main();
