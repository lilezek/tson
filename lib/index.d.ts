import "reflect-metadata";
export declare class IncompatibleSchemaError extends Error {
}
export declare function fromJson<T>(theClass: {
    prototype: any;
    new (...args: any[]): T;
}, json: any): T;
export declare function toJson(c: {
    constructor: Function;
}): any;
