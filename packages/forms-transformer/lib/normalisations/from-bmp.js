'use strict'

const url = require('url')

const normalisationTransducer = require('../transducers/normalisation.js').normaliseForm

// get forms from a live answerspace
const getAnswerspaceId = require('../utils/answerspace/fetch-answerspace-id.js')
const getFormDefinition = require('../utils/answerspace/fetch-forms.js')

const hostName = (_, answerspaceUrl) => {
  const u = url.parse(answerspaceUrl)

  return `${u.protocol}//${u.host}`
}

// normalise a BMP form definition
function normalise ({definitionSource: answerspace}) {
  const answerspaceDetails = {
    answerspaceName: answerspace,
    platformURL: hostName`${answerspace}`
  }

  return getAnswerspaceId(answerspace)
    .then((id) => {
      answerspaceDetails.answerspaceId = id

      return getFormDefinition(answerspace, id)
    })
    .then((data) => data.map((f) => normalisationTransducer(f, answerspaceDetails)))
}

module.exports = normalise
