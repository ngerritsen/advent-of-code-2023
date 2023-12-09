import { last, sum } from "lodash";
import input from "./input.txt";

const main = () => {
  const history = parseSequences(input);

  console.log(sum(history.map(getPrediction)));
  console.log(sum(history.map((s) => getPrediction(s.reverse()))));
};

const getPrediction = (sequence: number[]) =>
  getDiffs([sequence]).reduce((x, s) => Number(last(s)) + x, 0);

const getDiffs = (diffs: number[][]): number[][] =>
  diffs[0].every((x) => x === 0)
    ? diffs
    : getDiffs([getDiff(diffs[0]), ...diffs]);

const getDiff = (sequence: number[]) =>
  sequence.reduce<number[]>(
    (diff, x, i) => (i === 0 ? diff : [...diff, x - sequence[i - 1]]),
    [],
  );

const parseSequences = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((l) => l.split(" ").map(Number));

main();
