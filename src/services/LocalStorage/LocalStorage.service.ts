class LocalStorageService {
  private readonly storage: Storage

  public constructor() {
    this.storage = window.localStorage
  }

  public get<T>(key: string, defaultValue: T): T {
    const item = this.storage.getItem(key)

    return item ? (JSON.parse(item) as T) : defaultValue
  }

  public set(key: string, value: any): void {
    this.storage.setItem(key, JSON.stringify(value))
  }

  public remove(key: string): void {
    this.storage.removeItem(key)
  }
}

export default new LocalStorageService()
