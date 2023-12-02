import { sum, isNumber, last, chain } from "radash";
import input from "./input.txt";

const NUMS = [
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

const rx = new RegExp(NUMS.join("|"), "g");

const main = () => {
  const lines = input.trim().split("\n");

  console.log(sum(lines.map(chain(getNums, addNums))));
  console.log(sum(lines.map(replaceNumbers).map(chain(getNums, addNums))));
};

const replaceNumbers = (line: string) =>
  line
    .replace(rx, (m) => String(NUMS.indexOf(m) + 1) + m.slice(1))
    .replace(rx, (m) => String(NUMS.indexOf(m) + 1));

const getNums = (line: string) => line.split("").map(Number).filter(isNumber);
const addNums = (nums: number[]) => nums[0] * 10 + (last(nums) as number);

main();
