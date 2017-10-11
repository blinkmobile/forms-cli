'use strict'

const path = require('path')

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
// const pq = require('proxyquire').noCallThru().noPreserveCache()
// const sinon = require('sinon')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../lib/make-template-store.js'

test('creates the template store object', (t) => {
  const m = require(TEST_SUBJECT)

  return m(path.join(__dirname, 'fixtures'))
    .then((templates) => {
      t.is(typeof templates, 'object')
      t.is(Object.keys(templates).length, 3)
      t.is(typeof templates.default, 'object')
      t.is(typeof templates.form1, 'object')
      t.is(typeof templates.form2, 'object')
    })
})

test('default store has the correct templates', (t) => {
  const m = require(TEST_SUBJECT)

  return m(path.join(__dirname, 'fixtures'))
    .then((templates) => {
      const templateStore = templates.default
      t.is(templateStore.size, 1)
      const template = templateStore.get('textbox')
      t.not(template, undefined)
      t.is(template.id, 'textbox')
    })
})

test('form1 store has the correct templates', (t) => {
  const m = require(TEST_SUBJECT)

  return m(path.join(__dirname, 'fixtures'))
    .then((templates) => {
      const templateStore = templates.form1
      t.is(templateStore.size, 2)

      const n = ['textbox', 'select']
      n.forEach((templateName) => {
        const template = templateStore.get(templateName)
        t.not(template, undefined)
        t.is(template.id, templateName)
      })
    })
})

test('form2 store has the correct templates', (t) => {
  const m = require(TEST_SUBJECT)

  return m(path.join(__dirname, 'fixtures'))
    .then((templates) => {
      const templateStore = templates.form2
      t.is(templateStore.size, 1)

      const n = ['radio']
      n.forEach((templateName) => {
        const template = templateStore.get(templateName)
        t.not(template, undefined)
        t.is(template.id, templateName)
      })
    })
})
