'use strict'

const memoize = require('lodash.memoize')

const loadFolderAsObject = require('../utils/folder-to-object.js')

const KEYWORDS_FOLDER = 'keywords'
const loader = memoize(loadFolderAsObject)

function defaultKeywords () {
  return memoize(loadFolderAsObject).then()
}
