'use strict'

const test = require('ava')
const pq = require('proxyquire').noCallThru().noPreserveCache()
const sinon = require('sinon')

const TEST_SUBJECT = '../../../lib/init/ask-questions.js'

test('it should not reject if questions answered', (t) => {
  const init = pq(TEST_SUBJECT, {
    '../prompt-config.js': {
      prompt: () => Promise.resolve({overwrite: true})
    }
  })

  return init()
})

test('it should ask the second set of questions if `.blinkmr.json` does not exist', (t) => {
  const promptStub = sinon.stub()

  promptStub.onCall(0).returns(Promise.reject({code: 'ENOENT'}))
  promptStub.onCall(1).returns(Promise.resolve({overwrite: true}))

  const init = pq(TEST_SUBJECT, {
    '../prompt-config.js': {
      prompt: promptStub
    }
  })

  return init()
})

test('it should reject with `cancelled`', (t) => {
  const promptStub = sinon.stub()

  promptStub.onCall(0).returns(Promise.resolve({overwrite: false}))

  const init = pq(TEST_SUBJECT, {
    '../prompt-config.js': {
      prompt: promptStub
    }
  })

  t.throws(init(), 'cancelled')
})
