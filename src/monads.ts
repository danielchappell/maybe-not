interface Matcher<A,B> {
    something(A): B;
    nothing(): B;
}

interface Functor<T> {
    fmap<A>(fn: (T) => A): Maybe<A>;
}

interface Applicative<T> extends Functor<T> {
    pure<A>(val: A): Applicative<A>;
    appl<A>(fn: Applicative<(T) => A>): Applicative<A>;
}

interface Monad<T> extends Applicative<T> {
    unit<A>(val: A): Monad<A>;
    bind<A,B>(fn: (A) => Monad<B>): Monad<B>;
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
    appl<A>(fn: Maybe<(T) => A>): Maybe<A> {
        if (fn.isNothing) {
            throw new TypeError("blow the fuk up");
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

