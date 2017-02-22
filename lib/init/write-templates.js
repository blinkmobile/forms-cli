'use strict'

const path = require('path')
const fs = require('fs')

const mkdirp = require('mkdirp')
const rcopy = require('recursive-copy')

const TEMPLATE_SRC = path.resolve(path.join(__dirname, '..', '..', 'templates', 'angularjs'))

function writeTemplates (cfg) {
  const templatePath = cfg.templatePath

  return new Promise((resolve, reject) => {
    const maybe = (err) => err ? reject(err) : true

    mkdirp(templatePath, (err) => {
      if (maybe(err)) {
        fs.access(TEMPLATE_SRC, (err) => {
          maybe(err) && rcopy(TEMPLATE_SRC, templatePath, (err) => maybe(err) && resolve())
        })
      }
    })
  })
}

module.exports = writeTemplates
