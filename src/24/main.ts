import { intersection } from "lodash";
import input from "./input.txt";

const main = () => {
  const hail = parseHail(input);

  console.log(intersectionCount(hail, 200000000000000, 400000000000000));
  console.log(getRockStart(hail));
};

const getRockStart = (hail: number[][]) => {
  const rv = [0, 1, 2].map((o) => getVelocity(hail, o));
  const [rvx, rvy, rvz] = rv as number[];
  const [asx, asy, asz, avx, avy, avz] = hail[0];
  const [bsx, bsy, , bvx, bvy] = hail[1];
  const savx = avx - rvx;
  const savy = avy - rvy;
  const sbvx = bvx - rvx;
  const sbvy = bvy - rvy;
  const spa = [asx, asy, 0, savx, savy];
  const spb = [bsx, bsy, 0, sbvx, sbvy];
  const [rsx, rsy] = getIntersection(spa, spb) || [];
  const at = (rsx - asx) / savx;
  const acz = asz + at * avz;
  const rsz = acz - rvz * at;

  return rsx + rsy + rsz;
};

const getVelocity = (hail: number[][], o: number) => {
  const vs: Record<string, number[]> = {};

  for (const h of hail) {
    const v = h[o + 3];
    vs[v] = vs[v] || [];
    vs[v].push(h[o]);
  }

  const all = [];

  for (let [hv, ps] of Object.entries(vs)) {
    if (Math.abs(Number(hv)) < 100) continue;

    for (let i = 1; i < ps.length; i++) {
      const res = [];
      const d = Math.abs(ps[i - 1] - ps[i]);

      for (let rv = -1000; rv <= 1000; rv++) {
        if (d % (rv - Number(hv)) === 0) res.push(rv);
      }
      all.push(res);
    }
  }

  let valid = all[0];

  for (let i = 1; i < all.length; i++) {
    valid = intersection(valid, all[i]);
  }

  if (valid.length !== 1) throw "No valid length found";

  return valid[0];
};

const intersectionCount = (hail: number[][], min: number, max: number) => {
  let count = 0;

  for (let i = 0; i < hail.length - 1; i++) {
    for (let j = i; j < hail.length; j++) {
      const a = hail[i];
      const b = hail[j];
      const p = getIntersection(hail[i], hail[j]);
      if (p && bounded(p, min, max) && inFuture(a, p) && inFuture(b, p))
        count++;
    }
  }

  return count;
};

const inFuture = (l: number[], p: number[]) =>
  (l[3] > 0 ? p[0] >= l[0] : p[0] <= l[0]) &&
  (l[4] > 0 ? p[1] >= l[1] : p[1] <= l[1]);

const bounded = (p: number[], min: number, max: number) =>
  p[0] >= min && p[0] <= max && p[1] >= min && p[1] <= max;

const getIntersection = (a: number[], b: number[]) => {
  const [asx, asy, , avx, avy] = a;
  const [bsx, bsy, , bvx, bvy] = b;
  const aex = asx + avx;
  const aey = asy + avy;
  const bex = bsx + bvx;
  const bey = bsy + bvy;
  const d = (bey - bsy) * (aex - asx) - (bex - bsx) * (aey - asy);

  if (d == 0) return undefined;

  let dy = asy - bsy;
  let dx = asx - bsx;

  const na = (aex - asx) * dy - (aey - asy) * dx;
  const nb = (bex - bsx) * dy - (bey - bsy) * dx;

  dy = nb / d;
  dx = na / d;

  const x = asx + dy * (aex - asx);
  const y = asy + dy * (aey - asy);

  return [x, y];
};

const parseHail = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((l) => l.split(/(?:, )|(?: @ )/g).map(Number));

main();
