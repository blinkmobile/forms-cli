'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru()
const sinon = require('sinon')
/* eslint-ensable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../lib/plugin-system/handle-npm-error.js'

test('it should log the raw error if not able to decode', (t) => {
  const errorStub = sinon.stub()
  const logger = {
    debug: errorStub,
    error: errorStub
  }

  const handler = pq(TEST_SUBJECT, {
    '../logger/loggers.js': {debugLogger: logger}
  })

  handler('some odd error message')
  t.is(errorStub.callCount, 2)
  t.true(errorStub.firstCall.calledWith('Could not match error message'))
  t.true(errorStub.secondCall.calledWith('some odd error message'))
})

test('it should detect a 404 message', (t) => {
  const expected = 'correct'

  const handler = pq(TEST_SUBJECT, {
    './error-handlers/404.js': () => expected
  })

  const result = handler('code E404')
  t.is(result, expected)
})
