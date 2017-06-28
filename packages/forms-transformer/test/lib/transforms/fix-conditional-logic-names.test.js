'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../lib/transforms/fix-conditional-logic-names.js'

test('it should remove illegal characters from the name field', (t) => {
  const fixName = require(TEST_SUBJECT).fixNameFields
  const expected = 'abc'
  const result = fixName({name: '@%#^$abc'})

  t.true(result.name === expected)
})

test('it should remove illegal characters from the name +  field', (t) => {
  const fixBehaviorChecks = require(TEST_SUBJECT).fixBehaviorChecks
  const expected = 'abc'
  const result = fixBehaviorChecks({name: '@%#^$abc', check: '@%#^$abc'})

  t.true(result.name === expected)
  t.true(result.check === expected)
})

test('it should leave the name +  fields alone', (t) => {
  const fixBehaviorChecks = require(TEST_SUBJECT).fixBehaviorChecks
  const expected = 'abc'
  const result = fixBehaviorChecks({name: 'abc', check: 'abc'})

  t.true(result.name === expected)
  t.true(result.check === expected)
})
