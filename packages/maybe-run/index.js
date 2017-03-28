'use strict'

module.exports = (cb) => (val) => val ? cb(val) : true
