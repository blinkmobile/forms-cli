'use strict'

const test = require('ava')
const pq = require('proxyquire').noCallThru()
const sinon = require('sinon')

const TEST_SUBJECT = '../../../lib/plugin-system/handle-npm-error.js'

test('it should log the raw error if not able to decode', (t) => {
  const errorStub = sinon.stub()
  const logger = {
    debug: () => true,
    error: errorStub
  }

  const handler = pq(TEST_SUBJECT, {
    '../logger.js': {logger: logger}
  })

  handler('some odd error message')
  t.is(errorStub.callCount, 2)
  t.true(errorStub.firstCall.calledWith('Could not match error message'))
  t.true(errorStub.secondCall.calledWith(`Raw NPM error message:
some odd error message

`))
})

test('it should detect a 404 message', (t) => {
  const expected = 'correct'
  const infoStub = sinon.stub()
  const logger = {
    debug: () => true,
    info: infoStub
  }

  const handler = pq(TEST_SUBJECT, {
    '../logger.js': {logger: logger},
    './error-handlers/404.js': () => expected
  })

  handler('code E404')
  t.is(infoStub.callCount, 1)
  t.true(infoStub.firstCall.calledWith(expected))
})
