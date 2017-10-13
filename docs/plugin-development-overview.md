# Developing a Plugin for Forms CLI

For a full implementation example, see the [AngularJS](../packages/bm-plugin-forms-angularjs) or [JSON](../packages/bm-plugin-forms-json) plug-ins.

## Prerequisites

We recommend familiarising yourself with how the Forms CLI works before writing a plug-in.

## What is a Forms CLI Plug-in

The Forms CLI uses the plug-in to turn a JSON definition of a form into source code for a specific framework. It deals only with forms and their functionality, however you could write a plug-in pack that will build an entire project. That is beyond the scope of this document.

A plug-in consists of an entry point that exposes four functions that are called at various points by the Forms CLI.

Plug-ins can define a set of templates for a front end framework (AngularJS, Vue, React etc), and then combine those templates with a form definition provided by the Forms CLI to create the "source" for your Forms in the famework of your choice.

The plug-in can optionally define a build step to build the source files into a bundled module.

# Plugin API

A Forms CLI plug-in must expose an object of the following structure

```javascript
{
  build: (cfg) => Promise,
  init: (cfg) => Promise,
  processForm: (cfg, formDefinition) => Promise,
  writeTemplates: (destinationPath) => Promise
}
```
The fields are documented in more detail [here](sample-plugin-index.md)

Your plug-in is a node module, much like `gulp` or `babel` plug ins. You should be familiar with setting up your [package.json](https://docs.npmjs.com/files/package.json#main) correctly.

## Forms CLI and plugin interaction Overview

First, you should read [general.md](general.md) to familiarize yourself with the process of creating a forms component from a definition.

The Forms CLI works with plug-ins that are specific to certain frameworks. These plug-ins are installed into your projects folder, like gulp or babel plug-ins.

The Forms CLI is lightweight and the bulk of the work is done in the plug-ins installed into your projects folder.

`processForm` is called by the command `bm forms create`. `bm forms create` will handle the job of getting the definition from its source, normalizing the structure into a specific JSON structure. Then it will iterate over each form, passing the whole form definition to your `processForm` function. `processForm` needs to return a Promise. Normally the `processForm` function would use the [template-helper](../packages/template-helper) functions to write the source files for the framework you are building for. The [AngularJS](../packages/bm-plugin-forms-angularjs) plugin makes extensive use of the template helper.

`build` is called from `bm forms build` will take the source files made by `bm forms create` and run the build command from the installed plugin. The AngularJS plugin uses gulp to build a distribution file and setup a simple index.html, however you may elect to leave the `build` function empty (by passing back `Promise.resolve()`) and include the building of your forms library in your app's build step.

## Developing a custom plug in

Currently we only support plug-ins installed in a `node_modules` folder in your projects folder. To develop a plugin we recommend making a new project folder for the plug in (that is not in the project that will be using forms components built with the Forms CLI), and then use [npm link](https://docs.npmjs.com/cli/link) to link your plugin to a project using the forms transformer.
