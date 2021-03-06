import { pipe } from 'fp-ts/lib/function'
import { char as C, parser as P, string as S } from 'parser-ts'

import {
  JSON,
  JSONArray,
  JSONBoolean,
  JSONNull,
  JSONNumber,
  JSONObject,
  JSONString,
} from './model'
import { JSONStringEscapesParser } from './utils'

const CTRL_CHAR_SET = [
  '\x00',
  '\x01',
  '\x02',
  '\x03',
  '\x04',
  '\x05',
  '\x06',
  '\x07',
  '\x08',
  '\x09',
  '\x0A',
  '\x0B',
  '\x0C',
  '\x0D',
  '\x0E',
  '\x0F',
  '\x10',
  '\x11',
  '\x12',
  '\x13',
  '\x14',
  '\x15',
  '\x16',
  '\x17',
  '\x18',
  '\x19',
  '\x1A',
  '\x1B',
  '\x1C',
  '\x1D',
  '\x1E',
  '\x1F',
]

export const JSONStringParser = pipe(
  C.char('"'),
  P.chain(() =>
    S.many(
      pipe(
        C.notOneOf(['"', '\\', ...CTRL_CHAR_SET].join('')),
        P.alt(() => JSONStringEscapesParser),
      ),
    ),
  ),
  P.apFirst(C.char('"')),
  P.map((value): JSONString => ({ _tag: 'string', value })),
)
export const JSONNumberParser = pipe(
  S.fold([
    S.maybe(C.char('-')),
    pipe(
      C.char('0'),
      P.alt(() => S.fold([C.oneOf('123456789'), C.many(C.digit)])),
    ),
    S.maybe(S.fold([C.char('.'), C.many1(C.digit)])),
    S.maybe(S.fold([C.oneOf('Ee'), S.maybe(C.oneOf('+-')), C.many1(C.digit)])),
  ]),
  P.map(s => +s),
  P.map((value): JSONNumber => ({ _tag: 'number', value })),
)

export const JSONNullParser = pipe(
  S.string('null'),
  P.map((): JSONNull => ({ _tag: 'null' })),
)
export const JSONBooleanParser = pipe(
  S.string('true'),
  P.map(() => true),
  P.alt(() =>
    pipe(
      S.string('false'),
      P.map(() => false),
    ),
  ),
  P.map((value): JSONBoolean => ({ _tag: 'boolean', value })),
)

const SpaceParser = C.many(C.oneOf(' \n'))

export const JSONValueParser = pipe(
  JSONStringParser as P.Parser<string, JSON>,
  P.alt((): P.Parser<string, JSON> => JSONNumberParser),
  P.alt((): P.Parser<string, JSON> => JSONBooleanParser),
  P.alt((): P.Parser<string, JSON> => JSONNullParser),
  P.alt((): P.Parser<string, JSON> => JSONObjectParser),
  P.alt((): P.Parser<string, JSON> => JSONArrayParser),
)

export const JSONObjectParser = pipe(
  SpaceParser,
  P.apFirst(C.char('{')),
  P.apFirst(SpaceParser),
  P.apSecond(
    P.sepBy(
      pipe(SpaceParser, P.apFirst(C.char(',')), P.apFirst(SpaceParser)),
      pipe(
        JSONStringParser,
        P.map(a => a.value),
        P.bindTo('key'),
        P.apFirst(SpaceParser),
        P.apFirst(C.char(':')),
        P.apFirst(SpaceParser),
        P.bind('value', () => JSONValueParser),
      ),
    ),
  ),
  P.apFirst(SpaceParser),
  P.apFirst(C.char('}')),
  P.apFirst(SpaceParser),
  P.map((data): JSONObject => ({ _tag: 'object', value: data })),
)

export const JSONArrayParser = pipe(
  SpaceParser,
  P.apFirst(C.char('[')),
  P.apFirst(SpaceParser),
  P.apSecond(
    P.sepBy(
      pipe(SpaceParser, P.apFirst(C.char(',')), P.apFirst(SpaceParser)),
      JSONValueParser,
    ),
  ),
  P.apFirst(SpaceParser),
  P.apFirst(C.char(']')),
  P.apFirst(SpaceParser),
  P.map((value): JSONArray => ({ _tag: 'array', value })),
)

export const JSONParser = pipe(JSONValueParser, P.apFirst(P.eof()))
