'use strict'

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru().noPreserveCache()
/* eslint-enable node/no-unpublished-require */

const TEST_SUBJECT = '../lib/file-list-helper.js'

test('ensures the base path has a slash (to get folders only)', (t) => {
  const m = pq(TEST_SUBJECT, {})
  const expected = 'path/'

  m.getFileList = (p) => t.is(p, expected)

  m.getFolderList('path')
})

test('rejects when glob has an error', (t) => {
  const m = pq(TEST_SUBJECT, {
    'glob': (p, cb) => cb(new Error('error'))
  })

  t.throws(m.getFileList('blah'), 'error')
})

test('resolves with file list', (t) => {
  const expected = [1, 2, 3]
  const m = pq(TEST_SUBJECT, {
    'glob': (p, cb) => cb(null, expected)
  })

  return m.getFileList('path').then((result) => t.deepEqual(result, expected))
})
