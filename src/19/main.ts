import { gt, keyBy, lt, multiply, sum } from "lodash";
import input from "./input.txt";

const categories = ["x", "m", "a", "s"] as const;
const MAX = 4000;

type Category = (typeof categories)[number];
type Part = Record<Category, number>;
type RangePart = Record<Category, [number, number]>;
type Workflow = { name: string; rules: Rule[] };
type Workflows = Record<string, Workflow>;
type FallbackRule = { target: string };
type NumRule = FallbackRule & { category: Category; op: string; n: number };
type Rule = FallbackRule | NumRule;

const main = () => {
  const { workflows, parts } = parseInput(input);
  const accepted = parts.filter((part) => runWorkflows(part, workflows));
  console.log(sum(accepted.map(valuePart)));
  console.log(getCombinations(workflows, getMaxRangePart()));
};

const getCombinations = (workflows: Workflows, part: RangePart, t = "in") => {
  if ("AR".includes(t)) return t === "A" ? getPartCombinations(part) : 0;

  let count = 0;

  for (const rule of workflows[t].rules) {
    if (!isNumRule(rule)) {
      count += getCombinations(workflows, part, rule.target);
      continue;
    }

    const [matchPart, remainingPart] = splitPart(part, rule);
    part = remainingPart;
    count += getCombinations(workflows, matchPart, rule.target);
  }

  return count;
};

const splitPart = (part: RangePart, { category, n, op }: NumRule) => {
  const [min, max] = part[category];
  const mr = op === ">" ? [n + 1, max] : [min, n - 1];
  const rr = op === ">" ? [min, n] : [n, max];

  return [
    { ...part, [category]: mr },
    { ...part, [category]: rr },
  ];
};

const runWorkflows = (part: Part, workflows: Workflows, t = "in"): boolean =>
  "AR".includes(t)
    ? t === "A"
    : runWorkflows(part, workflows, runWorkflow(workflows[t], part));

const valuePart = (part: Part) => sum(Object.values(part));

const runWorkflow = (workflow: Workflow, part: Part) => {
  for (const rule of workflow.rules) {
    if (!isNumRule(rule)) return rule.target;
    else if (applyRule(rule, part)) return rule.target;
  }
};

const applyRule = (rule: NumRule, part: Part) =>
  getRuleFn(rule.op)(part[rule.category], rule.n);

const getRuleFn = (op: string) => (op === ">" ? gt : lt);

const getPartCombinations = (part: RangePart) =>
  Object.values(part)
    .map(([min, max]) => max - min + 1)
    .reduce(multiply, 1);

const getMaxRangePart = (): RangePart =>
  categories.reduce((p, c) => ({ ...p, [c]: [1, MAX] }), {} as RangePart);

const isNumRule = (rule: Rule): rule is NumRule => "category" in rule;

const parseInput = (input: string) => {
  const [workflows, parts] = input.trim().split("\n\n");
  return { workflows: parseWorkflows(workflows), parts: parseParts(parts) };
};

const parseWorkflows = (input: string) =>
  keyBy(input.trim().split("\n").map(parseWorkflow), (w) => w.name);

const parseWorkflow = (line: string): Workflow => {
  const [, name, rules] = line.match(/(\w+)\{(.+)\}/) as RegExpMatchArray;
  return { name, rules: rules.split(",").map(parseRule) };
};

const parseRule = (str: string): Rule => {
  const [l, r] = str.split(":");
  if (!r) return { target: l };
  const [, category, op, n] = l.match(/(\w)(\>|\<)(\d+)/) as RegExpMatchArray;
  return { target: r, category: category as Category, op, n: Number(n) };
};

const parseParts = (input: string) => input.trim().split("\n").map(parsePart);
const parsePart = (line: string): Part => {
  const [, x, m, a, s] = (
    line.match(/x=(\d+),m=(\d+),a=(\d+),s=(\d+)/) as RegExpMatchArray
  ).map(Number);
  return { x, m, a, s };
};

main();
