'use strict'

const t = require('transducers-js')

const getElements = (form) => form.default._elements
const getDefaultValues = (el) => el.default
const isSubForm = (el) => el.type.toLowerCase() === 'subform'
const getName = (el) => el.subForm
const getSubformNames = t.comp(t.mapcat(getElements), t.map(getDefaultValues), t.filter(isSubForm), t.map(getName))

module.exports = function (definition) {
  return t.into([], getSubformNames, definition)
}
