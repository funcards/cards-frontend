export function toRecord<T extends Record<string, any>, K extends keyof T>(array: T[], selector: K): Record<T[K], T> {
  return array.reduce((acc, item) => ({ ...acc, [item[selector]]: item }), {} as Record<T[K], T>);
}

export function groupBy<T extends Record<string, any>, K extends keyof T>(array: T[], selector: K): Record<T[K], T[]> {
  return array.reduce((acc, item) => {
    (acc[item[selector]] = acc[item[selector]] || []).push(item);

    return acc;
  }, {} as Record<T[K], T[]>);
}

export function swap<T>(items: T[], source: number, destination: number): T[] {
  const newItems = [...items];
  const removed = newItems.splice(source, 1);
  newItems.splice(destination, 0, removed[0]);

  return newItems;
}

type Obj = {
  [key: string]: any;
};

export const noUndefined = (obj: Obj) => {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => newObj[key] === undefined && delete newObj[key]);

  return newObj;
};
