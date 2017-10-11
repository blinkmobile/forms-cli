'use strict'

const path = require('path')
// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
// const pq = require('proxyquire').noCallThru().noPreserveCache()
// const sinon = require('sinon')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../lib/template-store.js'
const Template = require('../lib/template.js')
const TemplateStore = require(TEST_SUBJECT)

test('throws if a non template object is stored', (t) => {
  const ts = new TemplateStore()
  t.throws(() => ts.add({}))
})

test('accepts a Template Object', (t) => {
  const ts = new TemplateStore()

  ts.add(new Template(path.join(__dirname, 'fixtures', 'form1', 'select.mustache')))
  t.is(ts[TemplateStore.DEFAULT_STORE_NAME].size, 1)
})

test('stores a template namespaced to a form', (t) => {
  const ts = new TemplateStore()
  const formName = 'newForm'

  ts.add(new Template(path.join(__dirname, 'fixtures', 'form1', 'select.mustache')), formName)
  t.is(ts[formName].size, 1)
})
