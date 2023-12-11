import input from "./input.txt";

type Coord = [number, number];
type Nodes = Map<string, Coord>;

const N: Coord = [0, -1];
const E: Coord = [1, 0];
const S: Coord = [0, 1];
const W: Coord = [-1, 0];

const segments: Record<string, Coord[]> = {
  "|": [N, S],
  "-": [W, E],
  L: [E, N],
  F: [S, E],
  7: [W, S],
  J: [N, W],
};

const verticals: Record<string, string> = { F: "J", L: "7" };

const main = () => {
  const grid = input.trim().split("\n");
  const loop = findLoop(grid, getStart(grid)) || new Map();

  console.log(loop.size / 2);
  console.log(getEnclosedAreas(grid, loop));
};

const getEnclosedAreas = (grid: string[], loop: Nodes) => {
  let enclosed = 0;

  for (let y = 0; y < grid.length; y++) {
    let i = 0;
    let p = "";

    for (let x = 0; x < grid[y].length; x++) {
      const k = toKey([x, y]);
      const c = grid[y][x];
      const onLoop = loop.has(k);

      if (!onLoop && i % 2 === 1) enclosed++;
      if (onLoop && c !== "-" && verticals[p] !== c) {
        p = c;
        i++;
      }
    }
  }

  return enclosed;
};

const findLoop = (grid: string[], start: Coord) => {
  for (const d of [N, E, S]) {
    const n = getLoop(grid, add(start, d), d, new Map([[toKey(start), start]]));
    if (n) return n;
  }
};

const getLoop = (
  grid: string[],
  curr: Coord,
  dir: Coord,
  nodes: Nodes,
): Nodes | undefined => {
  const char = (grid[curr[1]] || "")[curr[0]];

  if (!char || char === ".") return;
  if (char === "S") return nodes;

  const inv = invert(dir);
  const entry = segments[char].findIndex((d) => equal(d, inv));
  if (entry === -1) return;

  const exit = segments[char][Math.abs(entry - 1)];
  const next = add(curr, exit);

  nodes.set(toKey(curr), curr);

  return getLoop(grid, next, exit, nodes);
};

const getStart = (grid: string[]): Coord => {
  const row = grid.find((r) => r.includes("S")) || "";
  return [row.indexOf("S"), grid.indexOf(row)];
};

const toKey = (x: Coord) => x.join(",");
const equal = (a: Coord, b: Coord) => a[0] === b[0] && a[1] === b[1];
const invert = (c: Coord): Coord => [c[0] * -1, c[1] * -1];
const add = (a: Coord, b: Coord): Coord => [a[0] + b[0], a[1] + b[1]];

main();
