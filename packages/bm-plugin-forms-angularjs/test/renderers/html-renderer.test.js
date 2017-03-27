'use strict'

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require */
const test = require('ava')
const pq = require('proxyquire').noCallThru().noPreserveCache()
const sinon = require('sinon')
/* eslint-enable node/no-unpublished-require */

const TEST_SUBJECT = '../../lib/renderers/html-renderer.js'

test('should return text', (t) => {
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
    'form': (f) => {
      t.is(f.name, expected)
      return f.name
    }
  })

  const m = pq(TEST_SUBJECT, {
    '../transform/element-HTML-transformer.js': () => [''],
    '@blinkmobile/forms-template-helper': {
      service: {
        getByType
      }
    }
  })

  const result = m(input)
  t.is(result, expected)
})

test('should call the element transformer', (t) => {
  const expected = 'abc'
  const input = {
    form: {
      name: expected,
      _checks: [],
      _elements: [{type: 'input'}]
    }
  }
  const getByType = sinon.stub()
  getByType.returns({
    'form': (f) => {
      t.is(f.name, expected)
      return f.name
    }
  })

  const elementStub = sinon.stub()
  elementStub.returns([''])

  const m = pq(TEST_SUBJECT, {
    '../transform/element-HTML-transformer.js': elementStub,
    '@blinkmobile/forms-template-helper': {
      service: {
        getByType
      }
    }
  })

  m(input)
  t.true(elementStub.called)
})

test('should append the pagination template to the output', (t) => {
  const expected = 'abcpagination'
  const input = {
    form: {
      name: 'abc',
      _checks: [],
      _elements: []
    },
    pages: [1, 2]
  }
  const getByType = sinon.stub()
  getByType.returns({
    'form': (f) => f.name,
    'pagination': () => 'pagination'
  })

  const m = pq(TEST_SUBJECT, {
    '../transform/element-HTML-transformer.js': () => [''],
    '@blinkmobile/forms-template-helper': {
      service: {
        getByType
      }
    }
  })

  const result = m(input)
  t.is(result, expected)
})

test('should not append the pagination because no template is provided', (t) => {
  const expected = 'abc'
  const input = {
    form: {
      name: 'abc',
      _checks: [],
      _elements: []
    },
    pages: [1, 2]
  }
  const getByType = sinon.stub()
  getByType.returns({
    'form': (f) => f.name
  })

  const m = pq(TEST_SUBJECT, {
    '../transform/element-HTML-transformer.js': () => [''],
    '@blinkmobile/forms-template-helper': {
      service: {
        getByType
      }
    }
  })

  const result = m(input)
  t.is(result, expected)
})

test('should not append the pagination because only one page', (t) => {
  const expected = 'abc'
  const input = {
    form: {
      name: 'abc',
      _checks: [],
      _elements: []
    },
    pages: [1]
  }
  const getByType = sinon.stub()
  getByType.returns({
    'form': (f) => f.name,
    'pagination': (f) => 'pagination'
  })

  const m = pq(TEST_SUBJECT, {
    '../transform/element-HTML-transformer.js': () => [''],
    '@blinkmobile/forms-template-helper': {
      service: {
        getByType
      }
    }
  })

  const result = m(input)
  t.is(result, expected)
})
