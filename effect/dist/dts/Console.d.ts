/**
 * @since 2.0.0
 */
import type { Effect } from "./Effect.js";
import type * as Layer from "./Layer.js";
import type { Scope } from "./Scope.js";
/**
 * @since 2.0.0
 * @category type ids
 */
export declare const TypeId: unique symbol;
/**
 * @since 2.0.0
 * @category type ids
 */
export type TypeId = typeof TypeId;
/**
 * @since 2.0.0
 * @category model
 */
export interface Console {
    readonly [TypeId]: TypeId;
    assert(condition: boolean, ...args: ReadonlyArray<any>): Effect<never, never, void>;
    readonly clear: Effect<never, never, void>;
    count(label?: string): Effect<never, never, void>;
    countReset(label?: string): Effect<never, never, void>;
    debug(...args: ReadonlyArray<any>): Effect<never, never, void>;
    dir(item: any, options?: any): Effect<never, never, void>;
    dirxml(...args: ReadonlyArray<any>): Effect<never, never, void>;
    error(...args: ReadonlyArray<any>): Effect<never, never, void>;
    group(options?: {
        readonly label?: string;
        readonly collapsed?: boolean;
    }): Effect<never, never, void>;
    readonly groupEnd: Effect<never, never, void>;
    info(...args: ReadonlyArray<any>): Effect<never, never, void>;
    log(...args: ReadonlyArray<any>): Effect<never, never, void>;
    table(tabularData: any, properties?: ReadonlyArray<string>): Effect<never, never, void>;
    time(label?: string): Effect<never, never, void>;
    timeEnd(label?: string): Effect<never, never, void>;
    timeLog(label?: string, ...args: ReadonlyArray<any>): Effect<never, never, void>;
    trace(...args: ReadonlyArray<any>): Effect<never, never, void>;
    warn(...args: ReadonlyArray<any>): Effect<never, never, void>;
    readonly unsafe: UnsafeConsole;
}
/**
 * @since 2.0.0
 * @category model
 */
export interface UnsafeConsole {
    assert(condition: boolean, ...args: ReadonlyArray<any>): void;
    clear(): void;
    count(label?: string): void;
    countReset(label?: string): void;
    debug(...args: ReadonlyArray<any>): void;
    dir(item: any, options?: any): void;
    dirxml(...args: ReadonlyArray<any>): void;
    error(...args: ReadonlyArray<any>): void;
    group(options?: {
        readonly label?: string;
        readonly collapsed?: boolean;
    }): void;
    groupEnd(): void;
    info(...args: ReadonlyArray<any>): void;
    log(...args: ReadonlyArray<any>): void;
    table(tabularData: any, properties?: ReadonlyArray<string>): void;
    time(label?: string): void;
    timeEnd(label?: string): void;
    timeLog(label?: string, ...args: ReadonlyArray<any>): void;
    trace(...args: ReadonlyArray<any>): void;
    warn(...args: ReadonlyArray<any>): void;
}
/**
 * @since 2.0.0
 * @category default services
 */
export declare const withConsole: {
    <A extends Console>(console: A): <R, E, A>(effect: Effect<R, E, A>) => Effect<R, E, A>;
    <R, E, A extends Console>(effect: Effect<R, E, A>, console: A): Effect<R, E, A>;
};
/**
 * @since 2.0.0
 * @category default services
 */
export declare const setConsole: <A extends Console>(console: A) => Layer.Layer<never, never, never>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const consoleWith: <R, E, A>(f: (console: Console) => Effect<R, E, A>) => Effect<R, E, A>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const assert: (condition: boolean, ...args: ReadonlyArray<any>) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const clear: Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const count: (label?: string) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const countReset: (label?: string) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const debug: (...args: ReadonlyArray<any>) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const dir: (item: any, options?: any) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const dirxml: (...args: ReadonlyArray<any>) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const error: (...args: ReadonlyArray<any>) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const group: (options?: {
    label?: string;
    collapsed?: boolean;
}) => Effect<Scope, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const info: (...args: ReadonlyArray<any>) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const log: (...args: ReadonlyArray<any>) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const table: (tabularData: any, properties?: ReadonlyArray<string>) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const time: (label?: string) => Effect<Scope, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const timeLog: (label?: string, ...args: ReadonlyArray<any>) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const trace: (...args: ReadonlyArray<any>) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const warn: (...args: ReadonlyArray<any>) => Effect<never, never, void>;
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const withGroup: {
    (options?: {
        readonly label?: string;
        readonly collapsed?: boolean;
    }): <R, E, A>(self: Effect<R, E, A>) => Effect<R, E, A>;
    <R, E, A>(self: Effect<R, E, A>, options?: {
        readonly label?: string;
        readonly collapsed?: boolean;
    }): Effect<R, E, A>;
};
/**
 * @since 2.0.0
 * @category accessor
 */
export declare const withTime: {
    (label?: string): <R, E, A>(self: Effect<R, E, A>) => Effect<R, E, A>;
    <R, E, A>(self: Effect<R, E, A>, label?: string): Effect<R, E, A>;
};
//# sourceMappingURL=Console.d.ts.map