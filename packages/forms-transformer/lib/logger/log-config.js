'use strict'

const log4js = require('log4js')

// https://github.com/nomiddlename/log4js-node/wiki/Appenders
// https://github.com/nomiddlename/log4js-node/wiki/Layouts

const CATEGORIES = {
  USER: 'USER',
  DEBUG: 'DEBUG',
  ERROR: 'ERROR'
}

const seperator = ','
const logDisplayPattern = `[%p]${seperator}%d{ISO8601_WITH_TZ_OFFSET}${seperator}%x{errDetails}${seperator}%x{summary}`
const quote = (str) => `"${str.replace(/"/g, '\\"')}"`

const tokens = {
  summary: function (input) {
    if (!input.data[0].stack) {
      return quote(input.data[0])
    }

    return quote(input.data[0].stack.split('\n')[0])
  },
  errDetails: function () {
    return (new Error()).stack.split('\n')[10]
      .replace(/\s*at\s.+\s\((.+):(\d+):\d+\)/, (match, filename, line) => {
        return quote(filename.trim()) + seperator + line.trim()
      })
  }
}

function init ({isDebugMode, isStdErrEnabled}) {
  const appenders = [{
    type: 'console',
    category: [CATEGORIES.USER],
    layout: {
      type: 'pattern',
      pattern: '%m%n'
    }
  }]

  if (isDebugMode) {
    appenders.push({
      type: 'file',
      filename: 'blink-forms-debug.log',
      category: [CATEGORIES.DEBUG, CATEGORIES.ERROR],
      maxLogSize: 2 * 1024 * 1024, // = 2Mb
      numBackups: 1, // keep five backup files
      compress: true, // compress the backups
      encoding: 'utf-8',
      layout: {
        type: 'pattern',
        pattern: logDisplayPattern,
        tokens
      }
    })
  }

  if (isStdErrEnabled) {
    appenders.push({
      type: 'stderr',
      category: [CATEGORIES.ERROR],
      layout: {
        type: 'pattern',
        pattern: logDisplayPattern,
        tokens
      }
    })
  }

  log4js.configure({appenders})

  return log4js
}

module.exports = {
  init,
  log4js,
  CATEGORIES
}
