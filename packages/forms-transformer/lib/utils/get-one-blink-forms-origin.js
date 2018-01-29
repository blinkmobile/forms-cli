'use strict'

module.exports = ((config) => {
  return config.service && config.service.origin ? config.service.origin : 'https://forms-service.blinkm.io'
})
