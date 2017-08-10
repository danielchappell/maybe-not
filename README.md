# MaybeNot
### Maybe you should use this instead of nullable types..

## Installation

```bash
yarn add maybe-not
```

## Everyday Use Example -- If this is crazytown skip to "In Practice aka Guides" section

```typescript
//grade-book.ts

import { Maybe } from 'maybe-not';

function averageCompletedGrades(grades: Maybe<number>[]): number {
    let { total, numCompleted } = grades.reduce( ({total, numCompleted} , mGrade) => { 
      return mGrade.map( grade => {total: total + grade, numCompleted: numCompleted + 1})
            .withDefault({total, numCompleted});
         }, {total: 0, numCompleted: 0});
    return numCompleted === 0 ? 100 : total / numCompleted;
}
let gradeBook = [null, 25, undefined, 50, 75, 85];

let currentAvg = averageCompletedGrades(gradeBook.map(Maybe.maybe)); // returns 58.75..if not plez PR
``` 

## In Theory -- Let me first adjust my ascot..

### First Concepts

##### Assertions
  1. Functions should always return the same type
  2. If you have say something is a given type, it should be.
  3. Uncertainty should be explicit for clean code and readability.
  

The Maybe type is a container that indicates the underlying (contained) type it represents may not be there.

When you have a maybe type you must unwrap that type safely with a default of the same type. Alternatively you can transform the maybe with functions that will now also return the maybe. This is similar to continuing your program with the undefined value and delegating the responsibility of dealing with missing value to the next function or later in the program.

### Declarative vs. Imperative (Pros and Cons) -- w/ wine pairing

```typescript
//types.d.ts
type Total = {total: number};
type TransformFn = (number) => number;
```gg
