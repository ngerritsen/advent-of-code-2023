import { sum } from "lodash";
import input from "./input.txt";

const main = () => {
  const rows = input.trim().split("\n").map(parseRow);
  console.log(sum(rows.map((r) => arrangements(r.springs, r.groups))));
  console.log(sum(rows.map((r) => unfoldedArrangements(r.springs, r.groups))));
};

const cache: Record<string, number> = {};

const unfoldedArrangements = (springs: string, groups: number[]) =>
  arrangements(
    getArr(5)
      .map(() => springs)
      .join("?"),
    getArr(5).flatMap(() => groups),
  );

const arrangements = (springs: string, groups: number[]) => {
  if (groups.length === 0) return springs.includes("#") ? 0 : 1;

  const k = springs + groups.join(",");

  if (cache[k] !== undefined) return cache[k];

  let n = 0;

  if (".?".includes(springs[0])) {
    n += arrangements(springs.slice(1), groups);
  }

  if ("#?".includes(springs[0])) {
    const g = groups[0];
    const r = springs.slice(0, g);

    if (r.length === g && !r.includes(".") && springs[g] !== "#") {
      n += arrangements(springs.slice(g + 1), groups.slice(1));
    }
  }

  cache[k] = n;

  return n;
};

const getArr = (length: number) => Array.from(Array(length));

const parseRow = (row: string) => {
  const [springs, groups] = row.split(" ");
  return { springs: springs, groups: groups.split(",").map(Number) };
};

main();
