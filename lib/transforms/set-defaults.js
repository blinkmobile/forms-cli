'use strict'

function extractDefaults (el) {
  switch (el.type) {
    case 'text':
    case 'textarea':
    case 'date':
    case 'datetime':
    case 'time':
      el.value = el.defaultValue ? `'${el.defaultValue}'` : undefined
      break
    default:
      el.value = el.defaultValue
  }

  return el
}

module.exports = extractDefaults
