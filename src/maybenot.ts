export declare interface Matcher<A,B> {
    something(A): B;
    nothing(): B;
}

export declare interface Functor<T> {
    fmap<B>(fn: (T) => B): Maybe<B>;
}


export declare interface Applicative<T> extends Functor<T> {
    ap<A>(fn: Applicative<(T) => A>): Applicative<A>;
}

export declare interface Monad<T> extends Applicative<T> {
    bind<A>(fn: (T) => Monad<A>): Monad<A>;
}

export declare type StateFn<S,A> = (S) => [A, S];
export class State<S,A> {
    constructor(stateFn: StateFn<S,A>) {
        this.runState = stateFn;
    };
    runState: StateFn<S,A>;
    static unit<S,A>(val: A) {
        return new State((state: S) => [val, state]);
    };
    static next<S,A>(val: A, passedState: S) {
        return new State((state: S) => [val, passedState]);
    };
    bind<B>(fn: (A ) => State<S,B>): State<S,B> {
        return new State<S,B>((state: S) => {
            let [newVal, newState] = this.runState(state);
            return fn(newVal).runState(newState);
        });
    };
    map<B>(fn: (A) => B): State<S,B> {
        return new State<S,B>((state: S) => {
            let [newVal, newState] = this.runState(state);
            return [fn(newVal), newState];
        });
    };
    ap<B,F>(fnM: State<S,(A) => B>): State<S,B> {
        return new State<S,B>((state: S) => {
            let [fn, newState]: [(A) => B, S] = fnM.runState(state);
            let [newVal, finalState] = this.runState(newState);
            return [fn(newVal), finalState];
        });
    };
    modify(modFn: (S) => S): State<S, null> {
        return new State((state) => [null, modFn(state)]);
    };
    get(): State<S,S> {
        return new State((state) => [state, state]);
    };
    put(newState: S): State<S, null> {
        return new State((state) => [null, newState]);
    }
}


export class Maybe<T> implements Monad<T> {
    constructor(private type: "Just" | "Nothing", private value?: T) {}
    static just<A>(val: A) {
        if (val === undefined || val === null) {
            throw new TypeError("You sucker, how did you let this happen!?");
        }
        return new Maybe("Just", val);
    }
    static nothing<A>(): Maybe<A> {
        return new Maybe<A>("Nothing");
    }
    static maybe<A>(val: A | null | void): Maybe<A> {
        if (val === undefined || val === null) {
            return Maybe.nothing<A>();
        }
        return Maybe.just(val);
    }
    static all<A,B>(arr: Maybe<any>[], patterns: Matcher<A,B>): B {
        let fullOfSomethings = true;    

        let successArgs = arr.map(x => x.do({
            something(y) {
                return y;
            },
            nothing(){
                fullOfSomethings = false;
            }
        }));

        if (fullOfSomethings) {
            return patterns.something(successArgs);
        } else {
            return patterns.nothing();
        }
    }
    fmap<B>(fn: (T) => B | void | null): Maybe<B> {
        if (this.isSomething()) {
            return Maybe.maybe(fn(this.value));
        }
        return Maybe.nothing<B>();
    }
    ap<A>(fn: Maybe<(T) => A>): Maybe<A> {
        if (fn.isNothing) {
            return Maybe.nothing<A>();
        }
        return this.fmap(fn.unwrap());
    }
    pure<A>(val: A): Maybe<A> {
        return Maybe.maybe(val);
    }

    unit = this.pure;

    bind<A>(fn: (T) => Maybe<A>): Maybe<A> {
        return fn(this.value);
    }
    isNothing(): boolean {
        return this.value === undefined || this.value === null;
    }
    isSomething(): boolean {
        return !this.isNothing();
    }
    private unwrap(): T {
        if (this.isNothing() || this.value === undefined) {
            throw new TypeError("come on you guyyyzz");
        }
        return this.value;
    }

    do<A,B>(patterns: Matcher<A,B>): B {
        if(this.isSomething()) {
            return patterns.something(this.value);
        }
        return patterns.nothing();
    }

    withDefault(fallback: T): T {
        return this.isSomething() ? this.unwrap() : fallback;
    }
}


