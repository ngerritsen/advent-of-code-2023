import { add } from "lodash";
import input from "./input.txt";

type Cache = Record<string, number>;

const main = () => {
  const cards = input.trim().split("\n").map(parseCard);
  const matches = cards.map(getMatches);

  console.log(matches.map(getScore).reduce(add));
  console.log(matches.map((_, i) => getCardCount(matches, i)).reduce(add));
};

const getScore = (matches: number) => Math.floor(2 ** (matches - 1));

const getMatches = (card: number[][]) =>
  card[0].filter((n) => card[1].includes(n)).length;

const getCardCount = (matches: number[], id = 0, cache: Cache = {}) => {
  let count = 1;

  if (cache[id]) return cache[id];

  for (let i = 0; i < matches[id]; i++) {
    count += getCardCount(matches, id + i + 1, cache);
  }

  cache[id] = count;

  return count;
};

const parseCard = (line: string) =>
  line
    .split(":")[1]
    .split("|")
    .map((r) => r.trim().split(" ").map(Number).filter(Boolean));

main();
