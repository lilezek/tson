import "mocha";
export declare class Cclass2 {
    a: string;
    z: number;
    constructor(a: string, z: number);
}
export declare class Cclass {
    x: string;
    y: Cclass2;
    constructor(x: string, y: Cclass2);
}
export declare class Cclass3 {
    a: number;
    z: number;
    constructor(a: number, z: number);
}
export declare class Cclass4 {
    z: number;
    a: number;
    constructor(z: number, a: number);
}
export declare class Union1Class {
    private c1;
    private c2;
}
export declare class Union2Class {
    private c1;
    private c2;
}
export declare class UnionClass {
    union: Union1Class | Union2Class;
}
export declare class DateClass {
    x: Date;
    constructor(x: Date);
}
import "../metadata";
