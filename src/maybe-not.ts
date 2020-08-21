export interface Functor<T> {
    map<B>(fn: (arg: T) => B): Maybe<B>;
}

export interface Applicative<T> extends Functor<T> {
    ap<A>(fn: Applicative<(arg: T) => A>): Applicative<A>;
}

export interface Monad<T> extends Applicative<T> {
    bind<A>(fn: (arg: T) => Monad<A>): Monad<A>;
}

export class Maybe<T> implements Monad<T> {
    constructor(private value?: T | undefined) {}

    static just<A>(val: A) {
        if (val === undefined || val === null) {
            throw new TypeError('Value passed to just must exist!');
        }

       return new Maybe(val);
    }

    static nothing<A>(): Maybe<A> {
        return new Maybe<A>();
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

    static sequence(arr: Maybe<any>[]): Maybe<any[]> {
        return arr.reduce((acc, val) => {
            return acc.bind(arr => val.map(item => arr.concat(item)));
        }, Maybe.just([]));
    }

    static traverse<A, B>(fn: (input: A) => B, arr: Maybe<A>[]): Maybe<B[]> {
        return Maybe.sequence(arr).map(items => items.map(fn));
    }

    static justMap<A, B>(fn: (input: A) => Maybe<B>, arr: A[]): B[] {
        return arr.reduce((acc: B[], item) => {
            const mValue = fn(item);

            return mValue.value !== undefined ?  acc.concat(mValue.value) : acc;
            }, []);
    }

    static filterSomethings<A>(arr: Array<Maybe<A>>): A[] {
        return arr.reduce((acc, xM) => {
            if (xM.value) {
                acc.push(xM.value)
            }
            return acc;
        }, [] as Array<A>);
    }

    static lift<A, B>(fn: (input: A) => B): (mX: Maybe<A>) => Maybe<B> {
        return mX => mX.map(fn);
    }

    static lift2<A, B, C>(fn: (x: A, y: B) => C): (mX: Maybe<A>, mY: Maybe<B>) => Maybe<C> {
        return (mX, mY) => Maybe.sequence([mX, mY]).map(ms => fn(ms[0], ms[1]));
    }

    static lift3<A, B, C, D>(fn: (x: A, y: B, z: C) => D): (mA: Maybe<A>, mB: Maybe<B>, mC: Maybe<C>) => Maybe<D> {
        return (mX, mY, mZ) => Maybe.sequence([mX, mY, mZ]).map(ms => fn(ms[0], ms[1], ms[2]));
    }

    static toPromise<A>(maybe: Maybe<A>): Promise<A> {
        if (maybe.hasSomething) {
            return Promise.resolve(maybe.value!);
        } else {
            return Promise.reject();
        }
    }

    map<U>(fn: (value: T) => U | undefined | null): Maybe<U> {
        if (this.value !== undefined) {
            return Maybe.maybe(fn(this.value));
        }
        return Maybe.nothing<U>();
    }

    async asyncMap<U>(fn: (value: T) => Promise<U | undefined | null>): Promise<U> {
       if (this.value !== undefined) {
           return fn(this.value).then(x => {
             if (x === undefined || x === null) {
                 throw 'Promise Conversion from a Maybe.Nothing';
             }
             return x;
           });
       } 
       return Promise.reject();
    }

    alt(elseValue: Maybe<T>): Maybe<T> {
        return this.value !== undefined ? this : elseValue;
    }

    altMap(elseFn: () => Maybe<T>): Maybe<T> {
        return this.value !== undefined ? this : elseFn();
    }

    ap<U>(mFn: Maybe<(value: T) => U>): Maybe<U> {
        return mFn.bind(fn => this.map(fn));
    }

    bind<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
        return Maybe.join(this.map(fn));
    }

    withDefault(fallback: T): T {
        return this.value !== undefined ? this.value : fallback;
    }

    withDefaultFn(fallbackFn: () => T): T {
        return this.value !== undefined ? this.value : fallbackFn();
    }

    get hasNothing(): boolean {
        return this.value === undefined;
    }

    get hasSomething(): boolean {
        return !this.hasNothing;
    }

    unsafeElse(fn: () => void): void {
        if (this.hasNothing) {
            fn();
        }
    }
}


