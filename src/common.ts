import type { Criteria } from '.';

export class AndCriteria<T> implements Criteria<T> {
  private criteria: Criteria<T>;
  private otherCriteria: Criteria<T>;

  constructor(criteria: Criteria<T>, otherCriteria: Criteria<T>) {
    this.criteria = criteria;
    this.otherCriteria = otherCriteria;
  }

  meetCriteria(items: T[]): T[] {
    const firstCriteriaItems = this.criteria.meetCriteria(items);
    return this.otherCriteria.meetCriteria(firstCriteriaItems);
  }
}

export class OrCriteria<T> implements Criteria<T> {
  private criteria: Criteria<T>;
  private otherCriteria: Criteria<T>;

  constructor(criteria: Criteria<T>, otherCriteria: Criteria<T>) {
    this.criteria = criteria;
    this.otherCriteria = otherCriteria;
  }

  meetCriteria(items: T[]): T[] {
    const firstCriteriaItems = this.criteria.meetCriteria(items);
    const otherCriteriaItems = this.otherCriteria.meetCriteria(items);

    return [...new Set([...firstCriteriaItems, ...otherCriteriaItems])];
  }
}

export class NotCriteria<T> implements Criteria<T> {
  private criteria: Criteria<T>;

  constructor(criteria: Criteria<T>) {
    this.criteria = criteria;
  }

  meetCriteria(items: T[]): T[] {
    const criteriaItems = this.criteria.meetCriteria(items);
    return items.filter((item) => !criteriaItems.includes(item));
  }
}
