![Code coverage](https://img.shields.io/codecov/c/github/lilezek/tson/master.svg)

# TSon

This is an aproach to get GSON (Google JSON seralization/deserialization) functionality into TypeScript.

## Limitations

### Mandatory decorators

TypeScript language limitations makes this library impossible to achieve the exactly functionality of GSON out-of-the-box, 
so by now we have to use some decorators in order to make this library work. 

Right now in TypeScript, it is not possible to do reflection in classes without decorate them. The compiler must use
`emitDecoratorMetadata` to get some information.

### Complex types and optional types are not supported

The emited metadata of TypeScript compiler converts this:

```typescript
constructor(public a: string|number)
```

into this:

```typescript
[Object]
```

And this:

```typescript
// Either mandatory:
constructor(public a: string)
// or optional
constructor(public a?: string)
```

into this:

```typescript
[String]
```

## Example of use

```typescript
import * as TSON from "tson";

// Decorate to mark this class as serializable by TSON.
@TSON.TSonSerializable
// Decorate to mark the names of the arguments 
@TSON.TSonArguments("a", "z")
class Cclass2 {
  constructor(public a: string, private z: number) {
    // Construct things
  }
}

// Decorate to mark this class as serializable by TSON.
@TSON.TSonSerializable
// Decorate to mark the names of the arguments 
@TSON.TSonArguments("x", "y")
class Cclass {
  constructor(public x: string, private y: Cclass2) {
    // Construct things
  }
}
```