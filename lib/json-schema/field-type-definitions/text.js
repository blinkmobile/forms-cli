'use strict'

function makeSchema (el) {
  const schema = {
    text: {
      type: 'string'
    }
  }

  const props = schema.text

  if (el.characterLimit) {
    props.maxLength = el.characterLimit
  }

  if (el.required) {
    props.required = true
  }

  return schema
}

module.exports = makeSchema
