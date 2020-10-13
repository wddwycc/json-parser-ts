import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { char as C, parser as P } from 'parser-ts'
import { ParseError } from 'parser-ts/lib/ParseResult'
import { stream } from 'parser-ts/lib/Stream'

export type ExtractParserRight<T> = T extends P.Parser<any, infer R> ? R : never

export const runParser = <A>(
  p: P.Parser<C.Char, A>,
  s: string
): E.Either<ParseError<C.Char>, A> =>
  pipe(
    p(stream(s.split(''))),
    E.map(a => a.value)
  )

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
