import { Maybe } from '../src/maybenot';
import { expect } from 'chai';

declare var describe: any;
declare var it: any;


describe('Maybe Class', function() {

    describe('Static Construction Methods', function() {
        describe('#Maybe.just(value)', function() {

            it('can create "FULL" Maybe with just method and single value arugment', function() {
                let maybeString = Maybe.just('not empty');
                expect(maybeString.withDefault('')).to.equal('not empty');
            });

            it('cannot pass null or undefined as argument', function() {
                expect(() => Maybe.just(null)).to.throw();
                expect(() => Maybe.just(undefined)).to.throw();
                expect(() => Maybe.just('hi uze guyz')).to.not.throw();

            });
        });

        describe('#Maybe.nothing()', function() {
            it('can create "EMPTY" Maybe and takes no arguments', function() {
                expect(Maybe.nothing<string>().withDefault('nothing in here!')).to.equal('nothing in here!'); 
            });
        });

        describe('#Maybe.maybe(possibleValue)', function() {
            it('can create "FULL" or "EMPTY" Maybe depending on if value exists', function() {
                expect(Maybe.maybe<string>('something is here').withDefault('')).to.equal('something is here');
                expect(Maybe.maybe<string>(undefined).withDefault('nope nothing')).to.equal('nope nothing');
                expect(Maybe.maybe<string>(null).withDefault('nope nothing')).to.equal('nope nothing');
            });
        });

        describe('Static Utility Methods', function() {
            describe('#Maybe.join(nestedMaybe)', function() {
                it('should flatten a Maybe one level deep, does not change original', function() {
                    let doubleNestedMaybe = Maybe.just(Maybe.just(Maybe.just('1')));
                    expect(Maybe.join(doubleNestedMaybe).map(maybe1 => maybe1.withDefault('nothing here')).withDefault('not here either')).to.equal('1');

                    expect(Maybe.join(Maybe.join(doubleNestedMaybe)).withDefault('nothing here')).to.equal('1');
                });

                it('will be "FULL" if both outter and inner maybes are "FULL"', function() {
                    let nestedMaybe = Maybe.just(Maybe.just('hi'));
                    expect(Maybe.join(nestedMaybe).withDefault('bye')).to.equal('hi');
                });


                it('will be "EMPTY" if either outter or inner maybes are "EMPTY"', function() {
                    let outerEmpty = Maybe.nothing<Maybe<string>>();
                    let innerEmpty = Maybe.just(Maybe.nothing<string>());
                    expect(Maybe.join(outerEmpty).withDefault('bye')).to.equal('bye');
                    expect(Maybe.join(outerEmpty).withDefault('bye')).to.equal('bye');
                });

            });

            describe('#Maybe.sequence(arrOfMaybes)', function() {

                it('should return array of unwrapped values in a Maybe if all Maybes are "FULL"', function () {
                    let arrOfMaybes = [Maybe.just(1), Maybe.just(2), Maybe.just(3)];
                    expect(Maybe.sequence(arrOfMaybes).withDefault([])).to.include.ordered.members([1, 2, 3]);
                });

                it('should return "EMPTY" maybe if any Maybes in array are "EMPTY"', function() {
                    let arrOfMaybes = [Maybe.just(1), Maybe.nothing<number>(), Maybe.just(3)];
                    expect(Maybe.sequence(arrOfMaybes).withDefault([4,3,1])).to.include.ordered.members([4,3,1]);
                });

                it('can be used with arrays of multiple types to combine two maybes for a map', function() {
                    let arrAsTuple = [Maybe.just(false), Maybe.just(31)];
                    let canWatchMovie: Maybe<boolean> = Maybe.sequence(arrAsTuple).map(([canWatch, currentAge]: [boolean, number]) => canWatch || currentAge > 17);

                    expect(canWatchMovie.withDefault(false)).to.be.true;
                });
            });

            describe('#Maybe.traverse(fn, arrOfMaybes)', function() {
                it('should map the function over array if all maybes are "FULL"', function() {
                    let arrOfMaybes = [Maybe.just(1), Maybe.just(2), Maybe.just(3)];
                    let addOne = (x: number): number => x + 1;
                    let maybeTransformedArray = Maybe.traverse(addOne, arrOfMaybes);
                    expect(maybeTransformedArray.withDefault([])).to.include.ordered.members([2, 3, 4]);
                });

                it('should not map the function over array if some are "EMPTY" and just return an "EMPTY"', function() {
                    let arrOfMaybes = [Maybe.just(1), Maybe.nothing(), Maybe.just(3)];
                    let addOne = (x: number): number => x + 1;
                    let maybeTransformedArray = Maybe.traverse(addOne, arrOfMaybes);
                    expect(maybeTransformedArray.withDefault([])).to.include.ordered.members([]);
                });
            });

            describe('#Maybe.lift(singleArgumentFn)', function() {
                it('should take a function with a single argument and return value and return a function with argument and return value as maybes', function() {
                    let addOne = (x: number): number => x +1;
                    let liftedAddOne: ((mX: Maybe<number>) => Maybe<number>) = Maybe.lift(addOne);
                    expect(liftedAddOne(Maybe.just(1)).withDefault(0)).to.equal(2);
                });
            });

            describe('#Maybe.lift2(doubleArgumentFn)', function() {
                it('should take a function with a two arguments and return value and return a function with argument and return value as maybes', function() {
                    let addTogether = (x: number, y: number): number => x + y;
                    let liftedAddTogether: ((mX: Maybe<number>, mY: Maybe<number>) => Maybe<number>) = Maybe.lift2(addTogether);
                    expect(liftedAddTogether(Maybe.just(1), Maybe.just(2)).withDefault(0)).to.equal(3);
                });
            });


            describe('#Maybe.lift3(tripleArgumentFn)', function() {
                it('should take a function with a three arguments and return value and return a function with argument and return value as maybes', function() {
                    let addThree = (x: number, y: number, z: number): number => x + y + z;
                    let liftedAddThree: ((mX: Maybe<number>, mY: Maybe<number>, mZ: Maybe<number>) => Maybe<number>) = Maybe.lift3(addThree);
                    expect(liftedAddThree(Maybe.just(1), Maybe.just(2), Maybe.just(5)).withDefault(0)).to.equal(8);
                });
            });
        });

        describe('Instance Methods', function() {
            describe('#map(fn)', function() {
                it('should apply inner value to function and wrap resulting value in a Maybe', function() {
                    expect(Maybe.just([1]).map(x => x.concat([2, 3, 4])).withDefault([])).to.include.ordered.members([1, 2, 3, 4]);

                });

                it('should apply function only if Maybe is not "EMPTY" otherwise return an "EMPTY" Maybe', function () {
                    expect(Maybe.nothing<number[]>().map(x => x.concat([2, 3, 4])).withDefault([])).to.include.ordered.members([]);
                });


            });


            describe('#ap(maybeFn)', function() {
                it('should map inner function if both Maybe(value) and Maybe(Fn) are "FULL"', function() {

                }

            });


            describe('#bind(fnReturningMaybe)', function() {


            });

            describe('#withDefault(fallbackOfSameType)', function() {


            });
        });
    });
});
