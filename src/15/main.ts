import { sum } from "lodash";
import input from "./input.txt";

type Lens = [string, number];
type Box = Lens[];

const main = () => {
  const steps = input.trim().split(",");
  const boxes = steps.reduce((b, s) => hashmap(b, s), makeBoxes(256));

  console.log(sum(steps.map(hash)));
  console.log(sum(boxes.map(getLensPower)));
};

const makeBoxes = (n: number): Box[] => Array.from(Array(n)).map(() => []);

const hashmap = (boxes: Box[], step: string) => {
  const [, label, op, f] = step.match(/(\w+)(=|-)(\d*)/) || [];
  const box = hash(label);
  const i = boxes[box].findIndex((l) => l[0] === label);

  if (op === "-" && i > -1) {
    boxes[box].splice(i, 1);
  } else if (op === "=") {
    if (i > -1) {
      boxes[box][i][1] = Number(f);
    } else {
      boxes[box].push([label, Number(f)]);
    }
  }

  return boxes;
};

const getLensPower = (box: Box, i: number) =>
  box.reduce((t, l, j) => t + (i + 1) * (j + 1) * l[1], 0);

const hash = (str: string) => {
  let c = 0;

  for (let i = 0; i < str.length; i++) {
    c += str.charCodeAt(i);
    c *= 17;
    c %= 256;
  }

  return c;
};

main();
