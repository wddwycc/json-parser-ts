import { JSONStringParser } from '../src'
import { runParser } from '../src/utils'

describe('parser', () => {
  it('it works', () => {
    const res = runParser(JSONStringParser, '"\\\\ \\bhello world "')
    console.log(res)
  })
})
