'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../lib/plugin-system/resolve-plugin-name.js'

test('prefix should be appended', (t) => {
  const resolve = require(TEST_SUBJECT)
  const expected = '@blinkmobile/bm-plugin-forms-my-plugin'
  t.is(resolve('my-plugin'), expected)
})

test('prefix should not be appended', (t) => {
  const resolve = require(TEST_SUBJECT)
  const expected = '@blinkmobile/bm-plugin-forms-my-plugin'
  t.is(resolve(expected), expected)
})

test('name should be lowercase', (t) => {
  const resolve = require(TEST_SUBJECT)
  const expected = '@blinkmobile/bm-plugin-forms-my-plugin'
  t.is(resolve('MY-PLUGIN'), expected)
})
