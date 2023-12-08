import { chunk, inRange } from "lodash";
import input from "./input.txt";

const main = () => {
  const { seeds, categories } = parseAlmanac(input);

  console.log(getMinLocation(seeds, categories));
  console.log(getMinLocationRange(seeds, categories));
};

const getMinLocation = (seeds: number[], categories: number[][][]) =>
  Math.min(...seeds.map((s) => getLocation(categories, s)));

const getMinLocationRange = (seeds: number[], categories: number[][][]) =>
  Math.min(...getLocationRanges(seeds, categories).map((r) => r[0]));

const getLocation = (categories: number[][][], seed: number) =>
  categories.reduce((num, mappings) => {
    const mapping = mappings.find((m) => inRange(num, m[1], m[1] + m[2]));
    if (!mapping) return num;
    return mapping[0] + num - mapping[1];
  }, seed);

const getLocationRanges = (seeds: number[], categories: number[][][]) =>
  categories.reduce(
    (ranges, mappings) => ranges.flatMap((r) => getRanges(r, mappings)),
    toRanges(seeds),
  );

const getRanges = (range: number[], mappings: number[][]) => {
  const ranges: number[][] = [];

  for (const m of mappings) {
    const source = toRange([m[1], m[2]]);
    const il = getIntersection(range, [0, m[1]]);

    if (il) {
      ranges.push(il);
      range = [il[1], range[1]];
      if (getSize(range) === 0) break;
    }

    const ir = getIntersection(range, source);

    if (ir) {
      ranges.push(shift(ir, m[0] - m[1]));
      range = [ir[1], range[1]];
      if (getSize(range) === 0) break;
    }
  }

  if (getSize(range) > 0) ranges.push(range);

  return ranges;
};

const parseAlmanac = (input: string) => {
  const sections = input.trim().split("\n\n");
  const seeds = sections[0].split(": ")[1].split(" ").map(Number);
  const categories = sections.slice(1).map((s) =>
    s
      .split("\n")
      .slice(1)
      .map((l) => l.split(" ").map(Number))
      .sort((a, b) => Math.sign(a[1] - b[1])),
  );

  return { seeds, categories };
};

const getIntersection = (a: number[], b: number[]) => {
  const first = a[0] < b[0] ? a : b;
  const last = first === a ? b : a;

  if (first[1] <= last[0]) return null;

  return [last[0], Math.min(a[1], b[1])];
};

const shift = (r: number[], o: number) => r.map((n) => n + o);
const toRanges = (seeds: number[]) => chunk(seeds, 2).map(toRange);
const getSize = (r: number[]) => r[1] - r[0];
const toRange = (rl: number[]) => [rl[0], rl[0] + rl[1]];

main();
