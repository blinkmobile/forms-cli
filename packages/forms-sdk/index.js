// @flow

const writeSite = require('./lib/write-site').writeSite

const privates = new WeakMap()

module.exports = class FormsSDK {
  constructor (plugin /*: FormsSDKPlugin */) {
    if (!plugin) throw new Error('Plugin is required')
    privates.set(this, { plugin })
  }

  get plugin () /*: ?FormsSDKPlugin */ {
    const p = privates.get(this)
    if (!p) return null

    return p.plugin
  }

  ejectTemplates (destPath /*: string */) /*: Promise<void> */ {
    if (!destPath) throw new Error('template destination path is required')
    return this.plugin.init({templatePath: destPath})
      .then(() => this.plugin.writeTemplates(destPath))
  }

  generateSource (
    templatePath /*: string */,
    destPath /*: string */,
    formDef /*: FormDefinition */
  ) /*: Promise<void> */ {
    if (!templatePath) throw new Error('template path is required')
    if (!destPath) throw new Error('source destination path is required')
    if (!formDef) throw new Error('form definition is required')

    return this.plugin.init({templatePath})
      .then(() => this.plugin.processForm(formDef))
      .then((formData) => ({[formDef.name]: formData}))
      .then((formData) => writeSite(destPath, formData))
  }

  buildDist (
    templatePath /*: string */,
    srcPath /*: string */,
    destPath /*: string */
  ) /*: Promise<string[]> */ {
    if (!destPath) throw new Error('destination path is required')
    if (!srcPath) throw new Error('source path is required')
    if (!templatePath) throw new Error('template path is required')
    return this.plugin.init({templatePath})
      .then(() => this.plugin.build({sourcePath: srcPath, distPath: destPath, templatePath}))
  }
}
