# processForm function

`processForm(definition) => Array<() => Promise>`

The Forms CLI does the job of getting a forms definition from your definition source (answerSpace, JSON files currently supported or OneBlink Forms), normalizing it, then passing each form to your plug-in, collecting the results.

`processForm` is called by the Forms CLI and passed a single form definition in [normalized JSON](normalised-json-structure.md). Its job is to do whatever is needed to prepare the definition, and then return a function (or array of functions) that return a Promise. As such there is no rules to what you do with the definition, as frameworks vary, the job of `processForm` varies from framework to framework.

It is recommended to use the [template-helper](../packages/template-helper) module, which provides functions to load templates from a folder, create "primed" mustache templates and a lazyWriter function that is used by the AngularJS plug-in as the return value of `processForm`.

For a full implementation example, see the [AngularJS](../packages/bm-plugin-forms-angularjs) or [JSON](../packages/bm-plugin-forms-json) plug-ins.
