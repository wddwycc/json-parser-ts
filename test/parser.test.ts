import * as assert from 'assert'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'

import * as J from '../src'

const exampleJSON1 = `
{
  "book": [ 1,2,3 ]
}
`
const exampleJSON2 = `
{
  "glossary": {
    "title": "example glossary",
    "GlossDiv": {
      "title": "S",
      "GlossList": {
        "GlossEntry": {
          "ID": "SGML",
          "SortAs": "SGML",
          "GlossTerm": "Standard Generalized Markup Language",
          "Acronym": "SGML",
          "Abbrev": "ISO 8879:1986",
          "GlossDef": {
            "para": "A meta-markup language, used to create markup languages such as DocBook.",
            "GlossSeeAlso": [
              "GML",
              "XML"
            ]
          },
          "GlossSee": "markup"
        }
      }
    }
  }
}
`

describe('Test interfaces', () => {
  it('test parse', () => {
    pipe(
      [exampleJSON1, exampleJSON2],
      A.map(jsonStr => {
        assert.deepStrictEqual(
          pipe(J.parse(jsonStr), E.map(J.flatten)),
          E.right(JSON.parse(jsonStr)),
        )
      }),
    )
  })
})
