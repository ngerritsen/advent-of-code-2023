import { omit } from "lodash";
import input from "./input.txt";

const cards = ["A", "K", "Q", "J", "T"];

type Hand = { rank: number; values: number[]; bid: number };

const main = () => {
  console.log(getTotalScore(sortHands(parseHands(input))));
  console.log(getTotalScore(sortHands(parseHands(input, true))));
};

const getTotalScore = (hands: Hand[]) => {
  return hands.reduceRight((total, hand, i) => total + hand.bid * (i + 1), 0);
};

const sortHands = (hands: Hand[]) =>
  hands.sort((a, b) => {
    if (a.rank === b.rank) {
      for (let i = 0; i < a.values.length; i++) {
        if (a.values[i] !== b.values[i]) {
          return Math.sign(a.values[i] - b.values[i]);
        }
      }
    }
    return Math.sign(a.rank - b.rank);
  });

const rankHand = (hand: number[], joker: boolean) => {
  let m: Record<string, number> = {};

  for (const v of hand) {
    m[v] = (m[v] || 0) + 1;
  }

  const vals = joker && m[-1] ? withJoker(m) : Object.values(m);

  if (vals.length === 1) return 6;
  if (vals.length === 2) return vals.includes(4) ? 5 : 4;
  if (vals.length === 3) return vals.includes(3) ? 3 : 2;
  return vals.length === 4 ? 1 : 0;
};

const withJoker = (m: Record<string, number>) => {
  const vals = Object.values(omit(m, ["-1"])).sort();
  const max = vals.pop() || 0;
  vals.push(max + m[-1]);
  return vals;
};

const getValue = (char: string, joker: boolean) => {
  const code = char.charCodeAt(0);
  if (char === "J" && joker) return -1;
  if (code <= 57) return code - 50;
  return cards.length - cards.indexOf(char) + 7;
};

const parseHands = (input: string, joker = false) =>
  input
    .trim()
    .split("\n")
    .map((h) => {
      const [hand, bid] = h.split(" ");
      const values = hand.split("").map((h) => getValue(h, joker));
      return { rank: rankHand(values, joker), bid: Number(bid), values };
    });

main();
