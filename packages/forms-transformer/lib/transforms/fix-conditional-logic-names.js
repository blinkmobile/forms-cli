'use strict'

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
