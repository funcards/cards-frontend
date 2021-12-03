const storage = window.localStorage

const get = <T>(key: string, defaultValue: T): T => {
  try {
    const item = storage.getItem(key)

    return item ? (JSON.parse(item) as T) : defaultValue
  } catch {
    return defaultValue
  }
}

const set = (key: string, value: any): void => {
  storage.setItem(key, JSON.stringify(value))
}

const remove = (key: string): void => {
  storage.removeItem(key)
}

export { get, set, remove }
