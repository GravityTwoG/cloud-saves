export class LocalStorage {
  private readonly prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  setItem<T>(key: string, value: T) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
  }

  getItem<T>(key: string) {
    const value = localStorage.getItem(this.prefix + key);
    return JSON.parse(value || "{}") as T;
  }
}
