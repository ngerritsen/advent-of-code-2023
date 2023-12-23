import input from "./input.txt";

const dirs = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

type Nodes = Record<string, [string, number][]>;

const main = () => {
  const grid = input.trim().split("\n");
  console.log(longestTrail(getNodes(grid, true)));
  console.log(longestTrail(getNodes(grid, false)));
};

const longestTrail = (nodes: Nodes) => {
  type Item = [string, number, string];
  const visited = "1,0";
  const queue = [["1,0", 0, visited]];
  let longest = 0;

  while (queue.length) {
    const [n, s, v] = queue.shift() as Item;

    if (nodes[n].length === 0) {
      longest = s > longest ? s : longest;
    }

    for (const [nn, ns] of nodes[n]) {
      if (v.includes(nn)) continue;
      const nv = v + "|" + nn;
      queue.push([nn, s + ns, nv]);
    }
  }

  return longest;
};

const getNodes = (grid: string[], slippery: boolean) => {
  type Item = [number, number, number, string, string];
  const visited = new Set(["1,0"]);
  const nodes: Record<string, [string, number][]> = { "1,0": [] };
  const queue = [[1, 0, -1, "1,0", "1,0"]];
  const w = grid[0].length;
  const h = grid.length;

  while (queue.length) {
    const [x, y, s, p, f] = queue.pop() as Item;
    const k = x + "," + y;

    const next = [];
    let slopes = 0;

    for (const [dx, dy] of dirs) {
      const nx = dx + x;
      const ny = dy + y;
      const nt = (grid[ny] || "")[nx];
      const nk = nx + "," + ny;
      const dk = dx + "," + dy;

      slopes += ">v".includes(nt) ? 1 : 0;

      if (
        !nt ||
        nt === "#" ||
        (slippery && ((nt === "v" && dy !== 1) || (nt === ">" && dx !== 1))) ||
        f === nk ||
        (visited.has(nk + "," + dk) && !nodes[nk])
      )
        continue;

      visited.add(nk + "," + dk);
      next.push([nx, ny]);
    }

    let ns = s + 1;
    let np = p;

    if (slopes > 1 || (x === w - 2 && y === h - 1)) {
      ns = 0;
      np = k;

      nodes[p].push([k, s + 1]);
      nodes[np] = nodes[np] || [];
    } else {
    }

    for (const [nx, ny] of next) {
      queue.push([nx, ny, ns, np, k]);
    }
  }

  return nodes;
};

main();
