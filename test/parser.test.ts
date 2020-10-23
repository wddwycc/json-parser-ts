import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import fs from 'fs'

import * as J from '../src'

const BASE_DIR = './test/dataset'

describe('Test interfaces', () => {
  const files = fs.readdirSync(BASE_DIR)
  for (const file of files) {
    if (!file.startsWith('y_')) continue
    const jsonStr = fs.readFileSync(`./test/dataset/${file}`, 'utf-8')
    it(file, () => {
      assert.deepStrictEqual(
        pipe(J.parse(jsonStr), E.map(J.flatten)),
        E.right(JSON.parse(jsonStr)),
      )
    })
  }
})
