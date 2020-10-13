import { pipe } from 'fp-ts/lib/function'
import { char as C, parser as P, string as S } from 'parser-ts'

import {
  JSON,
  JSONArray,
  JSONNumber,
  JSONObject,
  JSONString,
  JSONValue
} from './model'
import { JSONStringEscapesParser } from './utils'

export const JSONStringParser = pipe(
  C.char('"'),
  P.chain(() =>
    C.many(
      pipe(
        C.notOneOf('"\\'),
        P.alt(() => JSONStringEscapesParser)
      )
    )
  ),
  P.apFirst(C.char('"')),
  P.map((value): JSONString => ({ _tag: 'string', value }))
)
export const JSONNumberParser = pipe(
  S.float,
  P.alt(() => S.int),
  P.map((value): JSONNumber => ({ _tag: 'number', value }))
)
export const JSONNullParser = pipe(
  S.string('null'),
  P.map((): JSONValue => ({ _tag: 'null' }))
)
export const JSONBooleanParser = pipe(
  S.string('true'),
  P.map(() => true),
  P.alt(() =>
    pipe(
      S.string('false'),
      P.map(() => false)
    )
  ),
  P.map((value): JSONValue => ({ _tag: 'boolean', value }))
)

const Trimmer = C.many(
  pipe(
    C.space,
    P.alt(() => C.char('\n'))
  )
)

export const JSONValueParser = pipe(
  JSONStringParser as P.Parser<string, JSONValue>,
  P.alt((): P.Parser<string, JSONValue> => JSONNumberParser),
  P.alt((): P.Parser<string, JSONValue> => JSONBooleanParser),
  P.alt((): P.Parser<string, JSONValue> => JSONNullParser),
  P.alt((): P.Parser<string, JSONValue> => JSONObjectParser),
  P.alt((): P.Parser<string, JSONValue> => JSONArrayParser)
)

export const JSONObjectParser = pipe(
  Trimmer,
  P.apFirst(C.char('{')),
  P.apFirst(Trimmer),
  P.apSecond(
    pipe(
      JSONStringParser,
      P.map(a => a.value)
    )
  ),
  P.bindTo('key'),
  P.apFirst(Trimmer),
  P.apFirst(C.char(':')),
  P.apFirst(Trimmer),
  P.bind('value', () => JSONValueParser),
  P.apFirst(Trimmer),
  P.apFirst(C.char('}')),
  P.apFirst(Trimmer),
  P.map((data): JSONObject => ({ _tag: 'object', ...data }))
)

export const JSONArrayParser = pipe(
  Trimmer,
  P.apFirst(C.char('[')),
  P.apFirst(Trimmer),
  P.apSecond(
    P.sepBy(
      pipe(Trimmer, P.apFirst(C.char(',')), P.apFirst(Trimmer)),
      JSONValueParser
    )
  ),
  P.apFirst(Trimmer),
  P.apFirst(C.char(']')),
  P.apFirst(Trimmer),
  P.map((value): JSONArray => ({ _tag: 'array', value }))
)

export const JSONParser = pipe(
  JSONObjectParser as P.Parser<string, JSON>,
  P.alt((): P.Parser<string, JSON> => JSONArrayParser)
)
