'use strict'

const test = require('ava')
const pq = require('proxyquire').noCallThru()
const sinon = require('sinon')

const TEST_SUBJECT = '../../../lib/plugin-system/extract-templates.js'

test('should reject when cfg is invalid', (t) => {
  const readCfgStub = sinon.stub()
  readCfgStub.onFirstCall().returns(Promise.resolve(undefined))
  readCfgStub.onSecondCall().returns(Promise.resolve({}))
  readCfgStub.onThirdCall().returns(Promise.resolve({templatePath: ''}))

  const extractTemplates = pq(TEST_SUBJECT, {
    '../config/read-config.js': readCfgStub
  })

  t.throws(extractTemplates(), 'Template Path not found in .blinkmrc.json. Please run `bm forms init`')
  t.throws(extractTemplates(), 'Template Path not found in .blinkmrc.json. Please run `bm forms init`')
  t.throws(extractTemplates(), 'Template Path not found in .blinkmrc.json. Please run `bm forms init`')
})

test('should call writeTemplates with the full config object', (t) => {
  const readCfgStub = sinon.stub()
  const expected = {templatePath: 'templates'}
  readCfgStub.returns(Promise.resolve(expected))
  const writeTemplatesStub = sinon.stub()
  writeTemplatesStub.returns(Promise.resolve())

  const extractTemplates = pq(TEST_SUBJECT, {
    '../config/read-config.js': readCfgStub,
    '../init/write-templates.js': writeTemplatesStub
  })

  return extractTemplates().then(() => t.true(writeTemplatesStub.calledWith(expected)))
})
