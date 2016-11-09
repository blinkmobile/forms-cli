'use strict'

const path = require('path')

const memoize = require('lodash.memoize')

const loadFolderAsObject = require('../utils/folder-to-object.js')

const DEFINITION_FOLDER = 'field-type-definitions'
const elementSchemaloader = memoize(loadFolderAsObject)

function createSchema (form) {
  return elementSchemaloader(path.join(__dirname, DEFINITION_FOLDER))
    .then((elementSchemas) => {
      const schema = {
        '$schema': 'http://json-schema.org/schema#',
        title: form.name,
        type: 'object'
      }

      schema.properties = form._elements.reduce((memo, el) => {
        const fn = (el) => {
          console.log(`running schema generator for ${el.name}, type: ${el.type}`)
          return (elementSchemas[el.name] || ((el) => ''))(el)
        }

        const result = fn(el)
        if (result) {
          memo.push(result)
        }

        return memo
      }, [])

      return schema
    }).catch((err) => console.log(`Error, createSchema failed:
${err}`))
}

module.exports = createSchema
