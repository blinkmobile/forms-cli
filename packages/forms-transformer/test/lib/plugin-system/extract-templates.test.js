'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru()
const sinon = require('sinon')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../lib/plugin-system/extract-templates.js'

test('should reject when cfg is invalid', async (t) => { // eslint-disable-line node/no-unsupported-features
  const readCfgStub = sinon.stub()
  readCfgStub.onFirstCall().returns(Promise.resolve(undefined))
  readCfgStub.onSecondCall().returns(Promise.resolve({}))
  readCfgStub.onThirdCall().returns(Promise.resolve({templatePath: ''}))

  const extractTemplates = pq(TEST_SUBJECT, {
    '../config/read-config.js': readCfgStub
  })

  /* eslint-disable node/no-unsupported-features */
  await t.throws(extractTemplates(), 'Template Path not found in .blinkmrc.json. Please run `bm forms init`')
  await t.throws(extractTemplates(), 'Template Path not found in .blinkmrc.json. Please run `bm forms init`')
  await t.throws(extractTemplates(), 'Template Path not found in .blinkmrc.json. Please run `bm forms init`')
  /* eslint-enable node/no-unsupported-features */
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
