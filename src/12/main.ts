import { sum } from "lodash";
import input from "./example.txt";

const main = () => {
  const rows = input.trim().split("\n").map(parseRow);
  console.log(sum(rows.map((r) => getArrangements(r.springs, r.groups))));
};

const getArrangements = (springs: string, groups: number[]) => {
  const it = Array.from(Array(5));
  springs = it.map(() => springs).join("?");
  groups = it.flatMap(() => groups);
  springs = springs
    .replace(/^\.+/, "")
    .replace(/\.+$/, "")
    .replace(/\.+/g, ".");

  let maxShift = springs.length - (sum(groups) + groups.length - 1);
  const permutations = getPermutations(groups, maxShift);

  const matches = permutations.filter((p) => {
    for (let i = 0; i < springs.length; i++) {
      if (!matchChar(springs[i], p[i])) {
        return false;
      }
    }
    return true;
  });

  return matches.length;
};

const matchChar = (sc: string, pc: string) => {
  if (sc === "#") return pc === "#";
  if (sc === ".") return pc !== "#";
  if (sc === "?") return true;
  return false;
};

const getPermutations = (
  groups: number[],
  maxShift: number,
  curr = "",
  gi = 0,
  permutations: string[] = [],
) => {
  const g = "#".repeat(groups[gi]);

  for (let s = 0; s <= maxShift; s++) {
    const springs = curr + ".".repeat(s + (curr ? 1 : 0)) + g;

    if (gi === groups.length - 1) {
      permutations.push(springs);
      continue;
    }

    getPermutations(groups, maxShift - s, springs, gi + 1, permutations);
  }

  return permutations;
};

const parseRow = (row: string) => {
  const [springs, groups] = row.split(" ");
  return { springs, groups: groups.split(",").map(Number) };
};

main();
