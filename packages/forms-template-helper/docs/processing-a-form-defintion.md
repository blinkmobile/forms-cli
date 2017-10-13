# Using the template helper when processing a form definition

When the Forms cli calls your plugin's `processForm()` function you are given a form in a specific format. You can do whatever you want to this definition, but at the end of the function `processForm()` should write source file(s) to the `sourcePath` directory specified in the Configuration.

For examples of what you might do in `processForm()` you can see the [JSON Transformer](https://github.com/blinkmobile/forms-cli/blob/master/packages/bm-plugin-forms-json/lib/process-form.js) or the [AngularJS Transformer](https://github.com/blinkmobile/forms-cli/blob/master/packages/bm-plugin-forms-angularjs/lib/transform/process-form.js)

The AngularJS transformer uses both HTML and Javascript templates, and uses the `writeFile` function write those HTML and Javascript files to `sourcePath`.

