/**
 * TSON for using with Awesome Typescript Metadata Emitter: https://github.com/lilezek/awesome-metadata
 */
import { ETypes, IBody, IClassType, IInterfaceType, IPrimitiveType, IUnionType } from "awesome-metadata";
import { expect } from "chai";
import "reflect-metadata";
import { IncompatibleSchemaError } from "./decorator";

export { IncompatibleSchemaError };

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
  for (const k in body) {
    const el = body[k];
    if (!el.optional || k in json) {
      const type = el.type;
      result[k] = resolveSingleType(type, json[k], k);
      parsedKeys++;
    }
  }
  if (parsedKeys < originalAmountKeys) {
    throw new IncompatibleSchemaError("Object contains unexpected fields");
  }
  return result as T;
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
  for (const k in body) {
    const el = body[k];
    if (!el.optional || k in c) {
      const type = el.type;
      result[k] = extractSingleType(type, (c as any)[k]);
    }
  }
  return result;
}
