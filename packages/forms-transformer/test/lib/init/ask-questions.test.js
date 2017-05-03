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

  return init().then((result) => t.pass())
})

test('it should ask the second set of questions if `.blinkmrc.json` does not exist', (t) => {
  const promptStub = sinon.stub()

  promptStub.onCall(0).returns(Promise.reject({code: 'ENOENT'}))
  promptStub.onCall(1).returns(Promise.resolve({overwrite: true}))

  const init = pq(TEST_SUBJECT, {
    '../prompt-config.js': {
      prompt: promptStub
    }
  })

  return init().then((result) => t.pass())
})

test('it should reject with `cancelled`', async (t) => { // eslint-disable-line  node/no-unsupported-features
  const promptStub = sinon.stub()

  promptStub.onCall(0).returns(Promise.resolve({overwrite: false}))

  const init = pq(TEST_SUBJECT, {
    '../prompt-config.js': {
      prompt: promptStub
    }
  })

  await t.throws(init(), 'cancelled') // eslint-disable-line  node/no-unsupported-features
})

