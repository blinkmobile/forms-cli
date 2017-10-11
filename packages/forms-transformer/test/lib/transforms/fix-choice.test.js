'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../lib/transforms/fix-choice.js'

test('boolean fields should be left as-is', (t) => {
  const fixChoice = require(TEST_SUBJECT)
  const expected = {type: 'boolean', foo: 'bar'}
  const result = fixChoice(expected)

  t.deepEqual(result, expected)
})

test('options should transform to the right format', (t) => {
  const fixChoice = require(TEST_SUBJECT)
  const expected = {
    type: 'select',
    mode: 'collapsed',
    multi: true,
    options: [{id: 'foobar', value: 'foo bar'}]
  }
  const input = {
    type: 'multi',
    mode: 'collapsed',
    options: {
      'foo bar': 'foo bar'
    }
  }
  const result = fixChoice(input)

  t.deepEqual(result, expected)
})
