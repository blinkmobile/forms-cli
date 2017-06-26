'use strict'

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
const sinon = require('sinon')
const pq = require('proxyquire').noCallThru().noPreserveCache()
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../lib/file-list-helper.js'

test('ensures the base path has a slash (to get folders only)', (t) => {
  const expected = 'path/'
  const input = 'path'

  const globStub = sinon.stub()

  globStub.withArgs(expected).callsArgWith(1, null, expected)

  const m = pq(TEST_SUBJECT, {
    'glob': globStub
  })

  return m.getFolderList(input).then((result) => t.is(result, expected))
})

test('rejects when glob has an error', async (t) => { // eslint-disable-line  node/no-unsupported-features
  const m = pq(TEST_SUBJECT, {
    'glob': (p, cb) => cb(new Error('error'))
  })

  await t.throws(m.getFileList('blah'), 'error') // eslint-disable-line  node/no-unsupported-features
})

test('resolves with file list', (t) => {
  const expected = [1, 2, 3]
  const m = pq(TEST_SUBJECT, {
    'glob': (p, cb) => cb(null, expected)
  })

  return m.getFileList('path').then((result) => t.deepEqual(result, expected))
})
