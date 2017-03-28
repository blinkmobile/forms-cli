'use strict'

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru().noPreserveCache()
const sinon = require('sinon')
/* eslint-enable node/no-unpublished-require */

const TEST_SUBJECT = '../lib/template-service.js'

test('it should use the folder names as keys', (t) => {
  const getFileListStub = sinon.stub()
  getFileListStub.withArgs('js/**.mustache').returns(Promise.resolve(['controller.js.mustache', 'module.js.mustache']))
  getFileListStub.withArgs('html/**.mustache').returns(Promise.resolve(['boolean.mustache', 'input.mustache']))

  const m = pq(TEST_SUBJECT, {
    './file-list-helper.js': {
      getFolderList: (p) => Promise.resolve(['js/', 'html/']),
      getFileList: getFileListStub
    },
    './renderer-mustache.js': {
      createRenderer: (i) => (i) => i
    }
  })

  const expected = ['js', 'html']
  return m.load().then((result) => t.deepEqual(Object.keys(result), expected))
})

test('it should return a well formed template hash', (t) => {
  const getFileListStub = sinon.stub()
  getFileListStub.withArgs('js/**.mustache').returns(Promise.resolve(['controller.js.mustache', 'module.js.mustache']))
  getFileListStub.withArgs('html/**.mustache').returns(Promise.resolve(['boolean.mustache', 'input.mustache']))

  const m = pq(TEST_SUBJECT, {
    './file-list-helper.js': {
      getFolderList: (p) => Promise.resolve(['js/', 'html/']),
      getFileList: getFileListStub
    },
    './renderer-mustache.js': {
      createRenderer: (i) => i
    }
  })

  const expected = {
    js: {
      'controller.js': 'controller.js.mustache',
      'module.js': 'module.js.mustache'
    },
    html: {
      'boolean': 'boolean.mustache',
      'input': 'input.mustache'
    }
  }

  return m.load().then((result) => t.deepEqual(result, expected))
})
