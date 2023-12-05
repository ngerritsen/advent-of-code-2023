import input from "./input.txt";

const main = () => {
  const { seeds, categories } = parseAlmanac(input);

  console.log(getMinLocation(seeds, categories));
  console.log(getMinLocationFromRanges(seeds, categories));
};

const getMinLocationFromRanges = (
  seeds: number[],
  categories: number[][][],
) => {
  let min = Infinity;

  for (let i = 1; i < seeds.length; i += 2) {
    const start = seeds[i - 1];
    const length = seeds[i];

    for (let j = start; j < start + length; j++) {
      const loc = getLocation(categories, j);
      min = Math.min(min, loc);
    }
  }

  return min;
};

const getMinLocation = (seeds: number[], categories: number[][][]) =>
  Math.min(...seeds.map((s) => getLocation(categories, s)));

const getLocation = (categories: number[][][], seed: number) =>
  categories.reduce((num, mappings) => {
    const mapping = mappings.find((m) => inRange(num, m[1], m[2]));
    if (!mapping) return num;
    return mapping[0] + num - mapping[1];
  }, seed);

const parseAlmanac = (input: string) => {
  const sections = input.trim().split("\n\n");
  const seeds = sections[0].split(": ")[1].split(" ").map(Number);
  const categories = sections.slice(1).map((s) =>
    s
      .split("\n")
      .slice(1)
      .map((l) => l.split(" ").map(Number)),
  );

  return { seeds, categories };
};

const inRange = (num: number, start: number, length: number) =>
  num >= start && num < start + length;

main();
