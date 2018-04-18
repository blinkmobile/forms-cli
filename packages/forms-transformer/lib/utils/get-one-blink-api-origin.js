'use strict'

module.exports = (config) => {
  return config.apiService && config.apiService.origin ? config.apiService.origin : 'https://api.oneblink.io'
}
