# processForm function

`processForm(cfg, definition) => Promise<void>`

The Forms CLI does the job of getting a forms definition from your definition source (answerSpace or JSON files currently supported), normalizing it, then passing each form to your plug-in, collecting the results.

`processForm` is called by the Forms CLI and passed the Forms Configuration stored in `.blinkmrc.json` and a single form definition in [normalized JSON](normalised-json-structure.md). Its job is to do whatever is needed to prepare the definition, and write the source files for the framework  to the `sourcePath` directory. As such there are no rules to what you do with the definition, as frameworks vary, the job of `processForm` varies from framework to framework.

It is recommended to use the [template-helper](../packages/template-helper) module, which provides functions to load templates from a folder using `makeTemplateStore(templatePath)`, create "primed" mustache templates and a `write` function that is used by the AngularJS plug-in to write source files to the `sourcePath` directory.

For a full implementation example, see the [AngularJS](../packages/bm-plugin-forms-angularjs) or [JSON](../packages/bm-plugin-forms-json) plug-ins.
