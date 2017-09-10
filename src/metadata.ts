// tslint:disable
import "reflect-metadata";
import {ValidationError, IncompatibleSchemaError} from "./index";
import {Cclass2, Cclass, Cclass3, Cclass4, Union1Class, Union2Class, UnionClass, DateClass} from "./test/basic";
Reflect.defineMetadata("atm:body", {key: {type: {kind:0,primitive: "string"}, visibility: 1, optional: false},pMessage: {type: {kind:0,primitive: "string"}, visibility: 2, optional: false},}, ValidationError);
Reflect.defineMetadata("atm:body", {}, IncompatibleSchemaError);
Reflect.defineMetadata("atm:body", {a: {type: {kind:0,primitive: "string"}, visibility: 1, optional: false},z: {type: {kind:0,primitive: "number"}, visibility: 1, optional: false},}, Cclass2);
Reflect.defineMetadata("atm:body", {x: {type: {kind:0,primitive: "string"}, visibility: 1, optional: false},y: {type: {kind:2,ctor:Cclass2}, visibility: 1, optional: false},}, Cclass);
Reflect.defineMetadata("atm:body", {a: {type: {kind:0,primitive: "number"}, visibility: 1, optional: false},z: {type: {kind:0,primitive: "number"}, visibility: 1, optional: false},}, Cclass3);
Reflect.defineMetadata("atm:body", {z: {type: {kind:0,primitive: "number"}, visibility: 1, optional: false},a: {type: {kind:0,primitive: "number"}, visibility: 1, optional: false},}, Cclass4);
Reflect.defineMetadata("atm:body", {c1: {type: {kind:0,primitive: "number"}, visibility: 2, optional: false},c2: {type: {kind:0,primitive: "string"}, visibility: 2, optional: false},}, Union1Class);
Reflect.defineMetadata("atm:body", {c1: {type: {kind:0,primitive: "number"}, visibility: 2, optional: false},c2: {type: {kind:0,primitive: "number"}, visibility: 2, optional: false},}, Union2Class);
Reflect.defineMetadata("atm:body", {union: {type: {kind:3,left:{kind:2,ctor:Union1Class},right:{kind:2,ctor:Union2Class}}, visibility: 1, optional: false},}, UnionClass);
Reflect.defineMetadata("atm:body", {x: {type: {kind:2,ctor:Date}, visibility: 1, optional: false},}, DateClass);

