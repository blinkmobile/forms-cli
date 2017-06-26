'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru()
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../../lib/init/questions/which-answerspace.js'

const expectedHost = 'https://blinkm.co'

// stubs

const readConfigResolve = () => Promise.resolve({scope: expectedHost})
const readConfigReject = () => Promise.reject(new Error('blah'))
const fetchAnswerspaceResolve = () => Promise.resolve()

// default message function
test('should be empty if no scope set', (t) => {
  const question = pq(TEST_SUBJECT, {
    '../../utils/answerspace/fetch-answerspace-id.js': fetchAnswerspaceResolve,
    '../../config/read-config.js': readConfigReject
  })

  return question.default().then((result) => t.is(result, undefined))
})

test('should return the scope', (t) => {
  const question = pq(TEST_SUBJECT, {
    '../../utils/answerspace/fetch-answerspace-id.js': fetchAnswerspaceResolve,
    '../../config/read-config.js': readConfigResolve
  })

  return question.default().then((result) => t.is(result, expectedHost))
})

// filter function

test('should return the full answerspace url', (t) => {
  const input = 'non-existant'
  const expected = `${expectedHost}/${input}`

  const question = pq(TEST_SUBJECT, {
    '../../utils/answerspace/fetch-answerspace-id.js': fetchAnswerspaceResolve
  })

  return question.filter(input).then((result) => t.is(result, expected))
})

test('should return the full URL', (t) => {
  const expected = `${expectedHost}/non-existant`
  const input = 'non-existant'

  const question = pq(TEST_SUBJECT, {
    '../../utils/answerspace/fetch-answerspace-id.js': fetchAnswerspaceResolve,
    '../../config/read-config.js': readConfigResolve
  })

  const checkResult = (result) => t.is(result, expected)
  return question.default()
    .then(() => question.filter(input).then(checkResult))
})

test('should return the full URL, ignoring the scope', (t) => {
  const expected = 'https://test.com/non-existant'

  const question = pq(TEST_SUBJECT, {
    '../../utils/answerspace/fetch-answerspace-id.js': fetchAnswerspaceResolve,
    '../../config/read-config.js': readConfigResolve
  })

  const checkResult = (result) => t.is(result, expected)
  return question.default()
    .then(() => question.filter(expected).then(checkResult))
})
