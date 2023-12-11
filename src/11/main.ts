import { inRange, sum } from "lodash";
import input from "./input.txt";

const main = () => {
  const universe = input.trim().split("\n").map(parseRow);
  const emptyRows = getEmptyRows(universe);
  const emptyCols = getEmptyCols(universe);
  const galaxyPairs = getGalaxyPairs(getGalaxies(universe));

  console.log(sum(getGalaxyDistances(galaxyPairs, emptyRows, emptyCols, 2)));
  console.log(sum(getGalaxyDistances(galaxyPairs, emptyRows, emptyCols, 1e6)));
};

const getGalaxyDistances = (
  galaxyPairs: number[][][],
  emptyRows: number[],
  emptyCols: number[],
  m: number,
) =>
  galaxyPairs.map(([galaxyA, galaxyB]) =>
    getDistance(galaxyA, galaxyB, emptyRows, emptyCols, m),
  );

const getGalaxies = (universe: number[][]) =>
  universe.flatMap((row, y) =>
    row.flatMap((v, x) => (v === 1 ? [[x, y]] : [])),
  );

const getGalaxyPairs = (galaxies: number[][]) =>
  galaxies.flatMap((ga, i) => galaxies.slice(i + 1).map((gb) => [ga, gb]));

const getDistance = (
  ga: number[],
  gb: number[],
  emptyRows: number[],
  emptyCols: number[],
  m: number,
) => {
  const [xs, xe] = ga[0] > gb[0] ? [gb[0], ga[0]] : [ga[0], gb[0]];
  const [ys, ye] = ga[1] > gb[1] ? [gb[1], ga[1]] : [ga[1], gb[1]];
  const xm = emptyCols.filter((x) => inRange(x, xs, xe)).length * (m - 1);
  const ym = emptyRows.filter((y) => inRange(y, ys, ye)).length * (m - 1);
  return xe - xs + xm + ye - ys + ym;
};

const getEmptyRows = (universe: number[][]) =>
  universe
    .map((row, i) => [row, i] as [number[], number])
    .filter(([row]) => row.every((v) => v === 0))
    .map(([, i]) => i);

const getEmptyCols = (universe: number[][]) =>
  universe
    .slice(1)
    .reduce((counts, r) => counts.map((c, i) => c + r[i]), universe[0])
    .map((c, i) => [c, i])
    .filter(([c]) => c === 0)
    .map(([, i]) => i);

const parseRow = (row: string) => row.split("").map((c) => (c === "." ? 0 : 1));

main();
