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
const chai_1 = require("chai");
require("mocha");
const TSON = require("../index");
const awesome_metadata_1 = require("awesome-metadata");
class Cclass2 {
    constructor(a, z) {
        this.a = a;
        this.z = z;
    }
    __metadataDummyMethod() {
    }
}
__decorate([
    awesome_metadata_1.DecoratorInjectMetadata("atm:body", { a: { kind: 0, primitive: "string" }, z: { kind: 0, primitive: "number" } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Cclass2.prototype, "__metadataDummyMethod", null);
exports.Cclass2 = Cclass2;
class Cclass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    __metadataDummyMethod() {
    }
}
__decorate([
    awesome_metadata_1.DecoratorInjectMetadata("atm:body", { x: { kind: 0, primitive: "string" }, y: { kind: 2, ctor: Cclass2, generics: [] } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Cclass.prototype, "__metadataDummyMethod", null);
exports.Cclass = Cclass;
class Cclass3 {
    constructor(a, z) {
        this.a = a;
        this.z = z;
    }
    __metadataDummyMethod() {
    }
}
__decorate([
    awesome_metadata_1.DecoratorInjectMetadata("atm:body", { a: { kind: 0, primitive: "number" }, z: { kind: 0, primitive: "number" } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Cclass3.prototype, "__metadataDummyMethod", null);
exports.Cclass3 = Cclass3;
class Cclass4 {
    // Wrong order: arguments must be alphabetically sorted.
    constructor(z, a) {
        this.z = z;
        this.a = a;
    }
    __metadataDummyMethod() {
    }
}
__decorate([
    awesome_metadata_1.DecoratorInjectMetadata("atm:body", { z: { kind: 0, primitive: "number" }, a: { kind: 0, primitive: "number" } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Cclass4.prototype, "__metadataDummyMethod", null);
exports.Cclass4 = Cclass4;
class Union1Class {
    __metadataDummyMethod() {
    }
}
__decorate([
    awesome_metadata_1.DecoratorInjectMetadata("atm:body", { c1: { kind: 0, primitive: "number" }, c2: { kind: 0, primitive: "string" } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Union1Class.prototype, "__metadataDummyMethod", null);
exports.Union1Class = Union1Class;
class Union2Class {
    __metadataDummyMethod() {
    }
}
__decorate([
    awesome_metadata_1.DecoratorInjectMetadata("atm:body", { c1: { kind: 0, primitive: "number" }, c2: { kind: 0, primitive: "number" } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Union2Class.prototype, "__metadataDummyMethod", null);
exports.Union2Class = Union2Class;
class UnionClass {
    __metadataDummyMethod() {
    }
}
__decorate([
    awesome_metadata_1.DecoratorInjectMetadata("atm:body", { union: { kind: 3, and: false, left: { kind: 2, ctor: Union1Class, generics: [] }, right: { kind: 2, ctor: Union2Class, generics: [] } } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UnionClass.prototype, "__metadataDummyMethod", null);
exports.UnionClass = UnionClass;
class DateClass {
    constructor(x) {
        this.x = x;
    }
    __metadataDummyMethod() {
    }
}
__decorate([
    awesome_metadata_1.DecoratorInjectMetadata("atm:body", { x: { kind: 2, ctor: Date, generics: [] } }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DateClass.prototype, "__metadataDummyMethod", null);
exports.DateClass = DateClass;
describe("ATM tests", () => {
    it("Serialize/deserialize class gets equality", () => {
        const x = { x: "1", y: { a: "2", z: 14 } };
        const y = TSON.fromJson(Cclass, { x: "1", y: { a: "2", z: 14 } });
        chai_1.expect(x).to.be.deep.eq(y);
        y.ayylmaot = "15";
        const z = TSON.toJson(y);
        chai_1.expect(x).to.be.deep.eq(z);
    });
    it("Wrong structure throws exception", () => {
        chai_1.expect(TSON.fromJson.bind(null, Cclass, {})).to.throw(TSON.IncompatibleSchemaError);
    });
    it("Instanceof work with fromJson classes", () => {
        const x = { x: "1", y: { a: "2", z: 14 } };
        const y = TSON.fromJson(Cclass, { x: "1", y: { a: "2", z: 14 } });
        chai_1.expect(y).to.be.instanceof(Cclass);
    });
    it("Test class with union types", () => {
        const u1 = { c1: 14, c2: "27" };
        const u2 = { c1: 14, c2: 27 };
        const uerr = { c1: "14", c2: "27" };
        const c1 = TSON.fromJson(UnionClass, { union: u1 });
        const c2 = TSON.fromJson(UnionClass, { union: u2 });
        chai_1.expect(c1.union).to.be.deep.eq(u1);
        chai_1.expect(c2.union).to.be.deep.eq(u2);
        chai_1.expect(c1).to.be.instanceof(UnionClass);
        chai_1.expect(c2).to.be.instanceof(UnionClass);
        chai_1.expect(c1.union).to.be.instanceof(Union1Class);
        chai_1.expect(c2.union).to.be.instanceof(Union2Class);
        chai_1.expect(TSON.fromJson.bind(null, UnionClass, { union: uerr })).to.throw();
    });
    it("Serializing dates", () => {
        const date = new Date();
        const c1 = new DateClass(date);
        const u1 = TSON.toJson(c1);
        const c2 = TSON.fromJson(DateClass, u1);
        chai_1.expect(c2.x.getTime()).to.be.equal(c1.x.getTime());
    });
});
//# sourceMappingURL=basic.js.map