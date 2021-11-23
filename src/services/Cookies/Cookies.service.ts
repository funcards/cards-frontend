import Cookies  from 'js-cookie'

class CookiesService {
  private readonly api

  public constructor() {
    this.api = Cookies.withAttributes({ sameSite: 'Lax' })
  }

  public get<T>(key: string, defaultValue: T): T {
    const item = this.api.get(key)

    return item ? (JSON.parse(item) as T) : defaultValue
  }

  public set(key: string, value: any): void {
    this.api.set(key, JSON.stringify(value))
  }

  public remove(key: string): void {
    this.api.remove(key)
  }
}

export const cookiesService =  new CookiesService()
