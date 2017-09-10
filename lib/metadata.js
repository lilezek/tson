"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
require("reflect-metadata");
const index_1 = require("./index");
const basic_1 = require("./test/basic");
Reflect.defineMetadata("atm:body", { key: { type: { kind: 0, primitive: "string" }, visibility: 1, optional: false }, pMessage: { type: { kind: 0, primitive: "string" }, visibility: 2, optional: false }, }, index_1.ValidationError);
Reflect.defineMetadata("atm:body", {}, index_1.IncompatibleSchemaError);
Reflect.defineMetadata("atm:body", { a: { type: { kind: 0, primitive: "string" }, visibility: 1, optional: false }, z: { type: { kind: 0, primitive: "number" }, visibility: 1, optional: false }, }, basic_1.Cclass2);
Reflect.defineMetadata("atm:body", { x: { type: { kind: 0, primitive: "string" }, visibility: 1, optional: false }, y: { type: { kind: 2, ctor: basic_1.Cclass2 }, visibility: 1, optional: false }, }, basic_1.Cclass);
Reflect.defineMetadata("atm:body", { a: { type: { kind: 0, primitive: "number" }, visibility: 1, optional: false }, z: { type: { kind: 0, primitive: "number" }, visibility: 1, optional: false }, }, basic_1.Cclass3);
Reflect.defineMetadata("atm:body", { z: { type: { kind: 0, primitive: "number" }, visibility: 1, optional: false }, a: { type: { kind: 0, primitive: "number" }, visibility: 1, optional: false }, }, basic_1.Cclass4);
Reflect.defineMetadata("atm:body", { c1: { type: { kind: 0, primitive: "number" }, visibility: 2, optional: false }, c2: { type: { kind: 0, primitive: "string" }, visibility: 2, optional: false }, }, basic_1.Union1Class);
Reflect.defineMetadata("atm:body", { c1: { type: { kind: 0, primitive: "number" }, visibility: 2, optional: false }, c2: { type: { kind: 0, primitive: "number" }, visibility: 2, optional: false }, }, basic_1.Union2Class);
Reflect.defineMetadata("atm:body", { union: { type: { kind: 3, left: { kind: 2, ctor: basic_1.Union1Class }, right: { kind: 2, ctor: basic_1.Union2Class } }, visibility: 1, optional: false }, }, basic_1.UnionClass);
Reflect.defineMetadata("atm:body", { x: { type: { kind: 2, ctor: Date }, visibility: 1, optional: false }, }, basic_1.DateClass);
//# sourceMappingURL=metadata.js.map