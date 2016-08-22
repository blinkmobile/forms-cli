'use strict'

const createRenderer = require('./lib/utils/template-helper.js').createRenderer

module.exports = function (paths, fn) {
  return Promise.all(paths.map((path) => createRenderer(path)))
}
