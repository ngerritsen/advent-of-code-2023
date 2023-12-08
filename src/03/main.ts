import { isNumeric } from "../utils";
import input from "./input.txt";

const main = () => {
  const grid = input.split("\n");

  console.log(getSumOfValidNums(grid));
  console.log(getSumOfGearRatios(grid));
};

const getSumOfValidNums = (grid: string[]) => {
  let sum = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (!isNumeric(grid[y][x])) continue;

      const num = resolveNum(grid[y], x);

      if (hasSymbol(getNumArea(grid, x, y, num.length))) {
        sum += Number(num);
      }

      x += num.length;
    }
  }

  return sum;
};

const getSumOfGearRatios = (grid: string[]) => {
  let sum = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] !== "*") continue;

      const nums = getGearNums(grid, x, y);

      if (nums.length === 2) {
        sum += nums[0] * nums[1];
      }
    }
  }

  return sum;
};

const getGearNums = (grid: string[], x: number, y: number) =>
  [-1, 0, 1]
    .flatMap((v) => getRowNums(grid[y + v], x))
    .filter(Boolean)
    .map(Number);

const getRowNums = (row: string, x: number) =>
  isNumeric(row[x])
    ? [resolveNum(row, x)]
    : [-1, 1].map((v) => isNumeric(row[x + v]) && resolveNum(row, x + v));

const resolveNum = (row: string, x: number) =>
  resolveNumDir(row, x, "", -1) + resolveNumDir(row, x, row[x], 1);

const resolveNumDir = (row: string, x: number, s: string, v: 1 | -1): string =>
  isNumeric(row[x + v])
    ? resolveNumDir(row, x + v, v > 0 ? s + row[x + v] : row[x + v] + s, v)
    : s;

const getNumArea = (grid: string[], x: number, y: number, len: number) =>
  [-1, 0, 1].map((vy) => getNumAreaRow(grid, x, y + vy, len)).join("");

const getNumAreaRow = (grid: string[], x: number, y: number, len: number) =>
  (grid[y] || "").slice(Math.max(x - 1, 0), x + len + 1);

const hasSymbol = (str: string) => !!str.match(/[^.\d]/);

main();
