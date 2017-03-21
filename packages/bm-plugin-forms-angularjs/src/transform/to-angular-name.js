'use strict'

module.exports = (str) => str[0].toLowerCase() + str.substr(1).replace(/(_[a-z0-9])/gi, (match) => (match[1] + '').toUpperCase())
