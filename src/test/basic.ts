import { expect } from "chai";
import "mocha";
import * as TSON from "../index";

export class Cclass2 {
  constructor(public a: string, public z: number) {

  }
}

export class Cclass {
  constructor(public x: string, public y: Cclass2) {

  }
}

export class Cclass3 {
  constructor(public a: number, public z: number) {

  }
}

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

export class DateClass {
  constructor(public x: Date) {

  }
}

import "../metadata";

describe("ATM tests", () => {
  it("Serialize/deserialize class gets equality", () => {
    const x = { x: "1", y: { a: "2", z: 14 } };
    const y = TSON.fromJson(Cclass, { x: "1", y: { a: "2", z: 14 } });
    expect(x).to.be.deep.eq(y);
    (y as any).ayylmaot = "15";
    const z = TSON.toJson(y);
    expect(x).to.be.deep.eq(z);
  });

  it("Wrong structure throws exception", () => {
    expect(TSON.fromJson.bind(null, Cclass, {})).to.throw(TSON.IncompatibleSchemaError);
  });

  it("Instanceof work with fromJson classes", () => {
    const x = { x: "1", y: { a: "2", z: 14 } };
    const y = TSON.fromJson(Cclass, { x: "1", y: { a: "2", z: 14 } });
    expect(y).to.be.instanceof(Cclass);
  });

  it("Test class with union types", () => {
    const u1 = {c1: 14, c2: "27"};
    const u2 = {c1: 14, c2: 27};
    const uerr = {c1: "14", c2: "27"};

    const c1 = TSON.fromJson(UnionClass, {union: u1});
    const c2 = TSON.fromJson(UnionClass, {union: u2});

    expect(c1.union).to.be.deep.eq(u1);
    expect(c2.union).to.be.deep.eq(u2);
    expect(c1).to.be.instanceof(UnionClass);
    expect(c2).to.be.instanceof(UnionClass);
    expect(c1.union).to.be.instanceof(Union1Class);
    expect(c2.union).to.be.instanceof(Union2Class);
    expect(TSON.fromJson.bind(null, UnionClass, {union: uerr})).to.throw();
  });

  it("Serializing dates", () => {
    const date = new Date();
    const c1 = new DateClass(date);

    const u1 = TSON.toJson(c1);
    const c2 = TSON.fromJson(DateClass, u1);

    expect(c2.x.getTime()).to.be.equal(c1.x.getTime());
  });
});
