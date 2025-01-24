import type { OrderDirection } from './type';

export class OrderBy<T> {
  private property: keyof T;
  private direction: OrderDirection;

  constructor(property: keyof T, direction: OrderDirection = 'asc') {
    this.property = property;
    this.direction = direction;
  }

  apply(items: T[]): T[] {
    return items.sort((a, b) => {
      if (a[this.property] < b[this.property])
        return this.direction === 'asc' ? -1 : 1;
      if (a[this.property] > b[this.property])
        return this.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
