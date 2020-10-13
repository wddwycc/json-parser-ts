import * as assert from 'assert'
import { pipe } from 'fp-ts/lib/function'
import * as J from '../src'
import * as E from 'fp-ts/lib/Either'

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
  it('example1', () => {
    const res = pipe(J.parse(exampleJSON1), E.map(J.flatten))
    assert.deepStrictEqual(res, E.right({ book: [1, 2, 3] }))
  })
  it('example2', () => {
    console.log(J.parse(exampleJSON2))
    assert.strictEqual(pipe(J.parse(exampleJSON2), E.isRight), true)
  })
})
