'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../../lib/init/questions/source-folder.js'

test('default should be a string', (t) => {
  const expected = './bm-forms-src'
  const question = require(TEST_SUBJECT)

  t.is(question.default, expected)
})

test('filter should return a path relative to the current folder', (t) => {
  const expected = 'my-path'

  const question = require(TEST_SUBJECT)

  const result = question.filter(`./${expected}`)
  t.is(result, expected)
})
