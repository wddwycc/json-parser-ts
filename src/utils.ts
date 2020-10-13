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
