import * as E from 'fp-ts/lib/Either'
import { flow, identity, pipe } from 'fp-ts/lib/function'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Record'
import { char as C } from 'parser-ts'
import { ParseError } from 'parser-ts/lib/ParseResult'

import { JSON } from './model'
import { JSONParser } from './parsers'
import { runParser } from './utils'

export type Err =
  | {
      type: 'jsErr'
      value: unknown
    }
  | {
      type: 'parseErr'
      value: ParseError<C.Char>
    }

export const parse = (src: string) =>
  pipe(
    E.tryCatch(
      () =>
        pipe(
          runParser(JSONParser, src),
          E.mapLeft((value): Err => ({ type: 'parseErr', value })),
        ),
      (value): Err => ({ type: 'jsErr', value }),
    ),
    E.chain(identity),
  )

export const flatten = (
  src: JSON,
): string | number | boolean | null | object => {
  switch (src._tag) {
    case 'string':
      return src.value
    case 'number':
      return src.value
    case 'boolean':
      return src.value
    case 'null':
      return null
    case 'object':
      return pipe(
        src.value,
        NEA.fromArray,
        O.map(
          flow(
            NEA.groupBy(a => a.key),
            R.map(NEA.last),
            R.map(a => flatten(a.value)),
          ),
        ),
        O.getOrElse(() => ({})),
      )
    case 'array':
      return src.value.map(flatten)
  }
}
