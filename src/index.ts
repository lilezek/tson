/**
 * TSON for using with Awesome Typescript Metadata Emitter: https://github.com/lilezek/awesome-metadata
 */
import { ETypes, IBody, IClassType, IInterfaceType, IPrimitiveType, IUnionType } from "awesome-metadata";
import { expect } from "chai";
import "reflect-metadata";

// tslint:disable-next-line:no-namespace
declare global {
  export namespace Reflect {
    export function getMetadata<T = any>(key: "tson:post", target: { new(...args: any[]): T }): Array<(target: T) => ValidationError | undefined> | undefined;
  }
}

export class ValidationError extends Error {
  public key: string;
  private pMessage: string;

  public set message(v: string) {
    this.pMessage = v;
  }

  public get message() {
    return this.pMessage + ", of " + this.key + " field.";
  }
}

export type ValidatorFunction<V> = (val: V) => ValidationError | undefined;

export class IncompatibleSchemaError extends Error {

}

function resolveSingleType(type: IClassType | IUnionType | IPrimitiveType | IInterfaceType,
                           json: any,
                           keyName: string): any {
  if (type.kind === ETypes.CLASS) {
    return fromJson(type.ctor, json);
  } else if (type.kind === ETypes.INTERFACE) {
    // TODO: ATM does not implement interface resolution yet.
  } else if (type.kind === ETypes.PRIMITIVE) {
    if (type.primitive !== typeof json) {
      throw new IncompatibleSchemaError(`Expected ${keyName} of type ${type.primitive} and ${typeof json} found`);
    }
    return json;
  } else if (type.kind === ETypes.UNION) {
    let errorLeft = "";
    let errorRight = "";
    if (!type.and) {
      try {
        return resolveSingleType(type.left, json, keyName);
      } catch (err) {
        errorLeft = err.message;
        try {
          return resolveSingleType(type.right, json, keyName);
        } catch (err2) {
          errorRight = err.message;
          // tslint:disable-next-line:max-line-length
          throw new IncompatibleSchemaError(`Element ${keyName} did not pass these conditions: ${errorLeft}\n${errorRight}`);
        }
      }
    } else {
      // TODO: Implement Intersections.
    }
  }
}

export function fromJson<T>(theClass: { prototype: any, new(...args: any[]): T }, json: any) {
  // Construct without calling constructor:
  const result = {} as any;
  Object.setPrototypeOf(result, theClass.prototype);

  // Traverse body:
  const originalAmountKeys = Object.keys(json).length;
  let parsedKeys = 0;
  const body = Reflect.getMetadata("atm:body", theClass) as IBody;
  if (!body) {
    return hardcodedFromJson(theClass, json) as T;
  }
  for (const k in body) {
    const el = body[k];
    if (!el.optional || k in json) {
      const type = el.type;
      result[k] = resolveSingleType(type, json[k], k);
      parsedKeys++;
    }
  }

  // Apply post validations:
  const postValidations = Reflect.getMetadata<T>("tson:post", theClass);

  if (postValidations) {
    const err = postValidations.reduce((error, validator) => error || validator(result), undefined);
    if (err) {
      throw err;
    }
  }

  if (parsedKeys < originalAmountKeys) {
    throw new IncompatibleSchemaError("Object contains unexpected fields");
  }
  return result as T;
}

function hardcodedFromJson(theClass: any, json: any) {
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
  } else if (theClass === Object) {
    if (typeof json !== "object") {
      throw new IncompatibleSchemaError("Expected any object but " + typeof json + " found.");
    }
    return json;
  }
}

function extractSingleType(type: IClassType | IUnionType | IPrimitiveType | IInterfaceType,
                           json: any): any {
  if (type.kind === ETypes.CLASS) {
    return toJson(json);
  } else if (type.kind === ETypes.INTERFACE) {
    // TODO: ATM does not implement interface resolution yet.
    return {};
  } else if (type.kind === ETypes.PRIMITIVE) {
    return json;
  } else if (type.kind === ETypes.UNION) {
    if (!type.and) {
      // TODO: Serialize unions.
    } else {
      // TODO: Serialize Intersections.
    }
  }
}

export function toJson(c: { constructor: Function }) {
  const result = {} as any;

  // Traverse body:
  const body = Reflect.getMetadata("atm:body", c.constructor) as IBody;
  if (!body) {
    return hardcodedToJson(c);
  }
  for (const k in body) {
    const el = body[k];
    if (!el.optional || k in c) {
      const type = el.type;
      result[k] = extractSingleType(type, (c as any)[k]);
    }
  }
  return result;
}

export function hardcodedToJson(c: { constructor: Function }) {
  if (c instanceof Date) {
    return c.toISOString();
  } else if (c.constructor === Object) {
    const result = {} as any;
    for (const k in c) {
      if (c.hasOwnProperty(k)) {
        const el = (c as any)[k];
        result[k] = hardcodedToJson(el);
      }
    }
    return result;
  }
}
