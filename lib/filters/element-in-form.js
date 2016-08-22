'use strict'

module.exports = (required) => (el) => ~required.indexOf(el.name)
