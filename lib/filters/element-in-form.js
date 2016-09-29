'use strict'

module.exports = (required, debug) => (el) => {
  debug && console.log('in form: ', el, ~required.indexOf(el.name) ? "true" : "false")
  return ~required.indexOf(el.name)
}
