import { keyBy, forEach, size, filter, every, reduce } from "lodash";
import input from "./input.txt";
import { lcm } from "../utils";

type Module = {
  type: string;
  name: string;
  targets: string[];
  state: Record<string, number>;
};

const main = () => {
  const modules = parseModules(input);

  console.log(count(modules, 1e3));
  console.log(runUntil(modules, "rx"));
};

const runUntil = (modules: Record<string, Module>, exitAt: string) => {
  const [preExit] = getInputs(modules, exitAt);
  const inputs = getInputs(modules, preExit);
  const cycles: Record<string, number> = {};

  init(modules);

  for (let i = 0; size(cycles) < inputs.length; i++) {
    const { tracked } = run(modules, preExit);

    if (tracked.length) {
      tracked.forEach((t) => {
        cycles[t] = cycles[t] ? cycles[t] : i + 1;
      });
    }
  }

  return reduce(cycles, lcm, 1);
};

const count = (modules: Record<string, Module>, n: number) => {
  let [tlow, thi] = [0, 0];

  init(modules);

  for (let i = 0; i < n; i++) {
    const { pulses } = run(modules);
    const [lo, hi] = pulses;
    tlow += lo;
    thi += hi;
  }

  return tlow * thi;
};

const run = (modules: Record<string, Module>, track?: string) => {
  type Signal = [string, string, 0 | 1];
  const stack: Signal[] = [["button", "broadcaster", 0]];
  const pulses = [0, 0];
  const tracked: string[] = [];

  while (stack.length) {
    let [from, to, p] = stack.shift() as Signal;

    pulses[p] += 1;

    if (!modules[to]) continue;

    const m = modules[to];

    if (m.type === "%") {
      if (p === 1) continue;
      p = m.state.on = m.state.on ? 0 : 1;
    }

    if (m.type === "&") {
      m.state[from] = p;
      p = every(m.state, Boolean) ? 0 : 1;

      if (m.name === track) {
        Object.entries(m.state).forEach(([k, v]) => {
          if (v === 1) tracked.push(k);
        });
      }
    }

    m.targets.forEach((t) => stack.push([to, t, p]));
  }

  return { pulses, tracked };
};

const init = (modules: Record<string, Module>) => {
  forEach(modules, (m) => {
    if (m.type === "%") m.state["on"] = 0;
    if (m.type === "&") {
      getInputs(modules, m.name).forEach((name) => (m.state[name] = 0));
    }
  });
};

const getInputs = (modules: Record<string, Module>, name: string) => {
  return filter(modules, (o) => o.targets.includes(name)).map((m) => m.name);
};

const parseModules = (input: string) =>
  keyBy(input.trim().split("\n").map(parseModule), (m) => m.name);

const parseModule = (line: string) => {
  const [m, t] = line.split(" -> ");
  const targets = t.split(", ");
  const [, type, name] = m.match(/(%|&*)(\w+)/) as RegExpMatchArray;
  return { type, name, targets, state: {} };
};

main();
