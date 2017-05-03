'use strict'

const isGlob = require('has-glob')
const glob = require('glob')

const bmpNormalise = require('../normalisations/from-bmp.js')
const jsonNormalise = require('../normalisations/from-json-files.js')

const bmpCompile = (options) => () => bmpNormalise(options)
const fileCompile = (options) => () => jsonNormalise(options.definitionSource)
const getFileFromGlob = (options) => () => jsonNormalise(glob.sync(options.definitionSource))

function decide (options) {
  switch (true) {
    case /^https?:\/\/(.*)?blinkm\.co/.test(options.definitionSource):
      return bmpCompile(options)
    case isGlob(options.definitionSource):
      return getFileFromGlob(options)
    default:
      return fileCompile(options)
  }
}

module.exports = decide
