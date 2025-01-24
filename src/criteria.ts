export abstract class Criteria<T> {
  abstract meetCriteria(items: T[]): T[];

  static create<T>(predicate: (item: T) => boolean): Criteria<T> {
    return {
      meetCriteria: (items: T[]) => items.filter(predicate)
    };
  }
}
