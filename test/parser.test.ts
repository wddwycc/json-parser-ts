import * as assert from 'assert'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import fs from 'fs'

import * as J from '../src'

const BASE_DIR = './test/dataset'

describe('RFC 8259', () => {
  const files = fs.readdirSync(BASE_DIR)
  for (const file of files) {
    const jsonStr = fs.readFileSync(`${BASE_DIR}/${file}`, 'utf-8')
    if (file.startsWith('y_')) {
      it(file, () => {
        assert.deepStrictEqual(
          pipe(J.parse(jsonStr), E.map(J.flatten)),
          E.right(JSON.parse(jsonStr)),
        )
      })
    }
    if (file.startsWith('n_')) {
      it(file, () => {
        assert.strictEqual(pipe(J.parse(jsonStr), E.isLeft), true)
      })
    }
  }
})
