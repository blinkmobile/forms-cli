'use strict'

const t = require('transducers-js')

const accum = require('../accumulators/object-accum.js')

const getDefaultForm = (f) => f[0].toLowerCase() === 'default'
const getDefaultValue = (f) => f.default

function extractDefault (obj) {
  const xf = t.map(getDefaultValue)

  return t.into([], xf, obj)
}

function getTargetOfAction (actions, actionName) {
  const action = actions.filter((a) => a.name === actionName)
  if (action.length) {
    const a = action[0]
    return a.manipulations[0].target
  }
}

function addConditionalsToElements (form) {
  const a = form._actions
  const b = form._behaviours
  const e = form._elements

  b.forEach((behavior) => {
    const fnName = behavior.check
    const elementName = getTargetOfAction(a, behavior.actions[0].action)
    if (!elementName) {
      return
    }
    const el = e.filter((el) => el.name === elementName)[0]
    el.showWhen = fnName
  })

  return form
}

function normaliseArrays (form) {
  form._elements = extractDefault(form._elements)
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
