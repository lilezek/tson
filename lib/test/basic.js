"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const TSON = require("../index");
class Cclass2 {
    constructor(a, z) {
        this.a = a;
        this.z = z;
    }
}
exports.Cclass2 = Cclass2;
class Cclass {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.Cclass = Cclass;
class Cclass3 {
    constructor(a, z) {
        this.a = a;
        this.z = z;
    }
}
exports.Cclass3 = Cclass3;
class Cclass4 {
    // Wrong order: arguments must be alphabetically sorted.
    constructor(z, a) {
        this.z = z;
        this.a = a;
    }
}
exports.Cclass4 = Cclass4;
class Union1Class {
}
exports.Union1Class = Union1Class;
class Union2Class {
}
exports.Union2Class = Union2Class;
class UnionClass {
}
exports.UnionClass = UnionClass;
require("../metadata");
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
});
//# sourceMappingURL=basic.js.map