'use strict'

/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
const sinon = require('sinon')
const pq = require('proxyquire').noCallThru()
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../../lib/utils/decide-on-normalisation-fns.js'

test('it should select bmp normalisation', (t) => {
  const expected = 1
  const bmpSpy = sinon.spy()

  const decide = pq(TEST_SUBJECT, {
    '../normalisations/from-bmp.js': bmpSpy
  })

  decide({definitionSource: 'http://blinkm.co/simon'})()
  t.is(bmpSpy.callCount, expected)
})

test('it should select bmp normalisation when eps url is used', (t) => {
  const expected = 1
  const bmpSpy = sinon.spy()

  const decide = pq(TEST_SUBJECT, {
    '../normalisations/from-bmp.js': bmpSpy
  })

  decide({definitionSource: 'http://acresta.eps.blinkm.co/simon'})()
  t.is(bmpSpy.callCount, expected)
})

test('it should call fileCompile on single folder', (t) => {
  const expectedFileCalls = 1
  const expectedGlobCalls = 0
  const fileSpy = sinon.spy()
  const globSpy = sinon.spy()

  const decide = pq(TEST_SUBJECT, {
    '../normalisations/from-json-files.js': fileSpy,
    'glob': {sync: globSpy}
  })

  decide({definitionSource: 'simon/'})()
  t.is(fileSpy.callCount, expectedFileCalls)
  t.is(globSpy.callCount, expectedGlobCalls)
})

test('it should call fileCompile on glob', (t) => {
  const expectedFileCalls = 1
  const expectedGlobCalls = 1
  const fileSpy = sinon.spy()
  const globSpy = sinon.spy()

  const decide = pq(TEST_SUBJECT, {
    '../normalisations/from-json-files.js': fileSpy,
    'glob': {sync: globSpy}
  })

  decide({definitionSource: 'simon/**/*.js'})()
  t.is(fileSpy.callCount, expectedFileCalls)
  t.is(globSpy.callCount, expectedGlobCalls)
})
