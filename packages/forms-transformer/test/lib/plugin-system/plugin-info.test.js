'use strict'
const path = require('path')

const test = require('ava')
const pq = require('proxyquire').noPreserveCache()
const sinon = require('sinon')

const TEST_SUBJECT = '../../../lib/plugin-system/plugin-info.js'

test('it should reject if .blinkmrc.json cant be found', async (t) => { // eslint-disable-line node/no-unsupported-features
  const readConfigStub = sinon.stub()
  readConfigStub.returns(Promise.resolve(null))

  const info = pq(TEST_SUBJECT, {
    '../config/read-config.js': readConfigStub
  })

  await t.throws(info(), 'No framework plugin in `.blinkmrc.json`') // eslint-disable-line node/no-unsupported-features
})

test('it should reject if framwork property of blinkmrc doesnt exist', async (t) => { // eslint-disable-line node/no-unsupported-features
  const readConfigStub = sinon.stub()
  readConfigStub.returns(Promise.resolve({a: 'b'}))

  const info = pq(TEST_SUBJECT, {
    '../config/read-config.js': readConfigStub
  })

  await t.throws(info(), 'No framework plugin in `.blinkmrc.json`') // eslint-disable-line node/no-unsupported-features
})

test('it should reject if package.json cant be found', (t) => {
  const expected = 'Could not find b. Has it been installed?'

  const readConfigStub = sinon.stub()
  readConfigStub.returns(Promise.resolve({framework: 'b'}))
  const findUpStub = sinon.stub()
  findUpStub.returns(Promise.resolve('.'))

  const info = pq(TEST_SUBJECT, {
    '../config/read-config.js': readConfigStub,
    'find-up': findUpStub
  })

  return t.throws(info(), expected)
})

test('it should read a valid packjson', (t) => {
  const expectedFramework = 'b'
  const expectedDescription = 'Description: AngularJS Plugin for Blink Mobile Technologies Forms transformer'
  const expectedVersion = 'Version: 1.0.0-alpha.1'
  const readConfigStub = sinon.stub()
  readConfigStub.returns(Promise.resolve({framework: expectedFramework}))
  const findUpStub = sinon.stub()
  findUpStub.returns(Promise.resolve(path.resolve(__dirname, '../../fixtures/packageJson')))
  const userLoggerStub = sinon.spy()

  const info = pq(TEST_SUBJECT, {
    '../config/read-config.js': readConfigStub,
    'find-up': findUpStub,
    '../logger/loggers.js': {userLogger: {info: userLoggerStub}}
  })

  return info().then(() => {
    t.true(userLoggerStub.called)
    t.true(userLoggerStub.firstCall.calledWith(expectedFramework))
    t.true(userLoggerStub.secondCall.calledWith(expectedDescription))
    t.true(userLoggerStub.thirdCall.calledWith(expectedVersion))
  })
})
