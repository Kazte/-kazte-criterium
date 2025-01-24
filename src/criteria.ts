export interface Criteria<T> {
  meetCriteria(items: T[]): T[];
}
