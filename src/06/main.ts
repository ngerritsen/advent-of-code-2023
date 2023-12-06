import { mul } from "../utils";
import input from "./input.txt";

const main = () => {
  const [times, records] = parseRaces(input);

  console.log(times.map((t, i) => getWaysToWin(t, records[i])).reduce(mul, 1));
  console.log(getWaysToWin(Number(times.join("")), Number(records.join(""))));
};

const getWaysToWin = (time: number, record: number) => {
  for (let i = 1; i < time; i++) {
    const d = i * (time - i);
    if (d > record) return time - (i - 1) * 2 - 1;
  }
};

const parseRaces = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((l) => l.split(/\s+/).slice(1).map(Number));

main();
