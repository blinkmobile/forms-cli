# Sample plugin index.js

Below is the entrypoint for the [AngularJS Plugin](../packages/bm-plugin-forms-angularjs)


```
'use strict'

const path = require('path')

const build = require('./lib/build/build.js')
const processForm = require('./lib/transform/process-form.js')
const templateHelper = require('@blinkmobile/forms-template-helper')
const templateService = templateHelper.service
const writeTemplates = templateHelper.writeTemplates

module.exports = {
  build,
  init: (cfg) => templateService.load(cfg.templatePath),
  processForm,
  writeTemplates: (dest) => writeTemplates(path.join(__dirname, 'templates'), dest)
}
```

The properties on the exports are required for your plugin to work. The two functions that relate to the template helper are `init` and `writeTemplates`.

## init

`init(cfg) => Promise()`

init is passed the contents of `.blinkmrc.json` incase you need values from it. `init` must return a function, that function must return a promise, but is free to do whatever is needed beforehand. In the AngularJS plugin `init` is where the Mustache renderers are primed and loaded for use in `processForm`

## writeTemplates

`writeTemplates(dest<string>)` => Promise

`writeTemplates` must return a function that takes a destination path and return a Promise. Usually this would be the return value of the template helpers' `writeTemplates` function


## processForm

`processForm(formDefinition<object>) => Array<Function () => Promise()>`

`processform` is called by the transformer with a normalised form definition and is expected to return an array of functions. The functions in the array are expected to return a Promise

## build

`build(cfg) => Promise()`

`build` is called by `bm forms build` or `bm forms create` and is where you would build the source files written by `processForm`. It must return a promise. If no build step is needed you can simply return `Promise.resolve()`
