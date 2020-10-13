import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'

import {
  JSONArrayParser,
  JSONBooleanParser,
  JSONNullParser,
  JSONNumberParser,
  JSONObjectParser,
  JSONStringParser
} from '../src/parsers'
import { runParser } from '../src/utils'

describe('parser', () => {
  it('JSONStringParser', () => {
    assert.deepStrictEqual(
      runParser(JSONStringParser, '"hello world"'),
      E.right({ _tag: 'string', value: 'hello world' })
    )
  })
  it('JSONNumberParser', () => {
    assert.deepStrictEqual(
      runParser(JSONNumberParser, '12'),
      E.right({ _tag: 'number', value: 12 })
    )
    assert.deepStrictEqual(
      runParser(JSONNumberParser, '12.32'),
      E.right({
        _tag: 'number',
        value: 12.32
      })
    )
  })
  it('JSONBooleanParser', () => {
    assert.deepStrictEqual(
      runParser(JSONBooleanParser, 'true'),
      E.right({ _tag: 'boolean', value: true })
    )
    assert.deepStrictEqual(
      runParser(JSONBooleanParser, 'false'),
      E.right({ _tag: 'boolean', value: false })
    )
  })
  it('JSONNullParser', () => {
    assert.deepStrictEqual(
      runParser(JSONNullParser, 'null'),
      E.right({ _tag: 'null' })
    )
  })
  it('JSONObjectParser', () => {
    assert.deepStrictEqual(
      runParser(JSONObjectParser, '{\n "a": "b" \n}'),
      E.right({
        _tag: 'object',
        key: 'a',
        value: { _tag: 'string', value: 'b' }
      })
    )
  })
  it('JSONArrayParser', () => {
    assert.deepStrictEqual(
      runParser(JSONArrayParser, '[1, 2,  3] '),
      E.right({
        _tag: 'array',
        value: [
          {
            _tag: 'number',
            value: 1
          },
          {
            _tag: 'number',
            value: 2
          },
          {
            _tag: 'number',
            value: 3
          }
        ]
      })
    )
  })
})
