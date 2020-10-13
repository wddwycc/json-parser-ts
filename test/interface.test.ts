import * as assert from 'assert'
import { pipe } from 'fp-ts/lib/function'
import * as J from '../src'
import * as E from 'fp-ts/lib/Either'

const exampleJSON = `
{
  "book": [ 1,2,3 ]
}
`

describe('Interfaces', () => {
  it('parse', () => {
    const res = pipe(J.parse(exampleJSON), E.map(J.flatten))
    assert.deepStrictEqual(res, E.right({ book: [1, 2, 3] }))
  })
})
