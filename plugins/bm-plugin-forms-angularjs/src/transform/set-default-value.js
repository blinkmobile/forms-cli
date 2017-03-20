'use strict'

const defaultTypeValues = require('./default-field-types.json')

function setDefaultValue (el) {
  el.value = el.value || defaultTypeValues[el.type]
  switch (el.type) {
    case 'date':
    case 'datetime':
    case 'time':
      el.value = `new Date("")` // eslint-disable-line quotes
  }
  return el
}

module.exports = setDefaultValue
