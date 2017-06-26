'use strict'

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require, node/no-extraneous-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru().noPreserveCache()
const sinon = require('sinon')
/* eslint-enable node/no-unpublished-require, node/no-extraneous-require */

const TEST_SUBJECT = '../../lib/renderers/controller-renderer.js'

test('it should return text from the template function', (t) => {
  const expected = 'abc'
  const input = {
    form: {
      name: expected,
      _checks: [],
      _elements: []
    }
  }
  const getByType = sinon.stub()
  getByType.returns({
    'form-controller.js': (f) => {
      t.is(f.name, expected)
      return f.name
    }
  })

  const m = pq(TEST_SUBJECT, {
    '@blinkmobile/forms-template-helper': {
      service: {
        getByType
      }
    }
  })

  const result = m(input)
  t.is(result, expected)
})

test('it should call insertConditionalLogic', (t) => {
  const input = {
    form: {
      name: 'form',
      _checks: [{abc: 'def'}],
      _elements: []
    }
  }
  const getByType = sinon.stub()
  getByType.returns({
    'form-controller.js': (f) => {
      return f.name
    }
  })
  const insertConditionalLogicStub = sinon.spy()
  const m = pq(TEST_SUBJECT, {
    '../ast/insert-conditional-logic.js': insertConditionalLogicStub,
    '@blinkmobile/forms-template-helper': {
      service: {
        getByType
      }
    }
  })

  m(input)
  t.true(insertConditionalLogicStub.called)
})

test('it should call insertSignatureLogic', (t) => {
  const input = {
    form: {
      name: 'form',
      _checks: [],
      _elements: [{type: 'draw'}]
    }
  }
  const getByType = sinon.stub()
  getByType.returns({
    'form-controller.js': (f) => {
      return f.name
    }
  })
  const insertSignatureLogicSpy = sinon.spy()
  const m = pq(TEST_SUBJECT, {
    '../ast/insert-signature-logic.js': insertSignatureLogicSpy,
    '@blinkmobile/forms-template-helper': {
      service: {
        getByType
      }
    }
  })

  m(input)
  t.true(insertSignatureLogicSpy.called)
})

test('it should call removeNodeFrom', (t) => {
  const input = {
    form: {
      name: 'form',
      _checks: [],
      _elements: [{type: 'draw'}]
    },
    page: true
  }
  const getByType = sinon.stub()
  getByType.returns({
    'form-controller.js': (f) => {
      return f.name
    }
  })
  const removeNodeFromStub = sinon.stub()
  removeNodeFromStub.returns(() => true)
  const m = pq(TEST_SUBJECT, {
    '../ast/remove-node-from.js': removeNodeFromStub,
    '@blinkmobile/forms-template-helper': {
      service: {
        getByType
      }
    }
  })

  m(input)
  t.true(removeNodeFromStub.called)
})
