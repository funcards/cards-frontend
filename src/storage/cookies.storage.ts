import Cookies from 'js-cookie'

const storage = Cookies.withAttributes({ sameSite: 'Lax' })

const get = <T>(key: string, defaultValue: T): T => {
  try {
    const item = storage.get(key)

    return item ? (JSON.parse(item) as T) : defaultValue
  } catch {
    return defaultValue
  }
}

const set = (key: string, value: any): void => {
  storage.set(key, JSON.stringify(value))
}

const remove = (key: string): void => {
  storage.remove(key)
}

export { get, set, remove }
