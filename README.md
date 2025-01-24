# Criterium

## Description

This library provides an implementation of the Criteria pattern in TypeScript. It allows for filtering, combining and ordering data collections using reusable and composable criteria.

## Features

- Define filtering logic with custom criteria.
- Combine multiple criteria with logical operators.
- Chain criteria with a builder utility.
- Sort collections using the `OrderBy` utility.

## Installation

```bash
npm install @kazte/criterium
# or
yarn add @kazte/criterium
# or
pnpm add @kazte/criterium
# or
bun install @kazte/criterium
```

## Usage

### 1. Define a data structure

Define a data structure that will be used to filter and sort.

```typescript
type User = {
  id: number;
  name: string;
  age: number;
};

const data: User[] = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
  { id: 3, name: 'Charlie', age: 35 },
];
```

### 2. Define criterias

Define custom criteria that will be used to filter the data.

```typescript
export class AgeCriteria implements Criteria<{ age: number }> {
  private minAge: number;
  private maxAge: number;

  constructor(minAge: number, maxAge: number) {
    this.minAge = minAge;
    this.maxAge = maxAge;
  }

  meetCriteria(items: { age: number }[]): { age: number }[] {
    return items.filter(item => item.age >= this.minAge && item.age <= this.maxAge);
  }
}

export class NameStartsWithCriteria implements Criteria<{ name: string }> {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  meetCriteria(items: { name: string }[]): { name: string }[] {
    return items.filter(item => item.name.startsWith(this.prefix));
  }
}

export class ContainsKeywordCriteria implements Criteria<{ description: string }> {
  private keyword: string;

  constructor(keyword: string) {
    this.keyword = keyword;
  }

  meetCriteria(items: { description: string }[]): { description: string }[] {
    return items.filter(item => item.description.includes(this.keyword));
  }
}
```

### 3. Use the criteria

Use the criteria to filter the data.

```typescript
const ageCriteria = new AgeCriteria(30, 40);
const nameCriteria = new NameStartsWithCriteria('A');
const keywordCriteria = new ContainsKeywordCriteria('programming');

console.log(ageCriteria.meetCriteria(data));
console.log(nameCriteria.meetCriteria(data));
console.log(keywordCriteria.meetCriteria(data));
```

## Combine criteria

The `AndCriteria`, `OrCriteria` and `NotCriteria` utilities can be used to combine criteria.

```typescript
const andCriteria = new AndCriteria<User>(ageCriteria, nameCriteria);
const orCriteria = new OrCriteria<User>(ageCriteria, nameCriteria);
const notCriteria = new NotCriteria<User>(ageCriteria);

console.log(andCriteria.meetCriteria(data));
console.log(orCriteria.meetCriteria(data));
console.log(notCriteria.meetCriteria(data));

const combinedCriteria = new AndCriteria<User>(ageCriteria, new OrCriteria<User>(nameCriteria, keywordCriteria));

console.log(combinedCriteria.meetCriteria(data));
```


```typescript

## OrderBy utility

The `OrderBy` utility can be used to sort collections.

```typescript
const sortedData = OrderBy.desc(data, 'age');

console.log(sortedData);
```

## Builder utility

The `CriteriaBuilder` utility can be used to chain criteria together.

```typescript
const builderCriteria = new CriteriaBuilder<User>()
  .addCriteria(ageCriteria)
  .addCriteria(keywordCriteria)
  .setOrderBy('age', 'desc')
  .build();

console.log(builderCriteria.meetCriteria(data));
```

## Dynamic criteria

The `DynamicCriteria` utility can be used to create criteria dynamically.

```typescript
const dynamicCriteria = Criteria.create<{age: number}>(user => user.age > 18);

console.log(dynamicCriteria.meetCriteria(data));
```