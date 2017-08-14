import { expect } from "chai";
import "mocha";
import * as TSONa from "../atm";
import * as TSONd from "../decorator";

@TSONd.TSonSerializable
@TSONd.TSonArguments("a", "z")
export class Cclass2 {
  constructor(public a: string, public z: number) {

  }
}

@TSONd.TSonSerializable
@TSONd.TSonArguments("x", "y")
export class Cclass {
  constructor(public x: string, public y: Cclass2) {

  }
}

@TSONd.TSonSerializable
export class Cclass3 {
  constructor(public a: number, public z: number) {

  }
}

@TSONd.TSonSerializable
export class Cclass4 {
  // Wrong order: arguments must be alphabetically sorted.
  constructor(public z: number, public a: number) {

  }
}

export class Union1Class {
  private c1: number;
  private c2: string;
}

export class Union2Class {
  private c1: number;
  private c2: number;
}

export class UnionClass {
  public union: Union1Class | Union2Class;
}

import "../metadata";

describe("Basic tests", () => {
  it("Serialize/deserialize class gets equality", () => {
    const x = { x: "1", y: { a: "2", z: 14 } };
    const y = TSONd.fromJson(Cclass, { x: "1", y: { a: "2", z: 14 } });
    const z = TSONd.toJson(x);
    expect(x).to.be.deep.eq(z);
  });

  it("Wrong structure throws exception", () => {
    expect(TSONd.fromJson.bind(null, Cclass, {})).to.throw(TSONd.IncompatibleSchemaError);
  });

});

describe("No TsonArguments used", () => {
  it("Corret sorting of arguments using fromJson", () => {
    const a = Math.random();
    const z = Math.random();
    const class3 = TSONd.fromJson(Cclass3, { a, z });
    expect(class3.a).to.be.eq(a);
    expect(class3.z).to.be.eq(z);
  });

  it("toJson gets every ownProperty", () => {
    const a = "" + Math.random();
    const z = Math.random();
    const class3 = new Cclass2(a, z);
    const serialized = TSONd.toJson(class3);
    expect(serialized.a).to.be.eq(a);
    expect(serialized.z).to.be.eq(z);
    expect(Object.keys(serialized).length).to.be.eq(2);
  });

  it("Instanceof work with fromJson classes", () => {
    const x = { x: "1", y: { a: "2", z: 14 } };
    const y = TSONd.fromJson(Cclass, { x: "1", y: { a: "2", z: 14 } });
    expect(y).to.be.instanceof(Cclass);
  });
});

describe("ATM tests", () => {
  it("Serialize/deserialize class gets equality", () => {
    const x = { x: "1", y: { a: "2", z: 14 } };
    const y = TSONa.fromJson(Cclass, { x: "1", y: { a: "2", z: 14 } });
    expect(x).to.be.deep.eq(y);
    (y as any).ayylmaot = "15";
    const z = TSONa.toJson(y);
    expect(x).to.be.deep.eq(z);
  });

  it("Wrong structure throws exception", () => {
    expect(TSONa.fromJson.bind(null, Cclass, {})).to.throw(TSONa.IncompatibleSchemaError);
  });

  it("Instanceof work with fromJson classes", () => {
    const x = { x: "1", y: { a: "2", z: 14 } };
    const y = TSONa.fromJson(Cclass, { x: "1", y: { a: "2", z: 14 } });
    expect(y).to.be.instanceof(Cclass);
  });

  it("Test class with union types", () => {
    const u1 = {c1: 14, c2: "27"};
    const u2 = {c1: 14, c2: 27};
    const uerr = {c1: "14", c2: "27"};

    const c1 = TSONa.fromJson(UnionClass, {union: u1});
    const c2 = TSONa.fromJson(UnionClass, {union: u2});

    expect(c1.union).to.be.deep.eq(u1);
    expect(c2.union).to.be.deep.eq(u2);
    expect(c1).to.be.instanceof(UnionClass);
    expect(c2).to.be.instanceof(UnionClass);
    expect(c1.union).to.be.instanceof(Union1Class);
    expect(c2.union).to.be.instanceof(Union2Class);
    expect(TSONa.fromJson.bind(null, UnionClass, {union: uerr})).to.throw();
  });
});
