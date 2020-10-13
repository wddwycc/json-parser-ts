import { pipe } from 'fp-ts/lib/function'
import { parser as P, char as C, string as S } from 'parser-ts'
import { JSONValue } from './model'

/**
 * * Backspace is replaced with `\b`
 * * Form feed is replaced with `\f`
 * * Newline is replaced with `\n`
 * * Carriage return is replaced with `\r`
 * * Tab is replaced with `\t`
 * * Double quote is replaced with `\"`
 * * Backslash is replaced with `\\`
 */
export const JSONStringEscapesParser = pipe(
  C.char('\\'),
  P.chain(() =>
    pipe(
      // impl with recursion
      pipe(
        C.char('b'),
        P.map(() => '\b')
      ),
      P.alt(() =>
        pipe(
          C.char('f'),
          P.map(() => '\f')
        )
      ),
      P.alt(() =>
        pipe(
          C.char('n'),
          P.map(() => '\n')
        )
      ),
      P.alt(() =>
        pipe(
          C.char('r'),
          P.map(() => '\r')
        )
      ),
      P.alt(() =>
        pipe(
          C.char('t'),
          P.map(() => '\t')
        )
      ),
      P.alt(() =>
        pipe(
          C.char('"'),
          P.map(() => '"')
        )
      ),
      P.alt(() =>
        pipe(
          C.char('\\'),
          P.map(() => '\\')
        )
      )
    )
  )
)

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
  P.map((value): JSONValue => ({ _tag: 'string', value }))
)
export const JSONNumberParser = pipe(
  S.float,
  P.alt(() => S.int),
  P.map((value): JSONValue => ({ _tag: 'number', value }))
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

export const JSONValueParser = pipe(
  JSONStringParser,
  P.alt(() => JSONNumberParser),
  P.alt(() => JSONBooleanParser),
  P.alt(() => JSONNullParser)
)

export const JSONArrayParser = pipe(C.char(''))

// export const JSONObjectParser = pipe(C.char('{'), P.apSecond(P.many1(C.space)))

// export const parse = () => {
//   pipe(S.int)
//   // S.int(12)
//   // TODO
// }
