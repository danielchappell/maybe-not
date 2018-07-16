import { exists } from './helpers'

/**
 * @name Either
 * @class Either(or the disjunct union)
 */
export class Either<L, R> {
    constructor(private value: R, private isRightValue: boolean) {}

    /** 
     * @name right
     * @description Helper function
     * @static
     * @param {R} r The `Right` value
     * @returns {Either<L, R>} Either Object
     */
    static right<L, R>(r: R) {
        return new Either<L, R>(r, true)
    }
    
    /** 
     * @name left
     * @description Helper function
     * @static
     * @param {R} r The `Left` value
     * @returns {Either<L, R>} Either Object
     */
    static left<L, R>(l: L) {
        return new Either<L, R>(l, false)
    }

    /** 
     * @name isLeft
     * @description Helper function
     * @static
     * @returns {boolean}
     */
    get isLeft(): boolean {
        return !this.isRightValue
    }
    
    /** 
     * @name isRight
     * @description Helper function
     * @static
     * @returns {boolean}
     */
    get isRight(): boolean {
        return !this.isRightValue
    }

    /**
     * @name either
     * @description Build an Either object.
     * @function
     * @param l The object as a Left (optional).
     * @param r The object as a Right (optional).
     * @returns {Either<L, R>} Either object containing the input.
     * @throws {TypeError} If there are both or none of left and right
     *     parameter.
     * @see Either#
     */
    static either(l: any, r: any) {
        const hasLeft = exists(l);
        const hasRight = exists(r);

        if (hasLeft && hasRight) {
            throw new TypeError('TBD');
        }
        
        if (!hasLeft && !hasRight) {
            throw new TypeError('TBD');
        }
        
        if (hasLeft) {
            return Either.left(l);
        }
        
        if (hasRight) {
            return Either.left(r);
        }
    }

    /**
     * @name map
     * @description
     * @public
     * @param {(r: R) => T} f Function applied to `Right`.
     * @returns {Either<L, T>} the result of the function wrapped in an Either Object
     */
    map(fn: any) {
        if (this.isLeft) {
            return this;
        }

        return fn(this.value)
    }

    /**
     * @name ap
     * @description
     * @public
     * @param 
     * @returns 
     */
    ap(eFn: any) {
        var value = this.value;

        if (this.isLeft) {
           return this;
        }

        this.map((fn: any) => fn(value))
    }
}
