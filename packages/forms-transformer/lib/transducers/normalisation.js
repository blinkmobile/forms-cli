'use strict'

const t = require('transducers-js')

const debugLogger = require('../logger/loggers.js').debugLogger
const accum = require('../accumulators/object-accum.js')
const arrayAccum = require('../accumulators/array-accum.js')
const fixChoice = require('../transforms/fix-choice.js')
const fixHeadings = require('../transforms/fix-headings.js')
const fixCamera = require('../transforms/fix-camera.js')
const fixId = require('../transforms/fix-id.js')
const setDefaultValues = require('../transforms/set-defaults.js')

const getDefaultForm = (f) => f[0].toLowerCase() === 'default'
const getDefaultValue = (f) => f.default
const removeEmpty = (f) => !!f

const UNSUPPORTED_FIELDS = [
  'message',
  'button'
]

function extractDefault (obj) {
  const xf = t.comp(t.map(getDefaultValue), t.filter(removeEmpty))

  const result = t.into([], xf, obj)
  return result
}

function getAction (actions, actionName) {
  const action = actions.filter((a) => a.name === actionName)
  if (action.length) {
    const a = action[0]
    return a.manipulations[0]
  }
}

function addConditionalsToElements (form) {
  const a = form._actions || []
  const b = form._behaviours || []
  const e = form._elements || []

  b.forEach((behavior) => {
    const fnName = behavior.check
    behavior.actions.forEach((actn) => {
      const action = getAction(a, actn.action)
      if (!action) {
        return
      }
      const el = e.filter((el) => el.name === action.target)[0]
      if (!el) {
        return
      }

      if (action.properties.hidden) {
        el.hideWhen = el.hideWhen || fnName
      } else {
        el.showWhen = el.showWhen || fnName
      }
    })
  })

  return form
}

function normaliseFields (fields) {
  const xf = t.comp(t.filter((el) => UNSUPPORTED_FIELDS.indexOf(el.type) === -1),
    t.map(fixChoice),
    t.map(fixHeadings),
    t.map(fixCamera),
    t.map(fixId),
    t.map(setDefaultValues))

  return t.transduce(xf, arrayAccum, [], fields)
}

function normaliseArrays (form) {
  form._elements = normaliseFields(extractDefault(form._elements)) || []
  form._checks = extractDefault(form._checks) || []
  form._actions = extractDefault(form._actions) || []
  form._behaviours = extractDefault(form._behaviours) || []

  return addConditionalsToElements(form)
}

function normaliseForm (definition, answerspaceDetails) {
  const xf = t.comp(t.filter(getDefaultForm), t.map((f) => f[1]), t.map((f) => Object.assign({}, f, answerspaceDetails)), t.map((f) => normaliseArrays(f)))

  const result = t.transduce(xf, accum, {}, definition)
  debugLogger.debug(`normalised Form: ${JSON.stringify(result)}`)

  return result
}

module.exports = {normaliseForm, normaliseArrays}
