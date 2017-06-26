'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru()
const sinon = require('sinon')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const path = require('path')

const TEST_SUBJECT = '../../../lib/plugin-system/resolve-plugin-local-path.js'

test('should throw if node_modules not found', (t) => {
  const findupSyncStub = sinon.stub()
  findupSyncStub.returns(null)

  const resolve = pq(TEST_SUBJECT, {
    'find-up': {sync: findupSyncStub}
  })

  t.throws(() => resolve('a'), '`node_modules` not found, have you installed the plugin yet?')
})

test('should return a node_module sub folder', (t) => {
  const expected = path.join('node_modules', 'plugin')
  const findupSyncStub = sinon.stub()
  findupSyncStub.returns('node_modules')

  const resolve = pq(TEST_SUBJECT, {
    'find-up': {sync: findupSyncStub}
  })

  const result = resolve('plugin')
  t.is(result, expected)
})

test('should return a namespaced node_module sub folder', (t) => {
  const expected = path.join('node_modules', '@blinkmobile', 'plugin')
  const findupSyncStub = sinon.stub()
  findupSyncStub.returns('node_modules')

  const resolve = pq(TEST_SUBJECT, {
    'find-up': {sync: findupSyncStub}
  })

  const result = resolve('@blinkmobile/plugin')
  t.is(result, expected)
})
