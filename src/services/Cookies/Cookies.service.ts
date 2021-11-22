import Cookie from 'js-cookie'

Cookie.defaults = {
  sameSite: 'Lax',
}

class CookiesService {
  public get<T>(key: string, defaultValue: T): T {
    const item = Cookie.get(key)

    return item ? (JSON.parse(item) as T) : defaultValue
  }

  public set(key: string, value: any): void {
    Cookie.set(key, JSON.stringify(value))
  }

  public remove(key: string): void {
    Cookie.remove(key)
  }
}

export default new CookiesService()
