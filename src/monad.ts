/**
 * @name Functor
 * @description TBD
 */
export interface Functor<T> {}


/**
 * @name Applicative
 * @description TBD
 */
export interface Applicative<T> extends Functor<T> {}

/**
 * @name Applicative
 * @description TBD
 */
export interface Monad<T> extends Applicative<T> {}