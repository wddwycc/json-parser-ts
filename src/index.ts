import { pipe } from 'fp-ts/lib/function'
import { parser as P, char as C } from 'parser-ts'
import { Parser } from 'parser-ts/lib/Parser'
import { JSONString } from './model'

/**
 * Backspace is replaced with \b
 * Form feed is replaced with \f
 * Newline is replaced with \n
 * Carriage return is replaced with \r
 * Tab is replaced with \t
 * Double quote is replaced with \"
 * Backslash is replaced with \\
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

export const JSONStringParser: Parser<string, JSONString> = pipe(
  C.char('"'),
  P.chain(() =>
    C.many(
      pipe(
        C.alphanum,
        P.alt(() => C.space),
        P.alt(() => JSONStringEscapesParser)
      )
    )
  ),
  P.apFirst(C.char('"')),
  P.map((value): JSONString => ({ _tag: 'string', value }))
)
// export const JSONNumberParser =

export const JSONObjectParser = pipe(C.char('{'), P.apSecond(P.many1(C.space)))

// export const parse = () => {
//   pipe(S.int)
//   // S.int(12)
//   // TODO
// }
