'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../lib/transforms/set-defaults.js'

test('all fields that require quotes around text are quoted', (t) => {
  const extractDefaults = require(TEST_SUBJECT)

  const input = [
    {
      'name': 'text',
      'type': 'text',
      'defaultValue': 'text value'
    }, {
      'name': 'textarea',
      'type': 'text',
      'defaultValue': 'text area'
    }, {
      'name': 'password',
      'type': 'password',
      'defaultValue': 'test pass'
    }, {
      'name': 'email',
      'type': 'email',
      'defaultValue': 'test@example.com'
    }, {
      'name': 'url',
      'type': 'url',
      'defaultValue': 'http://sam.com'
    }, {
      'name': 'phone',
      'type': 'text',
      'defaultValue': '0456 123 456'
    }, {
      'name': 'radio',
      'type': 'select',
      'defaultValue': 'maybe'
    }, {
      'name': 'select',
      'type': 'select',
      'defaultValue': 'yes'
    }
  ]

  const results = input.map((el) => extractDefaults(el))
  results.forEach((el) => t.true(/^".+"$/g.test(el.value)))
})

test('text fields are correctly escaped', (t) => {
  const extractDefaults = require(TEST_SUBJECT)

  const input = {
    'name': 'text',
    'type': 'text',
    'defaultValue': 'text says "hi!"'
  }

  const result = extractDefaults(input)
  t.true(/^".+"$/g.test(result.value))
})

test('date fields do not quote the value', (t) => {
  const extractDefaults = require(TEST_SUBJECT)

  const inputs = [{
    'name': 'date',
    'type': 'date',
    'defaultDate': 'now',
    'defaultValue': 'now'
  }, {
    'name': 'time',
    'type': 'time',
    'defaultValue': 'now'
  }, {
    'name': 'datetime',
    'type': 'datetime',
    'defaultValue': 'now'
  }]

  const results = inputs.map((el) => extractDefaults(el))
  results.forEach((el) => t.false(/^".+"$/g.test(el.value)))
})

test('select multis are arrays', (t) => {
  const extractDefaults = require(TEST_SUBJECT)

  const input = [{
    'name': 'multi',
    'type': 'select',
    'multi': true,
    'defaultValue': 'text says "hi!"'
  }, {
    'name': 'checkboxes',
    'type': 'checkboxes',
    'multi': true,
    'defaultValue': 'sometimes'
  }]

  const results = input.map((el) => extractDefaults(el))
  results.forEach((el) => t.true(/^\[.+\]$/g.test(el.value)))
})
