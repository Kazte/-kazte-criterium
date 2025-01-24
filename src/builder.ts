import type { Criteria } from './criteria';
import { OrderBy } from './utils';
import type { OrderDirection } from './type';

export class CriteriaBuilder<T> {
  private criteriaChain: Criteria<T>[] = [];
  private orderBy?: OrderBy<T>;

  addCriteria(criteria: Criteria<T>): this {
    this.criteriaChain.push(criteria);
    return this;
  }

  setOrderBy(property: keyof T, direction: OrderDirection = 'asc'): this {
    this.orderBy = new OrderBy<T>(property, direction);
    return this;
  }

  build(): Criteria<T> {
    return {
      meetCriteria: (items: T[]): T[] => {
        let result = this.criteriaChain.reduce(
          (res, criteria) => criteria.meetCriteria(res),
          items
        );
        if (this.orderBy) {
          result = this.orderBy.apply(result);
        }
        return result;
      }
    };
  }
}
