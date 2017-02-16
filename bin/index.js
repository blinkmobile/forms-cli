'use strict'

// foreign modules

const meow = require('meow')

// local modules

const main = require('..')
const help = require('../lib/help.js')

// this module

const cli = meow({
  help,
  version: true
}, {
  string: ['create', 'init']
})

main(cli.input, cli.flags)
