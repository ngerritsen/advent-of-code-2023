import { clone, groupBy, sum } from "lodash";
import input from "./input.txt";

type Coord = [number, number, number];
type SuppMap = Record<string, string[]>;
type Brick = [Coord, Coord];

const main = () => {
  const falling = parseBricks(input);
  const settled = dropBricks(falling);
  const { supporting, supportedBy } = getSupports(settled);
  const chains = getChains(supporting, supportedBy);

  console.log(settled.length - chains.length);
  console.log(sum(chains));
};

const getChains = (supporting: SuppMap, supportedBy: SuppMap) =>
  Object.keys(supporting)
    .map((s) => getChain(supporting, supportedBy, s))
    .filter((x) => x > 0);

const getChain = (supporting: SuppMap, supportedBy: SuppMap, start: string) => {
  const queue = [start];
  const fucked = new Set<string>([start]);

  while (queue.length) {
    const curr = queue.shift() as string;
    const s = supportedBy[curr];

    if (curr !== start && s.filter((k) => !fucked.has(k)).length > 0) continue;

    fucked.add(curr);

    for (const s of supporting[curr]) queue.push(s);
  }

  return fucked.size - 1;
};

const getSupports = (settled: Brick[]) => {
  const byZ = groupBy(settled, (b) => b[0][2]);
  const supporting: SuppMap = {};
  const supportedBy: SuppMap = {};

  for (const b of settled) {
    const z = b[1][2] + 1;
    const supp = (byZ[z] || []).filter((s) => overlaps(s, b)).map(toString);
    const k = toString(b);

    for (const s of supp) {
      if (!supportedBy[s]) supportedBy[s] = [];
      supportedBy[s].push(k);
    }

    supporting[k] = supp;
  }

  return { supporting, supportedBy };
};

const dropBricks = (falling: Brick[]) => {
  const settled: Brick[] = [];

  falling.sort((a, b) => Math.sign(a[0][2] - b[0][2]));

  for (const b of falling) {
    const blocking = settled.filter((s) => overlaps(s, b));
    const z = Math.max(...blocking.map((s) => s[1][2]), 0) + 1;
    const zd = b[1][2] - b[0][2];

    b[0][2] = z;
    b[1][2] = z + zd;

    settled.push(b);
  }

  return settled;
};

const overlaps = ([as, ae]: Brick, [bs, be]: Brick) =>
  Math.max(as[0], bs[0]) <= Math.min(ae[0], be[0]) &&
  Math.max(as[1], bs[1]) <= Math.min(ae[1], be[1]);

const parseBricks = (input: string) => input.trim().split("\n").map(parseBrick);

const parseBrick = (line: string) =>
  line.split("~").map((p) => p.split(",").map(Number) as Coord) as Brick;

const toString = (b: Brick) => b.map((p) => p.join(",")).join("~");

main();
