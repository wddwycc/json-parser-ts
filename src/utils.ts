import { char as C, parser as P } from 'parser-ts'
import { ParseResult } from 'parser-ts/lib/ParseResult'
import { stream } from 'parser-ts/lib/Stream'

export type ExtractParserRight<T> = T extends P.Parser<any, infer R> ? R : never

export const runParser = <A>(
  p: P.Parser<C.Char, A>,
  s: string
): ParseResult<C.Char, A> => p(stream(s.split('')))
