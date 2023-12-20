import input from "./input.txt";
import { lcm } from "../utils";

type Nodes = Record<string, [string, string]>;

const main = () => {
  const { nodes, turns } = parseMap(input);

  console.log(getStepsToEnd(nodes, turns, "AAA"));
  console.log(
    getStartNodes(nodes)
      .map((s) => getStepsToEnd(nodes, turns, s))
      .reduce(lcm, 1),
  );
};

const getStepsToEnd = (nodes: Nodes, turns: string, start: string) => {
  let curr = start;
  let steps = 0;

  while (true) {
    for (const turn of turns) {
      curr = nodes[curr][turn === "L" ? 0 : 1];
      steps++;
      if (curr[2] === "Z") return steps;
    }
  }
};

const getStartNodes = (nodes: Nodes) =>
  Object.keys(nodes).filter((n) => n[2] === "A");

const parseMap = (input: string) => {
  const [turns, nodes] = input.trim().split("\n\n");
  return { nodes: parseNodes(nodes), turns };
};

const parseNodes = (raw: string) =>
  raw.split("\n").reduce<Nodes>((nodes, line) => {
    const [n, l, r] = line.match(/\w+/g) as RegExpMatchArray;
    nodes[n] = [l, r];
    return nodes;
  }, {});

main();
