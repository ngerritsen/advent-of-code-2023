import { add, last } from "lodash";
import { isNumeric } from "../utils";
import input from "./input.txt";

const nums = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const rx = new RegExp(nums.join("|"), "g");

const main = () => {
  const lines = input.trim().split("\n");

  console.log(lines.map(getValue).reduce(add));
  console.log(lines.map(replaceNumbers).map(getValue).reduce(add));
};

const replaceNumbers = (line: string) =>
  line
    .replace(rx, (m) => String(nums.indexOf(m) + 1) + m.slice(1))
    .replace(rx, (m) => String(nums.indexOf(m) + 1));

const getValue = (line: string) => addNums(getNums(line));
const getNums = (line: string) => line.split("").map(Number).filter(isNumeric);
const addNums = (nums: number[]) => nums[0] * 10 + Number(last(nums));

main();
