const Ajv = require('ajv')
const defaultOptions = require('./default-validator-options.json')
const defaultValidatorKeywords = require('./default-validator-keywords.js')

function createValidator (customOptions = {}, customKeywords = {}) {
  const ajv = new Ajv(Object.assign({}, defaultOptions, customOptions))
  const keywords = Object.assign({}, defaultValidatorKeywords, customKeywords)

  Object.keys(keywords).forEach((keyword) => ajv.addKeyword(keyword, keywords[keyword]))

  return ajv
}

module.exports = createValidator
