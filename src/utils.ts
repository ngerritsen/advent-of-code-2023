export const isNumeric = (v: any) => !isNaN(Number(v));
export const lcm = (a: number, b: number) => (a * b) / gcd(a, b);
export const gcd = (a: number, b: number): number =>
  b === 0 ? a : gcd(b, a % b);
