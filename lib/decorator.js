"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
/**
 * Error representing incompatible schema with data.
 */
class IncompatibleSchemaError extends Error {
}
exports.IncompatibleSchemaError = IncompatibleSchemaError;
const basicMappings = {
    string: String,
    number: Number,
    boolean: Boolean,
    null: null,
    undefined,
    symbol: Symbol,
    object: Object,
    function: Function,
};
function fromJson(theClass, json) {
    const jsonCopy = Object.assign({}, json);
    let keys = Reflect.getMetadata("TSonArguments", theClass);
    if (!keys) {
        keys = Object.keys(jsonCopy).sort();
    }
    const constructorSignature = Reflect.getMetadata("design:paramtypes", theClass);
    for (let i = 0; i < keys.length; i++) {
        const objectType = typeof jsonCopy[keys[i]];
        const constructorType = constructorSignature[i];
        if (objectType === "object" && Reflect.getMetadata("isTsonSerializable", constructorType)) {
            jsonCopy[keys[i]] = fromJson(constructorType, jsonCopy[keys[i]]);
        }
        else if (basicMappings[objectType] !== constructorType) {
            throw new IncompatibleSchemaError("Incompatible type " + keys[i] + " should be an " + constructorType);
        }
    }
    // tslint:disable-next-line:new-parens
    return new (Function.prototype.bind.apply(theClass, [null].concat(keys.map((k) => jsonCopy[k]))));
}
exports.fromJson = fromJson;
function toJson(c) {
    const args = Reflect.getMetadata("TSonArguments", c);
    const result = {};
    if (args) {
        for (const arg of args) {
            const obj = c[arg];
            if (typeof obj === "object" && obj.constrctor && Reflect.getMetadata("isTsonSerializable", obj.constructor)) {
                result[arg] = toJson(obj);
            }
            else {
                result[arg] = obj;
            }
        }
    }
    else {
        for (const k in c) {
            const obj = c[k];
            if (typeof obj === "object" && obj.constructor && Reflect.getMetadata("isTsonSerializable", obj.constructor)) {
                result[k] = toJson(obj);
            }
            else {
                result[k] = obj;
            }
        }
    }
    return result;
}
exports.toJson = toJson;
function TSonSerializable(c) {
    Reflect.defineMetadata("isTsonSerializable", true, c);
}
exports.TSonSerializable = TSonSerializable;
function TSonArguments(...args) {
    return (c) => {
        Reflect.defineMetadata("TSonArguments", args, c);
    };
}
exports.TSonArguments = TSonArguments;
//# sourceMappingURL=decorator.js.map