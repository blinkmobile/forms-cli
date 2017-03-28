'use strict'

const test = require('ava')
const pq = require('proxyquire').noCallThru()

const TEST_SUBJECT = '../../../../lib/init/questions/config-exists.js'

// stubs

const blinkmrcResolve = {
  projectConfig: () => ({load: () => Promise.resolve()})
}

const blinkmrcReject = {
  projectConfig: () => ({load: () => Promise.reject()})
}

test('when should resolve with true', (t) => {
  const question = pq(TEST_SUBJECT, {'@blinkmobile/blinkmrc': blinkmrcResolve})

  return question.when().then((result) => t.true(result)).catch(() => t.fail())
})

test('when should resolve with false', (t) => {
  const question = pq(TEST_SUBJECT, {'@blinkmobile/blinkmrc': blinkmrcReject})

  return question.when().then((result) => t.false(result)).catch(() => t.fail())
})
