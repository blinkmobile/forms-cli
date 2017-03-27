'use strict'

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru().noPreserveCache()
/* eslint-enable node/no-unpublished-require */

const TEST_SUBJECT = '../../lib/transform/set-default-value.js'

test('it should use the default field type value', (t) => {
  const expected = 'defaultValue'
  const m = pq(TEST_SUBJECT, {
    './default-field-types.json': {
      input: expected
    }
  })

  const result = m({type: 'input'})
  t.is(result.value, expected)
})

test('it should use keep the current value', (t) => {
  const expected = 'defaultValue'
  const m = pq(TEST_SUBJECT, {
    './default-field-types.json': {
      input: 'not expected'
    }
  })

  const result = m({type: 'input', value: expected})
  t.is(result.value, expected)
})

test('it should use an invalid date', (t) => {
  const expected = 'new Date("")'
  const m = pq(TEST_SUBJECT, {
    './default-field-types.json': {
      date: expected
    }
  })

  let result = m({type: 'date'})
  t.is(result.value, expected)
  result = m({type: 'datetime'})
  t.is(result.value, expected)
  result = m({type: 'time'})
  t.is(result.value, expected)
})
