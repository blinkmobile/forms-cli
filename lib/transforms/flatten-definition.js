'use strict'

module.exports = (variation) => (el) => Object.assign({}, el.default, el[variation] || {})
