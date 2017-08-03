import * as TSON from "../index";
import { expect } from "chai";
import "mocha";

@TSON.TSonSerializable
@TSON.TSonArguments("a", "z")
class Cclass2 {
  constructor(public a: string, public z: number) {

  }
}

@TSON.TSonSerializable
@TSON.TSonArguments("x", "y")
class Cclass {
  constructor(public x: string, public y: Cclass2) {

  }
}

@TSON.TSonSerializable
class Cclass3 {
  constructor(public a: number, public z: number) {

  }
}

@TSON.TSonSerializable
class Cclass4 {
  // Wrong order: arguments must be alphabetically sorted. 
  constructor(public z: number, public a: number) {

  }
}

describe("Basic tests", () => {
  it("Serialize/deserialize class gets equality", () => {
    const x = { x: "1", y: { a: "2", z: 14 } };
    const y = TSON.fromJson(Cclass, { x: "1", y: { a: "2", z: 14 } });
    const z = TSON.toJson(x);
    expect(x).to.be.deep.eq(z);
  });

  it("Wrong structure throws exception", () => {
    expect(TSON.fromJson.bind(null, Cclass, {})).to.throw(TSON.IncompatibleSchemaError);
  })

});

describe("No TsonArguments used", () => {
  it("Corret sorting of arguments using fromJson", () => {
    const a = Math.random();
    const z = Math.random();
    const class3 = TSON.fromJson(Cclass3, {a, z}); 
    expect(class3.a).to.be.eq(a);    
    expect(class3.z).to.be.eq(z);    
  });

  it("toJson gets every ownProperty", () => {
    const a = ""+Math.random();
    const z = Math.random();
    const class3 = new Cclass2(a,z);
    const serialized = TSON.toJson(class3);
    expect(serialized.a).to.be.eq(a);
    expect(serialized.z).to.be.eq(z);
    expect(Object.keys(serialized).length).to.be.eq(2);
  });
}) 