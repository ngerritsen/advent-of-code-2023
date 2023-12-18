import { groupBy, last, nth, parseInt, sortBy, sortedUniq, sum } from "lodash";
import input from "./input.txt";

type Dir = "R" | "D" | "L" | "U";
type Instr = [Dir, number, string];
type Coord = [number, number];

const digitDirs = ["R", "D", "L", "U"] as const;
const dirs: Record<Dir, Coord> = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1],
};

const main = () => {
  const plan = input.trim().split("\n").map(parseRow);

  console.log(getArea(plan));
  console.log(getArea(fixPlan(plan)));
};

const getArea = (plan: Instr[]) => {
  const points = getPoints(plan);
  const boundary = plan.reduce((t, [, n]) => t + n, 0);

  // see: https://en.wikipedia.org/wiki/Shoelace_formula
  const area =
    sum(
      points.map(
        (p, i) => p[1] * (nthx(points, i - 1)[0] - nthx(points, i + 1)[0]),
      ),
    ) / 2;

  // see: https://en.wikipedia.org/wiki/Pick%27s_theorem
  const inside = area - boundary / 2 + 1;

  return inside + boundary;
};

const getPoints = (plan: Instr[]) => {
  let points: Coord[] = [[0, 0]];
  for (const [d, n] of plan) {
    points.push(add(last(points) as Coord, mul(dirs[d], n)));
  }
  return points;
};

const fixPlan = (plan: Instr[]): Instr[] =>
  plan.map(([, , c]) => {
    const last = c.slice(c.length - 1);
    const hex = c.slice(0, c.length - 1);
    return [digitToDir(last), parseInt(hex, 16), c];
  });

const parseRow = (row: string): Instr => {
  const [, d, n, c] = row.match(/(\w) (\d+) \(#(.+)\)/) || [];
  return [d as Dir, Number(n), c];
};

const nthx = <T>(arr: T[], n: number): T => nth(arr, n % arr.length) as T;
const digitToDir = (d: string) => digitDirs[Number(d)];
const add = (a: Coord, b: Coord): Coord => [a[0] + b[0], a[1] + b[1]];
const mul = (a: Coord, n: number): Coord => [a[0] * n, a[1] * n];

main();
