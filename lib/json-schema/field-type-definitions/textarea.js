'use strict'

function makeSchema (el) {
  const schema = {
    textarea: {
      type: 'string'
    }
  }

  const props = schema.textarea

  if (el.characterLimit) {
    props.maxLength = el.characterLimit
  }

  if (el.wordLimit) {
    // ???
  }

  if (el.required) {
    props.required = true
  }

  return schema
}

module.exports = makeSchema
