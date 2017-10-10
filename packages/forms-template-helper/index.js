'use strict'

module.exports = {
  fileListHelper: require('./lib/file-list-helper.js'),
  readFileContents: require('./lib/read-file-contents.js'),
  mustacheRenderer: require('./lib/renderer-mustache.js'),
  service: require('./lib/template-service.js'),
  writeFile: require('./lib/write-file-contents.js').writeFileContents,
  lazyWriteFile: require('./lib/write-file-contents.js').lazyWriter,
  writeTemplates: require('./lib/write-templates.js'),
  makeTemplateStore: require('./lib/make-template-store')
}
