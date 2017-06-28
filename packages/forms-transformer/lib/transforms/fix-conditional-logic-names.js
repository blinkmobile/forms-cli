'use strict'

// This regex replaces any numbers at the start of a string and anything that isn't
// a character, number or underscore in the tail of the string with ''
const fixName = (str) => str.replace(/^[0-9]|[^a-z0-9_]/ig, '')

function fixBehaviorChecks (el) {
  if (el.name) {
    el.name = fixName(el.name)
  }

  if (el.check) {
    el.check = fixName(el.check)
  }

  return el
}

function fixNameFields (el) {
  if (el.name) {
    el.name = fixName(el.name)
  }

  return el
}

module.exports = {
  fixBehaviorChecks,
  fixNameFields
}
