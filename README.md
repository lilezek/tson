![Code coverage](https://img.shields.io/codecov/c/github/lilezek/tson/master.svg)

# TSon

This is an aproach to get GSON (Google JSON seralization/deserialization) functionality into TypeScript.

This version uses [awesome-metadata](https://github.com/lilezek/awesome-metadata) to emit additional metadata for all classes.
If you don't want to use `awesome-metadata`, you can check the branch [decorator](https://github.com/lilezek/tson/tree/decorator) to use decorators instead. 

## Limitations

### This library does not (yet) work with interfaces

Awesome metadata does not yet emit information for interfaces, so there is no serialization/deserialization for classes which uses interfaces.

## Example of use

First, you have to emit metadata of classes using `atm` in your TypeScript project folder command:

```sh
node_modules/.bin/atm > metadata.ts
```

And then you have to import metadata anywhere in you code:

```ts
import "./metadata"
```

After doing this, you can use anywhere the library:

```ts
import * as TSON from "tson";

const el = new AnyClass(...);

// Serialize
const ser = TSON.toJson(el);

// Deserialize
const el2 = TSON.fromJson(AnyClass, ser);
```

## Bad deserialization

If you try to deserialize a class with a wrong JSON object, it will throw an `IncompatibleSchemaError`.