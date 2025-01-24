# Criterium

This library provides an implementation of the Criteria pattern in TypeScript. It allows for filtering, combining and ordering data collections using reusable and composable criteria.

## Index

- [Criterium](#criterium)
  - [Index](#index)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
    - [1. Define a data structure](#1-define-a-data-structure)
    - [2. Define criterias](#2-define-criterias)
    - [3. Use the criteria](#3-use-the-criteria)
  - [Combine criteria](#combine-criteria)
  - [OrderBy utility](#orderby-utility)
  - [Builder utility](#builder-utility)
  - [Dynamic criteria](#dynamic-criteria)

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
  description: string;
};

const data: User[] = [
  { id: 1, name: 'Alice', age: 25, description: 'Alice loves programming' },
  { id: 2, name: 'Bob', age: 30, description: 'Bob is a software engineer' },
  { id: 3, name: 'Charlie', age: 35, description: 'Charlie is a programmer' },
  { id: 4, name: 'David', age: 40, description: 'David is a developer' },
  {
    id: 5,
    name: 'Arneis',
    age: 55,
    description: 'Arneis is a DevOps engineer'
  },
  { id: 6, name: 'Bacchus', age: 14, description: 'Bacchus is a student' },
  { id: 6, name: 'Alex', age: 35, description: 'Alex loves programming' }
];
```

### 2. Define criterias

Define custom criteria that will be used to filter the data.

```typescript
class AgeCriteria implements Criteria<User> {
  private minAge: number;
  private maxAge: number;

  constructor(minAge: number, maxAge: number) {
    this.minAge = minAge;
    this.maxAge = maxAge;
  }

  meetCriteria(items: User[]): User[] {
    return items.filter(
      (item) => item.age >= this.minAge && item.age <= this.maxAge
    );
  }
}

class NameStartsWithCriteria implements Criteria<User> {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  meetCriteria(items: User[]): User[] {
    return items.filter((item) => item.name.startsWith(this.prefix));
  }
}

class ContainsKeywordCriteria implements Criteria<User> {
  private keyword: string;

  constructor(keyword: string) {
    this.keyword = keyword;
  }

  meetCriteria(items: User[]): User[] {
    return items.filter((item) => item.description.includes(this.keyword));
  }
}
```

### 3. Use the criteria

Use the criteria to filter the data.

```typescript
const ageCriteria = new AgeCriteria(30, 40);
const nameCriteria = new NameStartsWithCriteria('A');
const keywordCriteria = new ContainsKeywordCriteria('programming');

console.log('ageCriteria', ageCriteria.meetCriteria(data));
console.log('nameCriteria', nameCriteria.meetCriteria(data));
console.log('keywordCriteria', keywordCriteria.meetCriteria(data));
```

<details>
<summary>Output</summary>

```typescript
// ageCriteria [
//   {
//     id: 2,
//     name: "Bob",
//     age: 30,
//     description: "Bob is a software engineer",
//   }, {
//     id: 3,
//     name: "Charlie",
//     age: 35,
//     description: "Charlie is a programmer",
//   }, {
//     id: 4,
//     name: "David",
//     age: 40,
//     description: "David is a developer",
//   }, {
//     id: 6,
//     name: "Alex",
//     age: 35,
//     description: "Alex loves programming",
//   }
// ]
//
// nameCriteria [
//   {
//     id: 1,
//     name: "Alice",
//     age: 25,
//     description: "Alice loves programming",
//   }, {
//     id: 5,
//     name: "Arneis",
//     age: 55,
//     description: "Arneis is a DevOps engineer",
//   }, {
//     id: 6,
//     name: "Alex",
//     age: 35,
//     description: "Alex loves programming",
//   }
// ]

// keywordCriteria [
//   {
//     id: 1,
//     name: "Alice",
//     age: 25,
//     description: "Alice loves programming",
//   }, {
//     id: 6,
//     name: "Alex",
//     age: 35,
//     description: "Alex loves programming",
//   }
// ]
```

</details>

## Combine criteria

The `AndCriteria`, `OrCriteria` and `NotCriteria` utilities can be used to combine criteria.

```typescript
const combinedAndCriteria = new AndCriteria<User>(ageCriteria, nameCriteria);

console.log('combinedAndCriteria', combinedAndCriteria.meetCriteria(data));

const combinedOrCriteria = new OrCriteria<User>(ageCriteria, nameCriteria);

console.log('combinedOrCriteria', combinedOrCriteria.meetCriteria(data));

const combinedAndOrCriteria = new AndCriteria<User>(
  ageCriteria,
  new OrCriteria<User>(nameCriteria, keywordCriteria)
);

console.log('combinedAndOrCriteria', combinedAndOrCriteria.meetCriteria(data));

const notCriteria = new NotCriteria<User>(nameCriteria);

console.log('notCriteria', notCriteria.meetCriteria(data));
```

<details>
<summary>Output</summary>

```typescript
// combinedAndCriteria [
//   {
//     id: 6,
//     name: "Alex",
//     age: 35,
//     description: "Alex loves programming",
//   }
// ]

// combinedOrCriteria [
//   {
//     id: 2,
//     name: "Bob",
//     age: 30,
//     description: "Bob is a software engineer",
//   }, {
//     id: 3,
//     name: "Charlie",
//     age: 35,
//     description: "Charlie is a programmer",
//   }, {
//     id: 4,
//     name: "David",
//     age: 40,
//     description: "David is a developer",
//   }, {
//     id: 6,
//     name: "Alex",
//     age: 35,
//     description: "Alex loves programming",
//   }, {
//     id: 1,
//     name: "Alice",
//     age: 25,
//     description: "Alice loves programming",
//   }, {
//     id: 5,
//     name: "Arneis",
//     age: 55,
//     description: "Arneis is a DevOps engineer",
//   }
// ]

// combinedAndOrCriteria [
//   {
//     id: 6,
//     name: "Alex",
//     age: 35,
//     description: "Alex loves programming",
//   }
// ]

// notCriteria [
//   {
//     id: 2,
//     name: "Bob",
//     age: 30,
//     description: "Bob is a software engineer",
//   }, {
//     id: 3,
//     name: "Charlie",
//     age: 35,
//     description: "Charlie is a programmer",
//   }, {
//     id: 4,
//     name: "David",
//     age: 40,
//     description: "David is a developer",
//   }, {
//     id: 6,
//     name: "Bacchus",
//     age: 14,
//     description: "Bacchus is a student",
//   }
// ]
```
</details>

## OrderBy utility

The `OrderBy` utility can be used to sort collections.

```typescript
const orderBy = new OrderBy<User>('age', 'asc');

console.log('orderBy', orderBy.apply(data));
```

<details>
<summary>Output</summary>

```typescript
// orderBy [
//   {
//     id: 6,
//     name: "Bacchus",
//     age: 14,
//     description: "Bacchus is a student",
//   }, {
//     id: 1,
//     name: "Alice",
//     age: 25,
//     description: "Alice loves programming",
//   }, {
//     id: 2,
//     name: "Bob",
//     age: 30,
//     description: "Bob is a software engineer",
//   }, {
//     id: 3,
//     name: "Charlie",
//     age: 35,
//     description: "Charlie is a programmer",
//   }, {
//     id: 6,
//     name: "Alex",
//     age: 35,
//     description: "Alex loves programming",
//   }, {
//     id: 4,
//     name: "David",
//     age: 40,
//     description: "David is a developer",
//   }, {
//     id: 5,
//     name: "Arneis",
//     age: 55,
//     description: "Arneis is a DevOps engineer",
//   }
// ]
```
</details>

## Builder utility

The `CriteriaBuilder` utility can be used to chain criteria together.

```typescript
const builder = new CriteriaBuilder<User>()
  .addCriteria(ageCriteria)
  .addCriteria(nameCriteria)
  .setOrderBy('age', 'desc')
  .build();

console.log('builder', builder.meetCriteria(data));
```

<details>
<summary>Output</summary>

```typescript
// builder [
//   {
//     id: 6,
//     name: "Alex",
//     age: 35,
//     description: "Alex loves programming",
//   }
// ]
```
</details>

## Dynamic criteria

The `DynamicCriteria` utility can be used to create criteria dynamically.

```typescript
const dynamicCriteria = Criteria.create<User>((user) => user.age > 18);

console.log('dynamicCriteria', dynamicCriteria.meetCriteria(data));
```

<details>
<summary>Output</summary>

```typescript
// dynamicCriteria [
//   {
//     id: 1,
//     name: "Alice",
//     age: 25,
//     description: "Alice loves programming",
//   }, {
//     id: 2,
//     name: "Bob",
//     age: 30,
//     description: "Bob is a software engineer",
//   }, {
//     id: 3,
//     name: "Charlie",
//     age: 35,
//     description: "Charlie is a programmer",
//   }, {
//     id: 4,
//     name: "David",
//     age: 40,
//     description: "David is a developer",
//   }, {
//     id: 5,
//     name: "Arneis",
//     age: 55,
//     description: "Arneis is a DevOps engineer",
//   }, {
//     id: 6,
//     name: "Alex",
//     age: 35,
//     description: "Alex loves programming",
//   }
// ]
```
</details>