/**
 * TSON for using with typescript decorators
 */
import { expect } from "chai";
import "reflect-metadata";

/**
 * Error representing incompatible schema with data.
 */
export class IncompatibleSchemaError extends Error {

}

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

export function fromJson<T>(theClass: { prototype: any, new(...args: any[]): T }, json: any) {
  const jsonCopy = Object.assign({}, json);
  let keys = Reflect.getMetadata("TSonArguments", theClass) as (string[] | undefined);
  if (!keys) {
    keys = Object.keys(jsonCopy).sort();
  }
  const constructorSignature = Reflect.getMetadata("design:paramtypes", theClass);
  for (let i = 0; i < keys.length; i++) {
    const objectType = typeof jsonCopy[keys[i]];
    const constructorType = constructorSignature[i];
    if (objectType === "object" && Reflect.getMetadata("isTsonSerializable", constructorType)) {
      jsonCopy[keys[i]] = fromJson(constructorType, jsonCopy[keys[i]]);
    } else if (basicMappings[objectType] !== constructorType) {
      throw new IncompatibleSchemaError("Incompatible type " + keys[i] + " should be an " + constructorType);
    }
  }
  // tslint:disable-next-line:new-parens
  return new (Function.prototype.bind.apply(theClass, [null].concat(keys.map((k) => jsonCopy[k])))) as T;
}

export function toJson(c: { constructor: Function }) {
  const args = Reflect.getMetadata("TSonArguments", c);
  const result = {} as any;
  if (args) {
    for (const arg of args) {
      const obj = (c as any)[arg];
      if (typeof obj === "object" && obj.constrctor && Reflect.getMetadata("isTsonSerializable", obj.constructor)) {
        result[arg] = toJson(obj);
      } else {
        result[arg] = obj;
      }
    }
  } else {
    for (const k in c) {
      const obj = (c as any)[k];
      if (typeof obj === "object" && obj.constructor && Reflect.getMetadata("isTsonSerializable", obj.constructor)) {
        result[k] = toJson(obj);
      } else {
        result[k] = obj;
      }
    }
  }
  return result;
}

export function TSonSerializable(c: any) {
  Reflect.defineMetadata("isTsonSerializable", true, c);
}

export function TSonArguments(...args: string[]) {
  return (c: any) => {
    Reflect.defineMetadata("TSonArguments", args, c);
  };
}
