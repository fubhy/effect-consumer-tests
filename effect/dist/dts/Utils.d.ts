import type { Kind, TypeLambda } from "./HKT.js";
/**
 * @category symbols
 * @since 2.0.0
 */
export declare const GenKindTypeId: unique symbol;
/**
 * @category symbols
 * @since 2.0.0
 */
export type GenKindTypeId = typeof GenKindTypeId;
/**
 * @category models
 * @since 2.0.0
 */
export interface GenKind<F extends TypeLambda, R, O, E, A> extends Variance<F, R, O, E> {
    readonly value: Kind<F, R, O, E, A>;
    [Symbol.iterator](): Generator<GenKind<F, R, O, E, A>, A>;
}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare class GenKindImpl<F extends TypeLambda, R, O, E, A> implements GenKind<F, R, O, E, A> {
    /**
     * @since 2.0.0
     */
    readonly value: Kind<F, R, O, E, A>;
    constructor(
    /**
     * @since 2.0.0
     */
    value: Kind<F, R, O, E, A>);
    /**
     * @since 2.0.0
     */
    get _F(): <A_1>(a: A_1) => A_1;
    /**
     * @since 2.0.0
     */
    get _R(): (_: R) => R;
    /**
     * @since 2.0.0
     */
    get _O(): (_: never) => O;
    /**
     * @since 2.0.0
     */
    get _E(): (_: never) => E;
    /**
     * @since 2.0.0
     */
    readonly [GenKindTypeId]: typeof GenKindTypeId;
    /**
     * @since 2.0.0
     */
    [Symbol.iterator](): Generator<GenKind<F, R, O, E, A>, A>;
}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare class SingleShotGen<T, A> implements Generator<T, A> {
    readonly self: T;
    private called;
    constructor(self: T);
    /**
     * @since 2.0.0
     */
    next(a: A): IteratorResult<T, A>;
    /**
     * @since 2.0.0
     */
    return(a: A): IteratorResult<T, A>;
    /**
     * @since 2.0.0
     */
    throw(e: unknown): IteratorResult<T, A>;
    /**
     * @since 2.0.0
     */
    [Symbol.iterator](): Generator<T, A>;
}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const makeGenKind: <F extends TypeLambda, R, O, E, A>(kind: Kind<F, R, O, E, A>) => GenKind<F, R, O, E, A>;
/**
 * @category models
 * @since 2.0.0
 */
export interface Variance<F extends TypeLambda, R, O, E> {
    readonly [GenKindTypeId]: GenKindTypeId;
    readonly _F: (_: F) => F;
    readonly _R: (_: R) => unknown;
    readonly _O: (_: never) => O;
    readonly _E: (_: never) => E;
}
/**
 * @category models
 * @since 2.0.0
 */
export interface Gen<F extends TypeLambda, Z> {
    <K extends Variance<F, any, any, any>, A>(body: (resume: Z) => Generator<K, A>): Kind<F, [
        K
    ] extends [Variance<F, infer R, any, any>] ? R : never, [
        K
    ] extends [Variance<F, any, infer O, any>] ? O : never, [
        K
    ] extends [Variance<F, any, any, infer E>] ? E : never, A>;
}
/**
 * @category models
 * @since 2.0.0
 */
export interface Adapter<Z extends TypeLambda> {
    <_R, _O, _E, _A>(self: Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, _R, _O, _E, _A>(a: A, ab: (a: A) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: F) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (g: H) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, K, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K, kl: (k: K) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, K, L, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K, kl: (k: K) => L, lm: (l: L) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, K, L, M, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K, kl: (k: K) => L, lm: (l: L) => M, mn: (m: M) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, K, L, M, N, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K, kl: (k: K) => L, lm: (l: L) => M, mn: (m: M) => N, no: (n: N) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K, kl: (k: K) => L, lm: (l: L) => M, mn: (m: M) => N, no: (n: N) => O, op: (o: O) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K, kl: (k: K) => L, lm: (l: L) => M, mn: (m: M) => N, no: (n: N) => O, op: (o: O) => P, pq: (p: P) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K, kl: (k: K) => L, lm: (l: L) => M, mn: (m: M) => N, no: (n: N) => O, op: (o: O) => P, pq: (p: P) => Q, qr: (q: Q) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K, kl: (k: K) => L, lm: (l: L) => M, mn: (m: M) => N, no: (n: N) => O, op: (o: O) => P, pq: (p: P) => Q, qr: (q: Q) => R, rs: (r: R) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K, kl: (k: K) => L, lm: (l: L) => M, mn: (m: M) => N, no: (n: N) => O, op: (o: O) => P, pq: (p: P) => Q, qr: (q: Q) => R, rs: (r: R) => S, st: (s: S) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
    <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, _R, _O, _E, _A>(a: A, ab: (a: A) => B, bc: (b: B) => C, cd: (c: C) => D, de: (d: D) => E, ef: (e: E) => F, fg: (f: F) => G, gh: (g: G) => H, hi: (h: H) => I, ij: (i: I) => J, jk: (j: J) => K, kl: (k: K) => L, lm: (l: L) => M, mn: (m: M) => N, no: (n: N) => O, op: (o: O) => P, pq: (p: P) => Q, qr: (q: Q) => R, rs: (r: R) => S, st: (s: S) => T, tu: (s: T) => Kind<Z, _R, _O, _E, _A>): GenKind<Z, _R, _O, _E, _A>;
}
/**
 * @category adapters
 * @since 2.0.0
 */
export declare const adapter: <F extends TypeLambda>() => Adapter<F>;
/**
 * @category model
 * @since 2.0.0
 */
export type PCGRandomState = [number, number, number, number];
/**
 * @category model
 * @since 2.0.0
 */
export type OptionalNumber = number | null | undefined;
/**
 * PCG is a family of simple fast space-efficient statistically good algorithms
 * for random number generation. Unlike many general-purpose RNGs, they are also
 * hard to predict.
 *
 * @category model
 * @since 2.0.0
 */
export declare class PCGRandom {
    private _state;
    /**
     * Creates an instance of PCGRandom.
     *
     * @param seed - The low 32 bits of the seed (0 is used for high 32 bits).
     *
     * @memberOf PCGRandom
     */
    constructor(seed?: OptionalNumber);
    /**
     * Creates an instance of PCGRandom.
     *
     * @param seedHi - The high 32 bits of the seed.
     * @param seedLo - The low 32 bits of the seed.
     * @param inc - The low 32 bits of the incrementer (0 is used for high 32 bits).
     *
     * @memberOf PCGRandom
     */
    constructor(seedHi: OptionalNumber, seedLo: OptionalNumber, inc?: OptionalNumber);
    /**
     * Creates an instance of PCGRandom.
     *
     * @param seedHi - The high 32 bits of the seed.
     * @param seedLo - The low 32 bits of the seed.
     * @param incHi - The high 32 bits of the incrementer.
     * @param incLo - The low 32 bits of the incrementer.
     *
     * @memberOf PCGRandom
     */
    constructor(seedHi: OptionalNumber, seedLo: OptionalNumber, incHi: OptionalNumber, incLo: OptionalNumber);
    /**
     * Returns a copy of the internal state of this random number generator as a
     * JavaScript Array.
     *
     * @category getters
     * @since 2.0.0
     */
    getState(): PCGRandomState;
    /**
     * Restore state previously retrieved using `getState()`.
     *
     * @since 2.0.0
     */
    setState(state: PCGRandomState): void;
    /**
     * Get a uniformly distributed 32 bit integer between [0, max).
     *
     * @category getter
     * @since 2.0.0
     */
    integer(max: number): number;
    /**
     * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
     * 53 bits of precision (every bit of the mantissa is randomized).
     *
     * @category getters
     * @since 2.0.0
     */
    number(): number;
}
//# sourceMappingURL=Utils.d.ts.map