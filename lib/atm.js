"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TSON for using with Awesome Typescript Metadata Emitter: https://github.com/lilezek/awesome-metadata
 */
const awesome_metadata_1 = require("awesome-metadata");
require("reflect-metadata");
const decorator_1 = require("./decorator");
exports.IncompatibleSchemaError = decorator_1.IncompatibleSchemaError;
function resolveSingleType(type, json, keyName) {
    if (type.kind === awesome_metadata_1.ETypes.CLASS) {
        return fromJson(type.ctor, json);
    }
    else if (type.kind === awesome_metadata_1.ETypes.INTERFACE) {
        // TODO: ATM does not implement interface resolution yet.
    }
    else if (type.kind === awesome_metadata_1.ETypes.PRIMITIVE) {
        if (type.primitive !== typeof json) {
            throw new decorator_1.IncompatibleSchemaError(`Expected ${keyName} of type ${type.primitive} and ${typeof json} found`);
        }
        return json;
    }
    else if (type.kind === awesome_metadata_1.ETypes.UNION) {
        let errorLeft = "";
        let errorRight = "";
        if (!type.and) {
            try {
                return resolveSingleType(type.left, json, keyName);
            }
            catch (err) {
                errorLeft = err.message;
                try {
                    return resolveSingleType(type.right, json, keyName);
                }
                catch (err2) {
                    errorRight = err.message;
                    // tslint:disable-next-line:max-line-length
                    throw new decorator_1.IncompatibleSchemaError(`Element ${keyName} did not pass these conditions: ${errorLeft}\n${errorRight}`);
                }
            }
        }
        else {
            // TODO: Implement Intersections.
        }
    }
}
function fromJson(theClass, json) {
    // Construct without calling constructor:
    const result = {};
    Object.setPrototypeOf(result, theClass.prototype);
    // Traverse body:
    const originalAmountKeys = Object.keys(json).length;
    let parsedKeys = 0;
    const body = Reflect.getMetadata("atm:body", theClass);
    for (const k in body) {
        const el = body[k];
        if (!el.optional || k in json) {
            const type = el.type;
            result[k] = resolveSingleType(type, json[k], k);
            parsedKeys++;
        }
    }
    if (parsedKeys < originalAmountKeys) {
        throw new decorator_1.IncompatibleSchemaError("Object contains unexpected fields");
    }
    return result;
}
exports.fromJson = fromJson;
function extractSingleType(type, json) {
    if (type.kind === awesome_metadata_1.ETypes.CLASS) {
        return toJson(json);
    }
    else if (type.kind === awesome_metadata_1.ETypes.INTERFACE) {
        // TODO: ATM does not implement interface resolution yet.
        return {};
    }
    else if (type.kind === awesome_metadata_1.ETypes.PRIMITIVE) {
        return json;
    }
    else if (type.kind === awesome_metadata_1.ETypes.UNION) {
        if (!type.and) {
            // TODO: Serialize unions.
        }
        else {
            // TODO: Serialize Intersections.
        }
    }
}
function toJson(c) {
    const result = {};
    // Traverse body:
    const body = Reflect.getMetadata("atm:body", c.constructor);
    for (const k in body) {
        const el = body[k];
        if (!el.optional || k in c) {
            const type = el.type;
            result[k] = extractSingleType(type, c[k]);
        }
    }
    return result;
}
exports.toJson = toJson;
//# sourceMappingURL=atm.js.map