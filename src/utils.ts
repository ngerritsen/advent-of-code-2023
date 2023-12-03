export const add = (a: number, b: number) => a + b;
export const isNumber = (v: any) => !isNaN(Number(v));
export const last = <T>(arr: Array<T>) => arr[arr.length - 1];
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
