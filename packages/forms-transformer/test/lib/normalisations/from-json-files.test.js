'use strict'

const test = require('ava')
const pq = require('proxyquire').noCallThru().noPreserveCache()
const sinon = require('sinon')

const TEST_SUBJECT = '../../../lib/normalisations/from-json-files.js'

test('it should return an array of objects', (t) => {
  const readFileStub = sinon.stub()
  let i = 0
  readFileStub.callsFake(() => `{"index": ${++i}}`)

  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const normalise = pq(TEST_SUBJECT, {
    'fs': {readFileSync: readFileStub}
  })

  const result = normalise(input)

  t.is(result.length, input.length)
  result.forEach((json, index) => t.is(json.index, index + 1))
})
