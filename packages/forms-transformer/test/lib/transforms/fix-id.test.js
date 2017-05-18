'use strict'

const test = require('ava')

const TEST_SUBJECT = '../../../lib/transforms/fix-id.js'

test('id elements should be turned into hidden types', (t) => {
  const fixId = require(TEST_SUBJECT)
  const input = {type: 'text', name: 'id'}
  const expected = 'hidden'
  const result = fixId(input)
  t.is(result.type, expected)
})

test('elements not named id should NOT be turned into hidden types', (t) => {
  const fixId = require(TEST_SUBJECT)
  const input = {type: 'text', name: 'id123'}
  const expected = 'text'
  const result = fixId(input)
  t.is(result.type, expected)
})

test('elements not of type text should NOT be turned into hidden types', (t) => {
  const fixId = require(TEST_SUBJECT)
  const input = {type: 'select', name: 'id'}
  const expected = 'select'
  const result = fixId(input)
  t.is(result.type, expected)
})
