'use strict'

function extractDefaults (el) {
  switch (el.type) {
    case 'text':
    case 'textarea':
    case 'password':
    case 'radio':
    case 'email':
    case 'url':
      el.value = el.defaultValue ? JSON.stringify(el.defaultValue) : undefined
      break
    case 'checkboxes':
    case 'select':
      if (el.multi) {
        el.value = el.defaultValue ? `[${JSON.stringify(el.defaultValue)}]` : '[]'
      } else {
        el.value = el.defaultValue ? JSON.stringify(el.defaultValue) : undefined
      }
      break
    default:
      el.value = el.defaultValue
  }

  return el
}

module.exports = extractDefaults
