'use strict'

const recast = require('recast')
const types = recast.types
const b = types.builders

const insertIntoController = require('./insert-into-controller.js')
const insertComponentLifecycleHook = require('./insert-component-lifecycle-hook.js')
const thisMemberExpression = require('./types/this-member-expression.js')
const variableDeclaration = require('./types/variable-declaration.js')

const RESIZE = 'resizeSignaturePads'
const RESIZE_EVENT = 'resize'
const WINDOW_ELEMENT = 'windowElement'

// ### In controller:
// const windowElement = angular.element($window)
// const resizeSignaturePads = () => {
//  this.resizeSignaturePad[elementOne]()
//  this.resizeSignaturePad[elementTwo]()
//  // etc...
// }

// this.clearSignaturePad = (modelProperty) => {
//   if ($window.confirm('Are you sure you want to clear?')) {
//     this.model[modelProperty] = undefined
//     this[modelProperty + 'Disabled'] = false
//   }
// }

// ### In $onInit:
// windowElement.on('resize', resizeSignaturePads)

// ### In $onDestroy:
// windowElement.off('resize', resizeSignaturePads)

function makeResizeState (name) {
  return b.expressionStatement(
    b.callExpression(
      b.memberExpression(
        b.thisExpression(),
        b.identifier(`resizeSignaturePad${name}`)
      ),
      []
    )
  )
}

function makeResizeFunctionStatement (resizeFns) {
  return variableDeclaration(RESIZE,
    b.arrowFunctionExpression(
      [],
      b.blockStatement(resizeFns)
    )
  )
}

function makeWindowElementStatement () {
  // const windowEle = angular.element($window)
  return variableDeclaration(WINDOW_ELEMENT,
    b.callExpression(
      b.memberExpression(
        b.identifier('angular'),
        b.identifier('element')
      ),
      [b.identifier('$window')]
    )
  )
}

function makeWindowResizeEventStatement (onOff) {
  return b.expressionStatement(
    b.callExpression(
      b.memberExpression(
        b.identifier(WINDOW_ELEMENT),
        b.identifier(onOff)
      ),
      [
        b.literal(RESIZE_EVENT),
        b.identifier(RESIZE)
      ]
    )
  )
}

function makeClearFunctionStatement () {
  return thisMemberExpression('clearSignaturePad',
    b.arrowFunctionExpression(
      [b.identifier('modelProperty')],
      b.blockStatement([
        b.ifStatement(
          b.callExpression(
            b.memberExpression(
              b.identifier('$window'),
              b.identifier('confirm')
            ),
            [
              b.literal('Are you sure you want to clear?')
            ]
          ),
          b.blockStatement([
            thisMemberExpression('model[modelProperty]', b.literal(null)),
            b.expressionStatement(
              b.assignmentExpression(
                '=',
                b.identifier('this[modelProperty + \'Disabled\']'),
                b.literal(false)
              )
            )
          ])
        )
      ])
    )
  )
}

function insertSignatureLogic (fnSource, elements) {
  const resizeFns = elements.map((el) => makeResizeState(el.name))
  const resize = makeResizeFunctionStatement(resizeFns)
  const windowEle = makeWindowElementStatement()
  const onResize = makeWindowResizeEventStatement('on')
  const offResize = makeWindowResizeEventStatement('off')
  const clear = makeClearFunctionStatement('off')

  return insertIntoController(fnSource, (path) => {
    const body = path.get('body', 'body')

    body.unshift(resize)
    body.unshift(windowEle)

    insertComponentLifecycleHook(body, '$onInit', onResize)
    insertComponentLifecycleHook(body, '$onDestroy', offResize)

    body.push(clear)
  })
}

module.exports = insertSignatureLogic
