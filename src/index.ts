import { flow, pipe } from 'fp-ts/lib/function'
import * as NEA from 'fp-ts/lib/NonEmptyArray'
import * as O from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Record'

import { JSONValue } from './model'
import { JSONParser } from './parsers'
import { runParser } from './utils'

export const parse = (src: string) => runParser(JSONParser, src)

export const flatten = (
  src: JSONValue,
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
