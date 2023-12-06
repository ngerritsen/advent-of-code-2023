export const add = (a: number, b: number) => a + b;
export const mul = (a: number, b: number) => a * b;
export const isNumber = (v: any) => !isNaN(Number(v));
export const last = <T>(arr: T[]) => arr[arr.length - 1];
export const chunk = <T>(arr: T[], n: number) => {
  const chunks: T[][] = [];

  for (let i = 0; i < arr.length; i++) {
    const chunk = [];

    for (let j = 0; j < n; j++) {
      chunk.push(arr[i + j]);
    }

    chunks.push(chunk);
  }

  return chunks;
};
export const groupBy = <T, K extends string | number>(
  arr: T[],
  getKey: (item: T) => K,
) =>
  arr.reduce<Partial<Record<K, T[]>>>((groups, item) => {
    const key = getKey(item);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key]?.push(item);

    return groups;
  }, {});
