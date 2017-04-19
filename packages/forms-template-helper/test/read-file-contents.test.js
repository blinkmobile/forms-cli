'use strict'

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru().noPreserveCache()
/* eslint-enable node/no-unpublished-require */

const TEST_SUBJECT = '../lib/read-file-contents.js'

test('it should resolve with a string', (t) => {
  const expected = 'abc'
  const m = pq(TEST_SUBJECT, {
    'fs': {
      readFile: (p, enc, cb) => cb(null, expected)
    }
  })

  return m.readContents('file').then((result) => t.is(result, expected))
})

test('it should reject with an error', (t) => {
  const expected = 'abc'
  const m = pq(TEST_SUBJECT, {
    'fs': {
      readFile: (p, enc, cb) => cb(new Error(expected))
    }
  })

  return t.throws(m.readContents('file'), expected)
})
