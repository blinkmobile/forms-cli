'use strict'

const path = require('path')

const mkdirp = require('mkdirp')

const writeFileContents = require('../utils/write-file-contents.js').writeFileContents
const createJsonSchema = require('./create-form-schema.js')

const logError = (err) => console.log(err)

function writeFormSchema (outputPath, form) {
  const filePath = path.join(outputPath, 'form-schema')
  mkdirp(filePath, (err) => {
    if (err && err.code !== 'EEXIST') {
      logError(err)
      return
    }

    const schemaFile = path.join(filePath, `${form.name}-${form.action}.json`)
    createJsonSchema(form)
      .then((schema) => writeFileContents(schemaFile, JSON.stringify(schema)))
      .catch(logError)
  })
}

module.exports = writeFormSchema
