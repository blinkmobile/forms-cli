'use strict'

const test = require('ava')
const pq = require('proxyquire').noCallThru()

// stubs
test.beforeEach((t) => {
  t.context.writeSite = pq('../../lib/write-site.js', {
    './logger.js': require('../stubs/logger.js')
  }).writeSite
})

test('should return a Promise', (t) => t.context.writeSite('foo', {bar: [() => Promise.resolve(true)]}))

test('should write to the correct path', (t) => {
  const path = require('path')
  const expected = path.join('foo', 'bar')

  t.context.writeSite('foo', {
    bar: [(p) => {
      t.is(p, expected, 'should be `foo/bar`')
      t.pass()
    }]
  })
})

test('should resolve if the form is falsy',
    (t) => t.context.writeSite('foo', {'bar': undefined}))

test('should reject because form critera not met',
    (t) => t.throws(t.context.writeSite('foo', {bar: 'kablam!'}), 'Form must be a single function or an Array of functions'))

test('should wrap a single function in an array', (t) => {
  t.context.writeSite('foo', {
    bar: (p) => {
      t.pass()
    }
  })
})
