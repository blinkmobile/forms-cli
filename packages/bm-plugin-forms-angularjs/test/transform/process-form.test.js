'use strict'

// dev dependencies are set at a repo level
/* eslint-disable node/no-unpublished-require */
const test = require('ava')
const pq = require('proxyquire').noPreserveCache()
const sinon = require('sinon')
/* eslint-enable node/no-unpublished-require */

const TEST_SUBJECT = '../../lib/transform/process-form.js'
const CTRL_RENDERER_NAME = '../renderers/controller-renderer.js'
const HTML_RENDERER_NAME = '../renderers/html-renderer.js'
const SERVICE_NAME = '@blinkmobile/forms-template-helper'

test.beforeEach('setup', (t) => {
  const controllerRendererStub = sinon.stub()
  const htmlRendererStub = sinon.stub()

  controllerRendererStub.returns('controller')
  htmlRendererStub.returns('html')

  t.context.stubs = {
    controllerRendererStub: controllerRendererStub,
    htmlRendererStub: htmlRendererStub
  }
})

test('should return an array of functions', (t) => {
  const serviceGetByTypeStub = sinon.stub()

  serviceGetByTypeStub.returns({
    'form-module.js': () => 'form-module.js',
    'model-service.js': () => 'model-service.js'
  })
  const m = pq(TEST_SUBJECT, {
    [CTRL_RENDERER_NAME]: t.context.stubs.controllerRendererStub,
    [HTML_RENDERER_NAME]: t.context.stubs.htmlRendererStub,
    [SERVICE_NAME]: {
      service: {
        getByType: serviceGetByTypeStub
      }
    }
  })

  const input = {
    name: 'testForm',
    _checks: [],
    _elements: [{
      type: 'input',
      name: 'input1',
      page: 0
    }, {
      type: 'input',
      name: 'input1',
      page: 0
    }]
  }

  const result = m(input)
  t.true(Array.isArray(result))
  result.forEach((fn) => t.is(typeof fn, 'function'))
})

test('correct moduleOptions is generated', (t) => {
  const serviceGetByTypeStub = sinon.stub()
  const checkModule = (opts) => {
    const expectedDeps = [
      'bmSignaturePad',
      'bmCamera',
      'bmLocation',
      'mySubform']
    t.deepEqual(opts.moduleDependencies, expectedDeps, 'module dependencies are incorrect')
    t.is(opts.bmFormsPage, 0, 'bmFormsPage is not 0')
    t.is(opts.pageNumbers, '[0, 1]', 'pageNumbers is not a string')
  }

  serviceGetByTypeStub.returns({
    'form-module.js': checkModule,
    'model-service.js': () => 'model-service.js'
  })
  const m = pq(TEST_SUBJECT, {
    [CTRL_RENDERER_NAME]: t.context.stubs.controllerRendererStub,
    [HTML_RENDERER_NAME]: t.context.stubs.htmlRendererStub,
    [SERVICE_NAME]: {
      service: {
        getByType: serviceGetByTypeStub
      }
    }
  })

  const input = {
    name: 'testForm',
    _checks: [],
    _elements: [{
      type: 'input',
      name: 'input1',
      page: 0
    }, {
      type: 'draw',
      name: 'draw1',
      page: 1
    }, {
      type: 'camera',
      name: 'camera1',
      page: 0
    }, {
      type: 'location',
      name: 'location1',
      page: 0
    }, {
      type: 'subform',
      name: 'subform1',
      subForm: 'my_subform',
      page: 0
    }, {
      type: 'draw',
      name: 'draw1',
      page: 1
    }]
  }

  m(input)
})
