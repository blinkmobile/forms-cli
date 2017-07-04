'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../../lib/init/questions/json-path.js'

test('should resolve with a glob', (t) => {
  const question = require(TEST_SUBJECT)
  const expected = 'json/**/*.json'
  const result = question.filter('json')
  t.is(result, expected)
})

test('should leave a filename intact', (t) => {
  const question = require(TEST_SUBJECT)
  const expected = 'json.json'
  const result = question.filter('json.json')
  t.is(result, expected)
})
