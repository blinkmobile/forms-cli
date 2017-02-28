'use strict'

const t = require('transducers-js')

const accum = require('../accumulators/object-accum.js')
const arrayAccum = require('../accumulators/array-accum.js')
const fixChoice = require('../transforms/fix-choice.js')
const fixHeadings = require('../transforms/fix-headings.js')

const getDefaultForm = (f) => f[0].toLowerCase() === 'default'
const getDefaultValue = (f) => f.default

const UNSUPPORTED_FIELDS = [
  'message',
  'button',
  'location'
]

function extractDefault (obj) {
  const xf = t.map(getDefaultValue)

  return t.into([], xf, obj)
}

function getAction (actions, actionName) {
  const action = actions.filter((a) => a.name === actionName)
  if (action.length) {
    const a = action[0]
    return a.manipulations[0]
  }
}

function addConditionalsToElements (form) {
  const a = form._actions
  const b = form._behaviours
  const e = form._elements

  b.forEach((behavior) => {
    const fnName = behavior.check
    const action = getAction(a, behavior.actions[0].action)
    if (!action) {
      return
    }
    const el = e.filter((el) => el.name === action.target)[0]
    if (action.properties.hidden) {
      el.hideWhen = el.hideWhen || fnName
    } else {
      el.showWhen = el.showWhen || fnName
    }
  })

  return form
}

function normaliseFields (fields) {
  const xf = t.comp(t.filter((el) => UNSUPPORTED_FIELDS.indexOf(el.type) === -1),
                    t.map(fixChoice),
                    t.map(fixHeadings))

  return t.transduce(xf, arrayAccum, [], fields)
}

function normaliseArrays (form) {
  form._elements = normaliseFields(extractDefault(form._elements))
  form._checks = extractDefault(form._checks)
  form._actions = extractDefault(form._actions)
  form._behaviours = extractDefault(form._behaviours)

  return addConditionalsToElements(form)
}

function normaliseForm (definition) {
  const xf = t.comp(t.filter(getDefaultForm), t.map((f) => f[1]), t.map((f) => normaliseArrays(f)))

  return t.transduce(xf, accum, {}, definition)
}

module.exports = {normaliseForm, normaliseArrays}
