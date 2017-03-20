'use strict'

const test = require('ava')

const TEST_SUBJECT = '../../../lib/plugin-system/resolve-plugin-name.js'

test('prefix should be appended', (t) => {
  const resolve = require(TEST_SUBJECT)
  const expected = 'bm-plugin-my-plugin'
  t.is(resolve('my-plugin'), expected)
})

test('prefix should not be appended', (t) => {
  const resolve = require(TEST_SUBJECT)
  const expected = 'bm-plugin-my-plugin'
  t.is(resolve(expected), expected)
})

test('name should be lowercase', (t) => {
  const resolve = require(TEST_SUBJECT)
  const expected = 'bm-plugin-my-plugin'
  t.is(resolve('BM-PLUGIN-MY-PLUGIN'), expected)
})
