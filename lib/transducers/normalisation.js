'use strict'

const t = require('transducers-js')

const accum = require('../accumulators/object-accum.js')

const getDefaultForm = (f) => f[0].toLowerCase() === 'default'
const getDefaultValue = (f) => f.default

function extractDefault (obj) {
  const xf = t.map(getDefaultValue)

  return t.into([], xf, obj)
}

function normaliseArrays (form) {
  form._elements = extractDefault(form._elements)
  form._checks = extractDefault(form._checks)
  form._actions = extractDefault(form._actions)
  form._behaviours = extractDefault(form._behaviours)

  return form
}

function normaliseForm (definition) {
  const xf = t.comp(t.filter(getDefaultForm), t.map((f) => f[1]), t.map((f) => normaliseArrays(f)))

  return t.transduce(xf, accum, {}, definition)
}

module.exports = {normaliseForm, normaliseArrays}
