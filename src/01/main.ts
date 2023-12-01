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

function main() {
  const lines = input.trim().split("\n");

  console.log(lines.map(getNums).map(joinNums).reduce(sum, 0));
  console.log(
    lines.map(replaceNumbers).map(getNums).map(joinNums).reduce(sum, 0),
  );
}

function replaceNumbers(line: string) {
  const chars = line.split("");

  NUMS.forEach((word, index) => {
    let position = line.indexOf(word);

    while (position > -1) {
      chars[position] = String(index + 1);
      position = line.indexOf(word, position + 1);
    }
  });

  return chars.join("");
}

const sum = (a: number, b: number) => a + b;
const getNums = (line: string) => line.split("").filter(isNumber);
const joinNums = (nums: string[]) => Number(nums[0] + nums[nums.length - 1]);
const isNumber = (char: string) => !isNaN(Number(char));

main();
