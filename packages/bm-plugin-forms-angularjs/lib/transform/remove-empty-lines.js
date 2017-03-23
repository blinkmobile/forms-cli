'use strict'

module.exports = (str) => str.replace(/[\r\n]^[\s]+$/gm, '')
