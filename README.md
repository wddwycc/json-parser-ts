# json-parser-ts

[![npm version](https://img.shields.io/npm/v/json-parser-ts.svg?style=flat)](https://www.npmjs.com/package/json-parser-ts) ![CI](https://github.com/wddwycc/json-parser-ts/workflows/CI/badge.svg)

A type-safe combinator-based JSON parser. (it's far from RFC 8259 compliant, don't use in production)

## Install

```shell
npm i json-parser-ts
```

## Interfaces

```typescript
import * as J from 'json-parser-ts'

const res = J.parse(jsonStr)
```

The parse function returns `E.Either<string, JSON>`, while JSON is parsed as nested tagged union, see [model.ts](https://github.com/wddwycc/json-parser-ts/blob/main/src/model.ts) for detail

```typescript
export type JSONValue =
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
