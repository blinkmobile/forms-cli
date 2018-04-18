'use strict'

const BlinkMobileIdentity = require('@blinkmobile/bm-identity')
const fetch = require('node-fetch')
const queryString = require('querystring')

const prompt = require('../../prompt-config.js')
const pkg = require('../../../package.json')
const debugLogger = require('../../logger/loggers.js').debugLogger
const origin = require('../../utils/get-one-blink-api-origin.js')
const readConfig = require('../../config/read-config.js')

const blinkMobileIdentity = new BlinkMobileIdentity(pkg.name)

module.exports = function () {
  return Promise.all([
    readConfig(false)
      .catch(() => Promise.resolve({})),
    // Get JWT for calling forms service
    blinkMobileIdentity.getAccessToken()
  ])
    .then(([config, jwt]) => {
      return blinkMobileIdentity.getPayload(jwt)
        .then((payload) => {
          const queryStringArgs = queryString.stringify({
            include: 'organisations',
            query: true,
            search: JSON.stringify({
              'links.users': payload.email,
              'privilege.FORMS': {
                '$exists': true
              }
            })
          })
          // Get list of orgs from simple-auth where user has forms permission
          return Promise.all([
            fetch(`${origin(config)}/permissions?${queryStringArgs}`, { headers: { Authorization: `Bearer ${jwt}` } })
              .then((res) => res.json())
              .then((body) => {
                if (body.error) {
                  debugLogger.error(body.error)
                  throw new Error(body.error)
                }
                if (!body.organisations || !body.organisations.length) {
                  debugLogger.error('No organisations found')
                  throw new Error('No organisations found')
                }
                return body.organisations
              }),
            // Pull down all forms they have access too
            fetch(`${origin(config)}/v1/forms`, { headers: { Authorization: `Bearer ${jwt}` } })
              .then((res) => res.json())
              .then((body) => {
                if (body.error) {
                  debugLogger.error(body.message)
                  throw new Error(body.message)
                }
                if (!body.data || !body.data.length) {
                  debugLogger.error('No forms found')
                  throw new Error('No forms found')
                }
                return body.data
              })
          ])
        })
        .then((data) => {
          const organisations = data[0]
          const forms = data[1]

          // Create choices with organisation name as headings.
          const choices = organisations.reduce((formsChoices, organisation) => {
            const organisationsForms = forms.filter((form) => form.organisationId === organisation.id)
            // Only add Organisation heading if there are forms to display
            if (organisationsForms.length) {
              formsChoices.push(new prompt.Separator(organisation.name), ...organisationsForms.map((form) => ({
                name: form.name,
                short: form.name,
                value: form.id
              })))
            }
            return formsChoices
          }, [])

          return {
            type: 'checkbox',
            name: 'definitionSource',
            message: 'Which Form Definitions would you like to include?',
            choices,
            default: config.definitionSource
          }
        })
    })
}
