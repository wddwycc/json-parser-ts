import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { char as C, parser as P, string as S } from 'parser-ts'
import { ParseError } from 'parser-ts/lib/ParseResult'
import { stream } from 'parser-ts/lib/Stream'

export type ExtractParserRight<T> = T extends P.Parser<any, infer R> ? R : never

export const runParser = <A>(
  p: P.Parser<C.Char, A>,
  s: string,
): E.Either<ParseError<C.Char>, A> =>
  pipe(
    p(stream(s.split(''))),
    E.map(a => a.value),
  )

const hexCharParser = C.oneOf('0123456789abcdefABCDEF')

/**
 * * Double quote is replaced with `\"`
 * * Backslash is replaced with `\\`
 * * Backspace is replaced with `\b`
 * * Form feed is replaced with `\f`
 * * Newline is replaced with `\n`
 * * Carriage return is replaced with `\r`
 * * Tab is replaced with `\t`
 * * Unicode `\u0000`
 */
export const JSONStringEscapesParser = pipe(
  pipe(
    S.string('\\b'),
    P.map(() => '\b'),
  ),
  P.alt(() =>
    pipe(
      S.string('\\f'),
      P.map(() => '\f'),
    ),
  ),
  P.alt(() =>
    pipe(
      S.string('\\n'),
      P.map(() => '\n'),
    ),
  ),
  P.alt(() =>
    pipe(
      S.string('\\r'),
      P.map(() => '\r'),
    ),
  ),
  P.alt(() =>
    pipe(
      S.string('\\t'),
      P.map(() => '\t'),
    ),
  ),
  P.alt(() =>
    pipe(
      S.string('\\"'),
      P.map(() => '"'),
    ),
  ),
  P.alt(() =>
    pipe(
      S.string('\\\\'),
      P.map(() => '\\'),
    ),
  ),
  P.alt(() =>
    pipe(
      S.string('\\u'),
      P.apSecond(
        S.fold([hexCharParser, hexCharParser, hexCharParser, hexCharParser]),
      ),
      P.map(src => pipe(parseInt(src, 16), String.fromCharCode)),
    ),
  ),
)
