import * as TSON from "../index";
import { expect } from "chai";
import "mocha";

@TSON.TSonSerializable
@TSON.TSonArguments("a", "z")
class Cclass2 {
  constructor(public a: string, private z: number) {
    console.log(a, z);
  }
}

@TSON.TSonSerializable
@TSON.TSonArguments("x", "y")
class Cclass {
  constructor(public x: string, private y: Cclass2) {
    console.log(x, y);
  }
}

describe("Basic tests", () => {
  it("2-deep class", () => {
    const x = { x: "1", y: { a: "2", z: 14 } };
    const y = TSON.fromJson(Cclass, { x: "1", y: { a: "2", z: 14 } });
    const z = TSON.toJson(x);
    expect(x).to.be.deep.eq(z);
  });
});