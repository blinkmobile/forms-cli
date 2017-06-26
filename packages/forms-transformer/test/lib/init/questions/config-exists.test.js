'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru().noPreserveCache()
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../../lib/init/questions/config-exists.js'

// stubs

const blinkmrcResolve = {
  projectConfig: () => ({load: () => Promise.resolve({})})
}

const blinkmrcReject = {
  projectConfig: () => ({load: () => Promise.reject(new Error('blah'))})
}

test('should resolve with true', (t) => {
  const question = pq(TEST_SUBJECT, {'@blinkmobile/blinkmrc': blinkmrcResolve})

  return question.when().then((result) => t.true(result)).catch(() => t.fail())
})

test('should resolve with false', (t) => {
  const question = pq(TEST_SUBJECT, {'@blinkmobile/blinkmrc': blinkmrcReject})

  return question.when().then((result) => t.false(result)).catch(() => t.fail())
})
