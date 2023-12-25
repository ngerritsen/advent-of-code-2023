import { cloneDeep, sum } from "lodash";
import input from "./input.txt";

type Nodes = Record<string, Record<string, number>>;

const main = () => {
  const nodes = parseNodes(input);

  console.log(getGroupMultiple(nodes, 3));
};

const getGroupMultiple = (nodes: Nodes, min: number) => {
  while (true) {
    const cloned = cloneDeep(nodes);
    const counts = randomContract(cloned);
    const cut = getEdgeCount(cloned, Object.keys(cloned)[0]);

    if (cut === min) {
      const [a, b] = Object.values(counts);
      return a * b;
    }
  }
};

const randomContract = (nodes: Nodes) => {
  const counts: Record<string, number> = {};

  for (const node of Object.keys(nodes)) {
    counts[node] = 1;
  }

  while (Object.keys(nodes).length > 2) {
    const a = randKey(nodes);
    const b = randKey(nodes[a]);

    copyEdges(nodes, a, b);
    removeNode(nodes, b);

    counts[a] += counts[b];
    delete counts[b];
  }

  return counts;
};

const addEdge = (nodes: Nodes, a: string, b: string) => {
  addEdgeDir(nodes, a, b);
  addEdgeDir(nodes, b, a);
};

const addEdgeDir = (nodes: Nodes, a: string, b: string) => {
  nodes[a] = nodes[a] || {};
  nodes[a][b] = (nodes[a][b] || 0) + 1;
};

const copyEdge = (nodes: Nodes, a: string, b: string, nb: string) => {
  nodes[a][nb] = (nodes[a][nb] || 0) + nodes[nb][b];
  nodes[nb][a] = (nodes[nb][a] || 0) + nodes[nb][b];
};

const copyEdges = (nodes: Nodes, a: string, b: string) => {
  for (const nb of Object.keys(nodes[b])) {
    if (nb === a) continue;
    copyEdge(nodes, a, b, nb);
  }
};

const removeNode = (nodes: Nodes, node: string) => {
  for (const n of Object.keys(nodes[node])) {
    delete nodes[n][node];
  }

  delete nodes[node];
};

const getEdgeCount = (nodes: Nodes, node: string) =>
  sum(Object.values(nodes[node]));

const randIdx = (max: number) => Math.floor(Math.random() * max);

const randKey = <T extends Object>(obj: T) => {
  const keys = Object.keys(obj);
  return keys[randIdx(keys.length)];
};

const parseNodes = (input: string) => {
  const nodes: Nodes = {};

  for (const line of input.trim().split("\n")) {
    const [node, ...neighbours] = line.split(/:? /) as string[];
    for (const n of neighbours) {
      addEdge(nodes, node, n);
    }
  }

  return nodes;
};

main();
