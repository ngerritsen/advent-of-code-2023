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

  if (op === "-") {
    boxes[box] = boxes[box].filter((l) => l[0] !== label);
  } else if (op === "=") {
    let updated = false;

    for (const l of boxes[box]) {
      if (l[0] === label) {
        l[1] = Number(f);
        updated = true;
        break;
      }
    }

    if (!updated) boxes[box].push([label, Number(f)]);
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
