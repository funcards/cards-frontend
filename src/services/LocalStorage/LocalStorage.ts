const storage = window.localStorage

export const LocalStorage = Object.freeze({
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = storage.getItem(key)

      return item ? (JSON.parse(item) as T) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set: (key: string, value: any): void => {
    storage.setItem(key, JSON.stringify(value))
  },
  remove: (key: string): void => {
    storage.removeItem(key)
  },
})
