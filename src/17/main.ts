import { sortedIndexBy } from "lodash";
import input from "./input.txt";

const dirs = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const main = () => {
  const grid = input
    .trim()
    .split("\n")
    .map((r) => r.split("").map(Number));

  console.log(getShortestPath(grid, 0, 3));
  console.log(getShortestPath(grid, 4, 10));
};

const getShortestPath = (grid: number[][], min: number, max: number) => {
  const w = grid[0].length;
  const h = grid.length;
  const loss: Record<string, number> = {};
  const queue = [[0, 0, 0, 0, 0, 0]];

  while (queue.length) {
    const [l, x, y, dx, dy, n] = queue.shift() as number[];

    if (x === w - 1 && y === h - 1 && n >= min - 1) return l;

    for (const [ndx, ndy] of dirs) {
      const start = x === 0 && y === 0;
      const straight = (ndx === dx && ndy === dy) || start;

      if (ndx === dx * -1 && ndy === dy * -1 && !start) continue;
      if ((straight && n >= max) || (!straight && n < min)) continue;

      const nx = x + ndx;
      const ny = y + ndy;
      const nn = straight ? n + 1 : 1;

      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;

      const nl = grid[ny][nx] + (start ? 0 : l);
      const nk = [nx, ny, ndx, ndy, nn].join(",");

      if (loss[nk]) continue;

      const item = [nl, nx, ny, ndx, ndy, nn];
      const i = sortedIndexBy(queue, item, (s) => s[0]);

      queue.splice(i, 0, item);
      loss[nk] = nl;
    }
  }
};

main();
