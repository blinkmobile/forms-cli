// @flow

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')

const tempy = require('tempy')

const fs = require('fs')

const TEST_SUBJECT = '../index.js'

test('should throw if no plugin is specified', (t) => {
  const Sdk = require(TEST_SUBJECT)
  t.throws(() => new Sdk(), 'Plugin is required')
})

test('sdk.plugin should be the plugin passed in', (t) => {
  const Sdk = require(TEST_SUBJECT)
  const expectedPlugin = 'plugin'
  const s = new Sdk(expectedPlugin)
  t.is(s.plugin, expectedPlugin)
})

test('loading the angularjs plugin', (t) => {
  const angularJSPlugin = require('@blinkmobile/bm-plugin-forms-angularjs')
  const Sdk = require(TEST_SUBJECT)
  const sdk = new Sdk(angularJSPlugin)
  t.plan(1)
  return sdk.ejectTemplates(tempy.directory()).then(() => t.pass())
})

test('building the preview form', (t) => {
  const srcPath = tempy.directory()
  const destPath = tempy.directory()
  const templatePath = tempy.directory()
  const formDef = require('./fixtures/form.json')
  const angularJSPlugin = require('@blinkmobile/bm-plugin-forms-angularjs')
  const Sdk = require(TEST_SUBJECT)
  const sdk = new Sdk(angularJSPlugin)

  return sdk.ejectTemplates(templatePath)
    .then(() => sdk.generateSource(templatePath, srcPath, formDef))
    .then(() => sdk.buildDist(templatePath, srcPath, destPath))
    .then(() => t.is(fs.readdirSync(destPath).length > 0, true, `${destPath} is empty!`))
})
