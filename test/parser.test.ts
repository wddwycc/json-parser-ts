import { JSONStringParser } from '../src'
import { runParser } from '../src/utils'

describe('parser', () => {
  it('it works', () => {
    const res = runParser(JSONStringParser, '"hello world***"')
    console.log(res)
  })
})
