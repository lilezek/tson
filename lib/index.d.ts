import "reflect-metadata";
declare global  {
    namespace Reflect {
        function getMetadata<T = any>(key: "tson:post", target: {
            new (...args: any[]): T;
        }): Array<(target: T) => ValidationError | undefined> | undefined;
    }
}
export declare class ValidationError extends Error {
    key: string;
    private pMessage;
    message: string;
}
export declare type ValidatorFunction<V> = (val: V) => ValidationError | undefined;
export declare class IncompatibleSchemaError extends Error {
}
export declare function fromJson<T>(theClass: {
    prototype: any;
    new (...args: any[]): T;
}, json: any): any;
export declare function toJson(c: {
    constructor: Function;
}): any;
export declare function hardcodedToJson(c: {
    constructor: Function;
}): any;
