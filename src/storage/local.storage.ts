const storage = window.localStorage

const get = <T>(key: string, defaultValue: T): T => {
  const item = storage.getItem(key)

  return item ? (JSON.parse(item) as T) : defaultValue
}

const set = (key: string, value: any): void => {
  storage.setItem(key, JSON.stringify(value))
}

const remove = (key: string): void => {
  storage.removeItem(key)
}

export { get, set, remove }
