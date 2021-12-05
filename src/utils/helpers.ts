export function toRecord<T extends Record<string, any>, K extends keyof T>(array: T[], selector: K): Record<T[K], T> {
  return array.reduce((acc, item) => ({ ...acc, [item[selector]]: item }), {} as Record<T[K], T>)
}

export function swap<T>(items: T[], from: number, to: number): T[] {
  const newItems = items.slice()
  newItems.splice(from, 1)
  newItems.splice(to, 0, items[from])

  return newItems
}
