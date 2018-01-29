'use strict'

const isGlob = require('has-glob')
const glob = require('glob')

const bmpNormalise = require('../normalisations/from-bmp.js')
const jsonNormalise = require('../normalisations/from-json-files.js')
const oneBlinkFormsNormalise = require('../normalisations/from-one-blink-forms.js')

const bmpCompile = (options) => () => bmpNormalise(options)
const fileCompile = (options) => () => jsonNormalise(options.definitionSource)
const getFileFromGlob = (options) => () => jsonNormalise(glob.sync(options.definitionSource))
const oneBlinkFormsCompile = (options) => () => oneBlinkFormsNormalise(options)

function decide (options) {
  switch (true) {
    case /^https?:\/\/(.*)?blinkm\.co/.test(options.definitionSource):
      return bmpCompile(options)
    case isGlob(options.definitionSource):
      return getFileFromGlob(options)
    case Array.isArray(options.definitionSource):
      return oneBlinkFormsCompile(options)
    default:
      return fileCompile(options)
  }
}

module.exports = decide
