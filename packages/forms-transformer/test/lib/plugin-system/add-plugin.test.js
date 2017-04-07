'use strict'

const test = require('ava')
const pq = require('proxyquire').noCallThru()
const sinon = require('sinon')

const TEST_SUBJECT = '../../../lib/plugin-system/add-plugin.js'

test('should reject if no plugin path is supplied', (t) => {
  const addPlugin = require(TEST_SUBJECT)

  t.throws(addPlugin(), 'add: Plugin path not specified.')
})

test('should call execa with the save option', (t) => {
  const expected = 'npm install --save plugin'
  const findUpStub = sinon.stub()
  findUpStub.returns(Promise.resolve('node_modules/'))

  const execaStub = sinon.stub()
  execaStub.returns(Promise.resolve())

  const getStreamStub = sinon.stub()
  getStreamStub.returns(Promise.resolve())

  const readConfigStub = sinon.stub()
  readConfigStub.returns({})

  const addPlugin = pq(TEST_SUBJECT, {
    'execa': {shell: execaStub},
    'find-up': findUpStub,
    'get-stream': getStreamStub,
    '../config/read-config.js': readConfigStub,
    '../logger.js': {logger: {info: () => true}}
  })

  return addPlugin('plugin').then(() => t.true(execaStub.calledWith(expected)))
})

test('should call execa without the save option', (t) => {
  const expected = 'npm install plugin'
  const findUpStub = sinon.stub()
  findUpStub.returns(Promise.resolve(null))

  const execaStub = sinon.stub()
  execaStub.returns(Promise.resolve())

  const getStreamStub = sinon.stub()
  getStreamStub.returns(Promise.resolve())

  const readConfigStub = sinon.stub()
  readConfigStub.returns({})

  const addPlugin = pq(TEST_SUBJECT, {
    'execa': {shell: execaStub},
    'find-up': findUpStub,
    'get-stream': getStreamStub,
    '../config/read-config.js': readConfigStub,
    '../logger.js': {logger: {info: () => true}}
  })

  return addPlugin('plugin').then(() => t.true(execaStub.calledWith(expected)))
})

test('should call handleNPMerror if npm errors', (t) => {
  const expected = 'error string'
  const findUpStub = sinon.stub()
  findUpStub.returns(Promise.resolve(null))

  const execaStub = sinon.stub()
  execaStub.returns(Promise.reject({stderr: expected}))

  const getStreamStub = sinon.stub()
  getStreamStub.returns(Promise.resolve())

  const readConfigStub = sinon.stub()
  readConfigStub.returns({})

  const handleNPMerrorStub = sinon.spy()

  const addPlugin = pq(TEST_SUBJECT, {
    'execa': {shell: execaStub},
    'find-up': findUpStub,
    'get-stream': getStreamStub,
    '../config/read-config.js': readConfigStub,
    '../logger.js': {logger: {info: () => true, debug: () => true}},
    './handle-npm-error.js': handleNPMerrorStub
  })

  return addPlugin('plugin').then(() => t.true(handleNPMerrorStub.calledWith(expected)))
})
