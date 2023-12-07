import input from "./input.txt";

const cards = ["A", "K", "Q", "J", "T"];

const main = () => {
  const hands = parseHands(input);

  const sorted = hands.sort((a, b) => {
    if (a.rank === b.rank) {
      for (let i = 0; i < a.values.length; i++) {
        if (a.values[i] !== b.values[i]) {
          return Math.sign(a.values[i] - b.values[i]);
        }
      }
    }
    return Math.sign(a.rank - b.rank);
  });

  const total = sorted.reduceRight(
    (total, hand, i) => total + hand.bid * (i + 1),
    0,
  );

  console.log(total);
};

const rankHand = (hand: number[]) => {
  const m: Record<string, number> = {};

  for (const v of hand) {
    m[v] = (m[v] || 0) + 1;
  }

  const vals = Object.values(m);

  if (vals.length === 1) return 6;
  if (vals.length === 2) return vals.includes(4) ? 5 : 4;
  if (vals.length === 3) return vals.includes(3) ? 3 : 2;
  return vals.length === 4 ? 1 : 0;
};

const parseHands = (input: string) =>
  input
    .trim()
    .split("\n")
    .map((h) => {
      const [hand, bid] = h.split(" ");
      const values = hand.split("").map(getValue);
      return { rank: rankHand(values), bid: Number(bid), values };
    });

const getValue = (char: string) => {
  const code = char.charCodeAt(0);
  if (code <= 57) return code - 50;
  return cards.length - cards.indexOf(char) + 7;
};

main();
