export function toRecord<T extends Record<string, any>, K extends keyof T>(array: T[], selector: K): Record<T[K], T> {
  return array.reduce((acc, item) => ({ ...acc, [item[selector]]: item }), {} as Record<T[K], T>)
}

export function prepareHeaders(headers: Headers, { getState }: { getState: () => unknown }): Headers {
  headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')

  return headers
}
