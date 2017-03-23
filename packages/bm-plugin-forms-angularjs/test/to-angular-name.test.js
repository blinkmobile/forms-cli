'use strict'

const test = require('ava') // eslint-disable-line node/no-unpublished-require

const toAngularName = require('../lib/transform/to-angular-name.js')

test('it should match the AngularJS naming conventions', (t) => {
  const expected = 'startsWithLowercaseLetter'

  t.is(toAngularName('StartsWithLowercaseLetter'), expected)
})

test('underscore should be removed and following letter capitalised', (t) => {
  const expected = 'myModuleName'

  t.is(toAngularName('my_module_name'), expected)
})

test('underscore should be removed and following number left alone', (t) => {
  const expected = 'myModuleName10'

  t.is(toAngularName('my_module_name_10'), expected)
})
