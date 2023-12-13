import { sum } from "lodash";
import input from "./input.txt";

const main = () => {
  const grids = parseGrids(input);
  const vals = grids.map(getMirrorValue);
  const cleanVals = grids.map((grid, i) => getCleanMirrorValue(grid, vals[i]));

  console.log(sum(vals));
  console.log(sum(cleanVals));
};

const getCleanMirrorValue = (grid: string[], old: number) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const row = grid[y];
      grid[y] = replace(row, x, swap(row.charAt(x)));
      const val = getMirrorValue(grid, old);
      if (val) return val;
      grid[y] = row;
    }
  }
};

const swap = (value: string) => (value === "#" ? "." : "#");

const replace = (str: string, at: number, v: string) =>
  str.slice(0, at) + v + str.slice(at + 1);

const getMirrorValue = (grid: string[], ignore: number) => {
  const ignoreAxis = ignore >= 100 ? "y" : "x";
  const ignoreIdx = ignore >= 100 ? ignore / 100 : ignore;
  const y = getReflection(grid, ignoreAxis === "y" ? ignoreIdx : -1);
  if (y) return y * 100;
  return getReflection(rotate(grid), ignoreAxis === "x" ? ignoreIdx : -1);
};

const getReflection = (grid: string[], ignoreIdx: number) => {
  for (let i = 1; i < grid.length; i++) {
    if (ignoreIdx === i) continue;
    if (reflects(grid, i)) return i;
  }

  return 0;
};

const reflects = (grid: string[], x: number) => {
  const steps = Math.min(x, grid.length - x);

  for (let o = 0; o < steps; o++) {
    if (grid[x + o] !== grid[x - o - 1]) return false;
  }

  return true;
};

const rotate = (grid: string[]) => {
  const cols = grid[0].split("");

  for (let y = 1; y < grid.length; y++) {
    for (let x = 0; x < cols.length; x++) {
      cols[x] += grid[y][x];
    }
  }

  return cols;
};

const parseGrids = (input: string) =>
  input
    .trim()
    .split("\n\n")
    .map((g) => g.split("\n"));

main();
