import JsCookie from 'js-cookie';

const storage = JsCookie.withAttributes({ sameSite: 'Lax' });

export class CookiesStorage {
  public static get<T>(key: string, defaultValue: T): T {
    try {
      const item = storage.get(key);

      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public static set(key: string, value: any): void {
    storage.set(key, JSON.stringify(value));
  }

  public static remove(key: string): void {
    storage.remove(key);
  }
}
