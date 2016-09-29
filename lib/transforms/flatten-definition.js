'use strict'

module.exports = (variation, debug) => (el) => {
  const result = Object.assign({}, el.default || el, el[variation] || {})
  debug && console.log(`flattening ${variation}`, el, 'result=', result)
  return result
}
