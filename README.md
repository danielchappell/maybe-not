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
  2. If you said something is a given type, it should be.
  3. Uncertainty should be explicit for clean code and readability.
  

The Maybe type is a container that indicates the underlying (contained) type it represents may not be there.

When you have a maybe type you must unwrap that type safely with a default of the same type. Alternatively you can transform the maybe with functions that will now also return the maybe. This is similar to continuing your program with the undefined value and delegating the responsibility of dealing with missing value to the next function or later in the program.

### Declarative vs. Imperative (Pros and Cons) -- w/ wine pairing

```typescript
//types.d.ts
type Total = {total: number};
type TransformFn = (number) => number;
```
    
#### Example relying on what I am refering to as imperative techniques -- AKA The Accused
***Specifically line 4 and also all required fallback type annotations***
```typescript
// assuming --strict mode or at least nullable types are off..

function getNewTotal(total: Total | null | undefined, fn: TransformFn | null | undefined): Total | void {
    if (total && typeof fn === 'function') return;
    
    return {total: fn(total.total)};
}

//of course more could go wrong with this assuming you ignore typescript type errors, But we aren't those people.
```

#### Declarative Example using Maybe type -- AKA The reason you are here (says rando with github account)..

***Maybe..this has less moving parts?***

  ```typescript
  function getNewTotal(mTotal: Maybe<Total>, mFn: Maybe<TransformFn>): Maybe<Total> {
     return Maybe.sequence([mTotal, mFn])
                 .map([total, fn] => {total: fn(total.total});
  }
  ```

***BOTH of these have the same chainability..sort of..***

```typescript
   let startingTotal = {total: 0}
   let addFive = num => num + 5;
   
   let hopefullyFinalTotal: Total | void = getNewTotal(
                        getNewTotal(
                            getNewTotal(startingTotal, addFive),                         addFive),
                    addFive);
                     
            //returns {total: 15} THIS TIME
            // could just as easily return void
            // don't forget to check for that!
            
    let finalTotal: Total = hopefullyFinalTotal || {total: 0};
```

*or **Maybe** they dont?*

```typescript
    let mfinalTotal: Maybe<Total> = getNewTotal.map(addFive)
                                              .map(addFive)
                                              .map(addFive);
                                              
        // returns the value Maybe.just({total: 15}) THIS TIME
        // BUT ALWAYS the same type Maybe<Total>
        // the same result but wrapped in a Maybe
        //providing consistency of interface
        //absense of value is explicit in return type.
        
    let finalTotal: Total = Maybe.withDefault({total: 0});
        
        //This could have been in one chain
        //but seperated in variables for parody of other                //implementation which benefited more
        //from the separation with gained clarity
        
```

#### Brief Mention of Scientific Control
To prevent bias in this guide I am sandboxing all feelings to be expressed in code comments. I assure you it is effective.

```typescript
  // He should mention I am only adding a line of hyperbole
  //for every extra moving part the imperative version requires..
```

#### Definitions -- Verified by Books!

 ##### Courtesy of Dictionary.com
 > **de·clar·a·tive**:
  
 > 1- Taking the form of a simple statement.
 
 > 2- Denoting high-level programming languages that can be used to solve problems without requiring the programmer to specify an exact procedure to be followed.
 
 vs.
   
> **im·per·a·tive**

>  1-something that demands attention or action; an unavoidable obligation or requirement; necessity.
   
>  2- An obligatory statement, principle, or the like.
   
   
 #### This guy's definition -- Programming specific
 
   *Source*: [Me on Twitters](http://twitter.com/josephdchappell)
 
 > **imperative code**
 
 > 1-Code that is implementation specific.
 
 > 2- Contains logic required to appease implmentation, language, or runtime.
 
 > 3- Code describes in detail what runtime/program should do.
 
 vs.
 
 > **declarative code**
 
 > 1- Code that describes each step to reflect end result for consumer.
 
 > 2- Simple human intutive commands that compose to tell a complete story.
 
 > 3- Code that reads as a description of the program instead of the required implementation. 
 
 
 ### Touch of Type Theory -- AKA drunk on wine; ascot covers face..
 #### Patterns Emerge; Allow Common Interface
   In 1958 The pattern of "Monad" was discovered in the category theory branch of mathematics. Luckly there thousands of crazy essays explaining what Monads are, because I would fall short in endless digression. I will link some of the best articles below, However what is important to know is that Many things implement the monad pattern, and can therefore use the same interface, with all the same guarentees, but for very different purposes. Libaries that rely on these interfaces as "types" vs specific implemenations can build for libraries (like this one) they do not even know exist. There is a specfication for functional data structures in javascript, This library complies with it and therefore can be used seamlessly with functional libraries such as Ramda or any other utility library that builds to the generic monad interface.
   
   **Other common monads are also pretty cool:**
        1. List
        2. Rx.Observable
        3. Data.Task or Futures
        4. Almost promises, but not quite..sadly

        
**Monad Articles:**
   
[You could have invented Monads](http://blog.sigfpe.com/2006/08/you-could-have-invented-monads-and.html)

[Burritos for the hungry mathmetician](http://emorehouse.web.wesleyan.edu/silliness/burrito_monads.pdf)
      

## In Practice -- aka Guides

### How to create a Maybe Type

 #### There are two states of Maybe
   1. Just  --- Represents the Presence of the contained type.
       ```typescript
       let maybeNum: Maybe<number> = Maybe.just(5);
       ```
   2. Nothing --- Represents the Absensce of the contained type.
      ```typescript
      let maybeNum: Maybe<number> = Maybe.nothing<number>();
      ```
    
   Notice that both the "full" and the "empty" version above have the same type and therefore the same interface to operate on. That is the key to the power of the Maybe. This also satisfies Assertion #1.
   
 #### Maybe.maybe Helper
With perhaps the biggest advantage to this type being the ability to not check if things are null or undefined, it seems only proper to add a non-standard (in the fantasy land sense) helper that will do that checking, returning the correctly intialized Maybe state for you making code even more declarative. 
  
**This only cares about undefined and null it will wrap other "falsey" types such as \[\], '', and 0.**
     
     
```typescript

  interface GroceryBag {
    apple: Maybe<Apple>;
    pear: Maybe<Pear>;
    grapes: Maybe<GrapeBunch>;
    cheetos: Maybe<Cheetos>;
  }
     
 let groceryBagByList = { apple: new Apple(), pear: null, grapes: new GrapeBunch(), cheetos: undefined };
 
 let typeSafeGroceryBag: GroceryBag = Object.keys(groceryBagByList).reduce( (bag, item) => {
     return Object.assign({}, bag, {item: Maybe.maybe(item)});
  });
   
```

### How to unwrap a Maybe

 A Maybe can only be removed revealing the underlying value if a default value of the *SAME* type has been provided as a fallback. This method withDefault is the only mechanism for removing a maybe wrapper and it is completely typesafe.
 
  ```typescript
       let maybeNum: Maybe<number> = Maybe.just(5);
       myNum: number = maybeNum.withDefault(0); //myNum will equal 5
  ```
 
  ```typescript
       let maybeNum: Maybe<number> = Maybe.nothing<number>();
       myNum: number = maybeNum.withDefault(0); //myNum will equal 0
  ```
  
  Of course if a value could be represented with a default from the start, you would not need the maybe type in the first place. Because of this the withDefault Method is always the last method in a chain of tranformations on a maybe type. These transformations will allow us to put the Maybe in a representation that will ultimately allow us to meaningfully unwrap it with a default. The code below will make this more clear!
  
  
### How to transform a Maybe

A Maybe value is immutable even if it's contained value is not. The **map** method is the primary way to transform a Maybe value by providing a function that operates on the underlying value. This will return a new maybe encapselating the new value. An example will make this more clear.

 ```typescript
       let maybeNum: Maybe<number> = Maybe.just(5);
       myNewNum: Maybe<number> = maybeNum.map(num => num + 10);
       console.log(myNewNum.withDefault(0)) // logs: 15
  ```
 
  ```typescript
       let maybeNum: Maybe<number> = Maybe.nothing<number>();
        myNewNum: number = maybeNum.map(num => num + 10);
       console.log(myNewNum.withDefault(0)) // logs: 0
  ```
  
  A couple of points here:
    1. If the underlying maybe value is "nothing" the function will not be apply and a new maybe will be returned that is also "nothing" but represents the type of the return value of the function. Take a look at the type signature for clarity!
  
  Here is the type for map:
  ``` typescript
  Map :: Maybe<A> => ( (A) => B ) => Maybe<B>
  ```
   2. This allows us to change the type represented by the Maybe when producing a new Maybe with **map**, Even if the maybes are "nothing". This works in conjunction with withDefault to allow transforming and then removing the appropriate type from the maybe. Here is an example
   
   
  ```typescript
  function startingCountMakesInvalid( count: number, mStartingCount: Maybe<number>): boolean {
    return mStartingCount.map(start => start > count).withDefault(false);
  }
  ```
  
  Above we do not allow a count if it is greater than the startingCount. However the starting count may not exist which will allow all numbers. 
  
