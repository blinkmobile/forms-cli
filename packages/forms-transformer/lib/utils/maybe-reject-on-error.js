'use strict'

module.exports = (reject) => (err) => err ? reject(err) : true
