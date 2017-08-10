export declare interface Functor<T> {
    map<B>(fn: (arg: T) => B): Maybe<B>;
}

export declare interface Applicative<T> extends Functor<T> {
    ap<A>(fn: Applicative<(arg: T) => A>): Applicative<A>;
}

export declare interface Monad<T> extends Applicative<T> {
    bind<A>(fn: (arg: T) => Monad<A>): Monad<A>;
}

export class Maybe<T> implements Monad<T> {

    constructor(private type: "Just" | "Nothing", private value?: T) {}

    static just<A>(val: A) {
        if (val === undefined || val === null) {
            throw new TypeError('Value passed to just must exist!');
        }

       return new Maybe("Just", val);
    }

    static nothing<A>(): Maybe<A> {
        return new Maybe<A>("Nothing");
    }

    static maybe<A>(val: A | null | undefined): Maybe<A> {
        if (val === undefined || val === null) {
            return Maybe.nothing<A>();
        }

        return Maybe.just<A>(val);
    }

    static of = Maybe.maybe;

    static join<A>(nestedMaybe: Maybe<Maybe<A>>) {
        return nestedMaybe.withDefault(Maybe.nothing<A>()); 
    }

    static sequence<A>(arr: Maybe<any>[]): Maybe<any[]> {
        return arr.reduce((acc, val)  => {
            return acc.bind(arr => val.map(item => arr.concat(item)));
        }, Maybe.just([]));
    }

    static traverse<A, B>(fn: (A) => B, arr: Maybe<A>[]): Maybe<B[]> {
        return Maybe.sequence(arr).map(items => items.map(fn));
    }

    static lift<A, B>(fn: (A) => B): (mX: Maybe<A>) => Maybe<B> {
        return mX => mX.map(fn);
    }

    static lift2<A, B, C>(fn: (A, B) => C): (mX: Maybe<A>, mY: Maybe<B>) => Maybe<C> {
        return (mX, mY) => Maybe.sequence([mX, mY]).map(ms => fn(ms[0], ms[1]));
    }


    static lift3<A, B, C, D>(fn: (A, B, C) => D): (mA: Maybe<A>, mB: Maybe<B>, mC: Maybe<C>) => Maybe<D> {
        return (mA, mB, mC) => Maybe.sequence([mA, mB, mC]).map(ms => fn(ms[0], ms[1], ms[2]));
    }

    map<B>(fn: (T) => B | undefined | null): Maybe<B> {
        if (this.hasSomething) {
            return Maybe.maybe(fn(this.value));
        }
        return Maybe.nothing<B>();
    }

    ap<A>(mFn: Maybe<(T) => A>): Maybe<A> {
        return mFn.bind(fn => this.map(fn));
    }

    bind<A>(fn: (T) => Maybe<A>): Maybe<A> {
        return Maybe.join(this.map(fn));
    }

    withDefault(fallback: T): T {
        return this.hasSomething ? this.value : fallback;
    }

    get hasNothing(): boolean {
        return this.value === undefined || this.value === null;
    }
    get hasSomething(): boolean {
        return !this.hasNothing;
    }
}


