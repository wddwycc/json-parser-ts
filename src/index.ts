import { JSONValue } from './model'
import { JSONParser } from './parsers'
import { runParser } from './utils'

export const parse = (src: string) => runParser(JSONParser, src)

export const flatten = (
  src: JSONValue
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
      return { [src.key]: flatten(src) }
    case 'array':
      return src.value.map(flatten)
  }
}
