'use strict'

const path = require('path')
const fs = require('fs')

const mkdirp = require('mkdirp')
const rcopy = require('recursive-copy')
const inquirer = require('inquirer')
const rimraf = require('rimraf')

const TEMPLATE_SRC = path.resolve(path.join(__dirname, '..', '..', 'templates', 'angularjs'))

const rejectOnError = require('../utils/maybe-reject-on-error.js')

function checkTemplatePath (templatePath) {
  return new Promise((resolve, reject) => {
    const maybe = rejectOnError(resolve) // its not an error if the path doesn't exist!

    fs.access(templatePath, (err) => {
      if (maybe(err)) {
        inquirer.prompt({
          name: 'continue',
          type: 'confirm',
          message: 'The template path already exists, it will be overwritten if you continue. Do you want to continue?',
          default: false
        }).then((answer) => answer.continue ? resolve() : reject(new Error('cancelled')))
          .catch(() => reject(new Error('cancelled')))
      }
    })
  })
}

function writeTemplates (cfg) {
  const templatePath = cfg.templatePath

  return checkTemplatePath(templatePath).then(() => {
    return new Promise((resolve, reject) => {
      const maybe = rejectOnError(reject)

      rimraf(templatePath, (err) => {
        if (maybe(err)) {
          mkdirp(templatePath, (err) => {
            if (maybe(err)) {
              fs.access(TEMPLATE_SRC, (err) => {
                maybe(err) && rcopy(TEMPLATE_SRC, templatePath, (err) => maybe(err) && resolve())
              })
            }
          })
        }
      })
    })
  })
}

module.exports = writeTemplates
