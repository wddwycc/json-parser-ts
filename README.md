# json-parser-ts

[![npm version](https://img.shields.io/npm/v/json-parser-ts.svg?style=flat)](https://www.npmjs.com/package/json-parser-ts) ![CI](https://github.com/wddwycc/json-parser-ts/workflows/CI/badge.svg)

A type-safe combinator-based native JSON parser.  
It's [RFC 8259](https://tools.ietf.org/html/rfc8259) compliant, well tested using dataset from [JSONTestSuite](https://github.com/nst/JSONTestSuite)

## Install

```shell
npm i json-parser-ts
```

## Interfaces

```typescript
import * as J from 'json-parser-ts'

const res = J.parse(jsonStr)
```

The parse function returns `E.Either<Err, JSON>`, while JSON is parsed as nested tagged union, see [model.ts](https://github.com/wddwycc/json-parser-ts/blob/main/src/model.ts) for detail

```typescript
export type JSON =
  | JSONObject
  | JSONArray
  | JSONString
  | JSONNumber
  | JSONBoolean
  | JSONNull
```

The lib also provides a `flatten` function to transform nested tagged union back to flat JavaScript object.

```typescript
import * as J from 'json-parser-ts'
import { pipe } from 'fp-ts/lib/function'
import * as E from 'fp-ts/lib/Either'

const res = pipe(J.parse(jsonStr), E.map(J.flatten))
```
