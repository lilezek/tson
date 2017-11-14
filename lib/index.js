"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * TSON for using with Awesome Typescript Metadata Emitter: https://github.com/lilezek/awesome-metadata
 */
const awesome_metadata_1 = require("awesome-metadata");
require("reflect-metadata");
const awesome_metadata_2 = require("awesome-metadata");
class ValidationError extends Error {
    __metadataDummyMethod() {
    }
    set message(v) {
        this.pMessage = v;
    }
    get message() {
        return this.pMessage + ", of " + this.key + " field.";
    }
}
__decorate([
    awesome_metadata_2.DecoratorInjectMetadata("atm:body", { key: { kind: 0, primitive: "string" }, pMessage: { kind: 0, primitive: "string" } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ValidationError.prototype, "__metadataDummyMethod", null);
exports.ValidationError = ValidationError;
class IncompatibleSchemaError extends Error {
    __metadataDummyMethod() {
    }
}
__decorate([
    awesome_metadata_2.DecoratorInjectMetadata("atm:body", {}),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IncompatibleSchemaError.prototype, "__metadataDummyMethod", null);
exports.IncompatibleSchemaError = IncompatibleSchemaError;
function resolveSingleType(type, json, keyName) {
    if (type.kind === awesome_metadata_1.ETypes.CLASS) {
        return fromJson(type.ctor, json);
    }
    else if (type.kind === awesome_metadata_1.ETypes.INTERFACE) {
        // TODO: ATM does not implement interface resolution yet.
    }
    else if (type.kind === awesome_metadata_1.ETypes.PRIMITIVE) {
        if (type.primitive !== typeof json) {
            throw new IncompatibleSchemaError(`Expected ${keyName} of type ${type.primitive} and ${typeof json} found`);
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
                    throw new IncompatibleSchemaError(`Element ${keyName} did not pass these conditions: ${errorLeft}\n${errorRight}`);
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
    if (!body) {
        return hardcodedFromJson(theClass, json);
    }
    for (const k in body) {
        const el = body[k];
        if (!el.optional || k in json) {
            const type = el;
            result[k] = resolveSingleType(type, json[k], k);
            parsedKeys++;
        }
    }
    // Apply post validations:
    const postValidations = Reflect.getMetadata("tson:post", theClass);
    if (postValidations) {
        let err = null;
        for (const validator of postValidations) {
            err = err || validator(result);
            if (err) {
                throw err;
            }
        }
    }
    if (parsedKeys < originalAmountKeys) {
        throw new IncompatibleSchemaError("Object contains unexpected fields");
    }
    return result;
}
exports.fromJson = fromJson;
function hardcodedFromJson(theClass, json) {
    if (theClass === Date) {
        if (typeof json !== "string") {
            throw new IncompatibleSchemaError("Expected string representing a Date but " + typeof json + " found.");
        }
        const date = new Date(json);
        // TODO: Is this a correct way to determine if the date is correct or not?
        if (Number.isNaN(date.getDay())) {
            throw new IncompatibleSchemaError("Expected string represeting a Date but '" + json + "' does not represent a valid date.");
        }
        return date;
    }
    else if (theClass === Object) {
        if (typeof json !== "object") {
            throw new IncompatibleSchemaError("Expected any object but " + typeof json + " found.");
        }
        return json;
    }
}
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
    if (!body) {
        return hardcodedToJson(c);
    }
    for (const k in body) {
        const el = body[k];
        if (!el.optional || k in c) {
            const type = el;
            result[k] = extractSingleType(type, c[k]);
        }
    }
    return result;
}
exports.toJson = toJson;
function hardcodedToJson(c) {
    if (c instanceof Date) {
        return c.toISOString();
    }
    else if (c.constructor === Object) {
        const result = {};
        for (const k in c) {
            if (c.hasOwnProperty(k)) {
                const el = c[k];
                result[k] = hardcodedToJson(el);
            }
        }
        return result;
    }
}
exports.hardcodedToJson = hardcodedToJson;
//# sourceMappingURL=index.js.map