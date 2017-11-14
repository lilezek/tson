import "mocha";
export declare class Cclass2 {
    a: string;
    z: number;
    __metadataDummyMethod(): void;
    constructor(a: string, z: number);
}
export declare class Cclass {
    x: string;
    y: Cclass2;
    __metadataDummyMethod(): void;
    constructor(x: string, y: Cclass2);
}
export declare class Cclass3 {
    a: number;
    z: number;
    __metadataDummyMethod(): void;
    constructor(a: number, z: number);
}
export declare class Cclass4 {
    z: number;
    a: number;
    __metadataDummyMethod(): void;
    constructor(z: number, a: number);
}
export declare class Union1Class {
    __metadataDummyMethod(): void;
    private c1;
    private c2;
}
export declare class Union2Class {
    __metadataDummyMethod(): void;
    private c1;
    private c2;
}
export declare class UnionClass {
    __metadataDummyMethod(): void;
    union: Union1Class | Union2Class;
}
export declare class DateClass {
    x: Date;
    __metadataDummyMethod(): void;
    constructor(x: Date);
}
