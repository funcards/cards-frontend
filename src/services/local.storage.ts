const storage = window.localStorage;

export class LocalStorage {
  public static get<T>(key: string, defaultValue: T): T {
    try {
      const item = storage.getItem(key);

      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public static set(key: string, value: any): void {
    storage.setItem(key, JSON.stringify(value));
  }

  public static remove(key: string): void {
    storage.removeItem(key);
  }
}
