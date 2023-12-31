/**
 * @since 2.0.0
 */
import type * as Cause from "./Cause.js";
import type { Effect } from "./Effect.js";
import type * as FiberId from "./FiberId.js";
import type * as FiberRefs from "./FiberRefs.js";
import type { LazyArg } from "./Function.js";
import type * as HashMap from "./HashMap.js";
import type * as Layer from "./Layer.js";
import type * as List from "./List.js";
import type * as LogLevel from "./LogLevel.js";
import type * as LogSpan from "./LogSpan.js";
import type * as Option from "./Option.js";
import type { Pipeable } from "./Pipeable.js";
import type { Scope } from "./Scope.js";
/**
 * @since 2.0.0
 * @category symbols
 */
export declare const LoggerTypeId: unique symbol;
/**
 * @since 2.0.0
 * @category symbols
 */
export type LoggerTypeId = typeof LoggerTypeId;
/**
 * @since 2.0.0
 * @category models
 */
export interface Logger<Message, Output> extends Logger.Variance<Message, Output>, Pipeable {
    readonly log: (options: {
        readonly fiberId: FiberId.FiberId;
        readonly logLevel: LogLevel.LogLevel;
        readonly message: Message;
        readonly cause: Cause.Cause<unknown>;
        readonly context: FiberRefs.FiberRefs;
        readonly spans: List.List<LogSpan.LogSpan>;
        readonly annotations: HashMap.HashMap<string, unknown>;
        readonly date: Date;
    }) => Output;
}
/**
 * @since 2.0.0
 */
export declare namespace Logger {
    /**
     * @since 2.0.0
     * @category models
     */
    interface Variance<Message, Output> {
        readonly [LoggerTypeId]: {
            readonly _Message: (_: Message) => void;
            readonly _Output: (_: never) => Output;
        };
    }
}
/**
 * @category constructors
 * @since 2.0.0
 */
export declare const make: <Message, Output>(log: (options: {
    readonly fiberId: FiberId.FiberId;
    readonly logLevel: LogLevel.LogLevel;
    readonly message: Message;
    readonly cause: Cause.Cause<unknown>;
    readonly context: FiberRefs.FiberRefs;
    readonly spans: List.List<LogSpan.LogSpan>;
    readonly annotations: HashMap.HashMap<string, unknown>;
    readonly date: Date;
}) => Output) => Logger<Message, Output>;
/**
 * @since 2.0.0
 * @category context
 */
export declare const add: <B>(logger: Logger<unknown, B>) => Layer.Layer<never, never, never>;
/**
 * @since 2.0.0
 * @category context
 */
export declare const addEffect: <R, E, A>(effect: Effect<R, E, Logger<unknown, A>>) => Layer.Layer<R, E, never>;
/**
 * @since 2.0.0
 * @category context
 */
export declare const addScoped: <R, E, A>(effect: Effect<R, E, Logger<unknown, A>>) => Layer.Layer<Exclude<R, Scope>, E, never>;
/**
 * @since 2.0.0
 * @category mapping
 */
export declare const mapInput: {
    <Message, Message2>(f: (message: Message2) => Message): <Output>(self: Logger<Message, Output>) => Logger<Message2, Output>;
    <Output, Message, Message2>(self: Logger<Message, Output>, f: (message: Message2) => Message): Logger<Message2, Output>;
};
/**
 * Returns a version of this logger that only logs messages when the log level
 * satisfies the specified predicate.
 *
 * @since 2.0.0
 * @category filtering
 */
export declare const filterLogLevel: {
    (f: (logLevel: LogLevel.LogLevel) => boolean): <Message, Output>(self: Logger<Message, Output>) => Logger<Message, Option.Option<Output>>;
    <Message, Output>(self: Logger<Message, Output>, f: (logLevel: LogLevel.LogLevel) => boolean): Logger<Message, Option.Option<Output>>;
};
/**
 * @since 2.0.0
 * @category mapping
 */
export declare const map: {
    <Output, Output2>(f: (output: Output) => Output2): <Message>(self: Logger<Message, Output>) => Logger<Message, Output2>;
    <Message, Output, Output2>(self: Logger<Message, Output>, f: (output: Output) => Output2): Logger<Message, Output2>;
};
/**
 * A logger that does nothing in response to logging events.
 *
 * @since 2.0.0
 * @category constructors
 */
export declare const none: Logger<unknown, void>;
/**
 * @since 2.0.0
 * @category context
 */
export declare const remove: <A>(logger: Logger<unknown, A>) => Layer.Layer<never, never, never>;
/**
 * @since 2.0.0
 * @category context
 */
export declare const replace: {
    <B>(that: Logger<unknown, B>): <A>(self: Logger<unknown, A>) => Layer.Layer<never, never, never>;
    <A, B>(self: Logger<unknown, A>, that: Logger<unknown, B>): Layer.Layer<never, never, never>;
};
/**
 * @since 2.0.0
 * @category context
 */
export declare const replaceEffect: {
    <R, E, B>(that: Effect<R, E, Logger<unknown, B>>): <A>(self: Logger<unknown, A>) => Layer.Layer<R, E, never>;
    <A, R, E, B>(self: Logger<unknown, A>, that: Effect<R, E, Logger<unknown, B>>): Layer.Layer<R, E, never>;
};
/**
 * @since 2.0.0
 * @category context
 */
export declare const replaceScoped: {
    <R, E, B>(that: Effect<R, E, Logger<unknown, B>>): <A>(self: Logger<unknown, A>) => Layer.Layer<Exclude<R, Scope>, E, never>;
    <A, R, E, B>(self: Logger<unknown, A>, that: Effect<R, E, Logger<unknown, B>>): Layer.Layer<Exclude<R, Scope>, E, never>;
};
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const simple: <A, B>(log: (a: A) => B) => Logger<A, B>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const succeed: <A>(value: A) => Logger<unknown, A>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const sync: <A>(evaluate: LazyArg<A>) => Logger<unknown, A>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const test: {
    <Message>(input: Message): <Output>(self: Logger<Message, Output>) => Output;
    <Message, Output>(self: Logger<Message, Output>, input: Message): Output;
};
/**
 * @since 2.0.0
 * @category context
 */
export declare const withMinimumLogLevel: {
    (level: LogLevel.LogLevel): <R, E, A>(self: Effect<R, E, A>) => Effect<R, E, A>;
    <R, E, A>(self: Effect<R, E, A>, level: LogLevel.LogLevel): Effect<R, E, A>;
};
/**
 * Combines this logger with the specified logger to produce a new logger that
 * logs to both this logger and that logger.
 *
 * @since 2.0.0
 * @category zipping
 */
export declare const zip: {
    <Message2, Output2>(that: Logger<Message2, Output2>): <Message, Output>(self: Logger<Message, Output>) => Logger<Message & Message2, readonly [Output, Output2]>;
    <Message, Output, Message2, Output2>(self: Logger<Message, Output>, that: Logger<Message2, Output2>): Logger<Message & Message2, readonly [Output, Output2]>;
};
/**
 * @since 2.0.0
 * @category zipping
 */
export declare const zipLeft: {
    <Message2, Output2>(that: Logger<Message2, Output2>): <Message, Output>(self: Logger<Message, Output>) => Logger<Message & Message2, Output>;
    <Message, Output, Message2, Output2>(self: Logger<Message, Output>, that: Logger<Message2, Output2>): Logger<Message & Message2, Output>;
};
/**
 * @since 2.0.0
 * @category zipping
 */
export declare const zipRight: {
    <Message2, Output2>(that: Logger<Message2, Output2>): <Message, Output>(self: Logger<Message, Output>) => Logger<Message & Message2, Output2>;
    <Message, Output, Message2, Output2>(self: Logger<Message, Output>, that: Logger<Message2, Output2>): Logger<Message & Message2, Output2>;
};
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const defaultLogger: Logger<unknown, void>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const logfmtLogger: Logger<unknown, string>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const stringLogger: Logger<unknown, string>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const tracerLogger: Logger<unknown, void>;
/**
 * @since 2.0.0
 * @category constructors
 */
export declare const logFmt: Layer.Layer<never, never, never>;
/**
 * @since 2.0.0
 * @category context
 */
export declare const minimumLogLevel: (level: LogLevel.LogLevel) => Layer.Layer<never, never, never>;
//# sourceMappingURL=Logger.d.ts.map