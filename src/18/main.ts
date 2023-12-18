import { groupBy, parseInt, sortBy, sortedUniq } from "lodash";
import input from "./input.txt";

type Dir = "R" | "D" | "L" | "U";
type Instr = [Dir, number, string];
type Coord = [number, number];
type Line = [Coord, Coord];
type Intersection = "S" | "M" | "E";

const digitDirs = ["R", "D", "L", "U"] as const;
const dirs: Record<Dir, Coord> = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1],
};

const main = () => {
  const plan = input.trim().split("\n").map(parseRow);
  const lines = draw(plan);
  const fixedLines = draw(fixPlan(plan));

  console.log(totalLength(lines) + fill(lines));
  console.log(totalLength(fixedLines) + fill(fixedLines));
};

const totalLength = (lines: Line[]) => lines.reduce((t, l) => t + length(l), 0);

const fill = (lines: Line[]) => {
  const nodes = lines.flat();
  const vertLines = lines
    .filter(([a, b]) => a[0] === b[0])
    .map((line) => sortBy(line, (n) => n[1]) as Line);
  const vertLinesByX = groupBy(vertLines, ([a]) => a[0]);
  const verticals = sortedUniq(sort(nodes.map((n) => n[0])));
  const horizontals = sortedUniq(sort(nodes.map((n) => n[1])));
  let f = 0;

  for (let iy = 0; iy < horizontals.length; iy++) {
    const y = horizontals[iy];
    const ny = horizontals[iy + 1];
    let i = 0;
    let prev = "";

    // Fill horizontal lines
    for (let ix = 0; ix < verticals.length; ix++) {
      const x = verticals[ix];
      const px = verticals[ix - 1];
      const ln = vertLinesByX[x].find((l) => on(y, l));
      const intersection = ln ? getIntersection(y, ln) : undefined;

      if (i % 2 === 1 && !prev) f += Math.abs(x - px) - (intersection ? 1 : 0);
      if (intersection === "M") i++;
      if (intersection && "SE".includes(intersection)) {
        if (prev && prev !== intersection) i++;
        prev = prev ? "" : intersection;
      }
    }

    i = 0;

    // Fill areas between horizontal lines
    if (ny !== undefined && ny !== y + 1) {
      const height = Math.abs(ny - y) - 1;

      for (let ix = 0; ix < verticals.length; ix++) {
        const x = verticals[ix];
        const px = verticals[ix - 1];
        const interects = vertLinesByX[x].some((l) => on(y + 1, l));

        if (i % 2 === 1) f += (Math.abs(x - px) - (interects ? 1 : 0)) * height;
        if (interects) i++;
      }
    }
  }

  return f;
};

const draw = (plan: Instr[]) => {
  const lines: Line[] = [];
  let curr: Coord = [0, 0];

  for (const [d, n] of plan) {
    const next = add(curr, mul(dirs[d], n));
    lines.push([curr, next]);
    curr = next;
  }

  return lines;
};

const on = (y: number, [s, e]: Line) => y >= s[1] && y <= e[1];
const length = ([s, e]: Line) => Math.abs(e[0] - s[0]) + Math.abs(e[1] - s[1]);
const getIntersection = (y: number, [s, e]: Line): Intersection =>
  y === s[1] ? "S" : y === e[1] ? "E" : "M";

const fixPlan = (plan: Instr[]): Instr[] =>
  plan.map(([, , c]) => {
    const last = c.slice(c.length - 1);
    const hex = c.slice(0, c.length - 1);
    return [digitToDir(last), parseInt(hex, 16), c];
  });

const sort = (arr: number[]) => sortBy(arr, (x) => x);
const digitToDir = (d: string) => digitDirs[Number(d)];

const parseRow = (row: string): Instr => {
  const [, d, n, c] = row.match(/(\w) (\d+) \(#(.+)\)/) || [];
  return [d as Dir, Number(n), c];
};

const add = (a: Coord, b: Coord): Coord => [a[0] + b[0], a[1] + b[1]];
const mul = (a: Coord, n: number): Coord => [a[0] * n, a[1] * n];

main();
