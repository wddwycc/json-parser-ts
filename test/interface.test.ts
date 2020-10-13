import * as assert from 'assert'
import * as J from '../src'

const exampleJSON = `
{
  "book": [
     {
        "id": "01",
        "language": "Java",
        "edition": "third",
        "author": "Herbert Schildt"
     },
     {
        "id": "07",
        "language": "C++",
        "edition": "second",
        "author": "E.Balagurusamy"
     }
  ]
}
`

describe('Interfaces', () => {
  it('parse', () => {
    console.log(JSON.stringify(J.parse(exampleJSON)))
    assert.strictEqual(true, true)
  })
})
