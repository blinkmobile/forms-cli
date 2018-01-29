'use strict'

module.exports = ((config) => {
  return config.authorisationService && config.authorisationService.origin ? config.authorisationService.origin : 'https://auth-api.blinkm.io'
})
