export class Helper {
  static generateRandomString(length?: number): string {
    length = length || 15;
    const a = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`;
    let str = "";

    for (let i = 0; i < length; i++) {
      str += a[Math.floor(Math.random() * a.length)];
    }
    return str;
  }
}
