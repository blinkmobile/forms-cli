# Blink Forms CLI

A tool that takes a Blink Forms definition and converts it into a HTML form for inclusion in a web project.

Currently only works with [Blink Forms definitions](http://blinkmobile.com.au/blink-intelligent-client-bic-forms-interpreter).

## Supported Frameworks

- AngularJS 1.5+


## Overview

1. BlinkMobile customers create a form definition in our Forms Builder
2. `bm forms init` configures the cli via a series of prompts
3. `bm forms create` is run
4. The source for the forms is written to a folder specified in step #2
5. Developers can modify that source if they please
6. `bm forms build` builds the final library
7. Developers then include the library in their own project just as any other 3rd party library

Please check the [docs/](docs) folder for details on each command and its options.

## Suggested Usage

To create a web app using forms, we recommend using npm to manage your dependencies.

Start with a folder for your project, and inside that create a folder to hold the forms components

```
|--my-project
|  |-my-forms
```

cd into `my-project` and run `npm init` followed by `git init`. This will setup your `package.json` and initialize a git repository

`bm forms init` is then run. For the question "Which folder should I write the component source to?" answer with "my-forms/src" and then accept the defaults. For the framework select "AngularJS" (More framework plugins are in the works)

If the defaults are used you should end up with a folder structure that matches the following

```
|--my-project/
|--.git/
|--node_modules/
|--my-forms/
|  |--templates/
|--.blinkmrc.json
|--package.json
```

The plugin that forms builder will use to provide the templates and transformation code lives inside `my-project/node_modules`. This works the same as [babel plugins](https://babeljs.io/docs/plugins/#plugin-preset-paths)

The plugin is referenced in `.blinkmrc.json` by name:

```json
{
  "forms": {
    "answerspace": "https://blinkm.co/demo",
    "distPath": "my-forms/dist",
    "framework": "@blinkmobile/bm-plugin-forms-angularjs",
    "outputPath": "my-forms/src",
    "templatePath": "my-forms/templates"
  }
}
```
The "framework" value means the plugin is found in `node_modules/@blinkmobile/bm-plugin-forms-angularjs/`

Currently we only support loading the the plugin via `node_modules`.

`my-forms/templates` contains templates used by the transforms in the plugin. You can modify them to include any html/javascript you want, once you are done editing they can be committed to your VCS. For more information on editing the templates, see the template documentation.

We recommend running `bm forms create` before editing the templates so you can see what a default form will look like.

You will now have `my-forms/src` and `my-forms/dist` :

```
|--my-project/
|  |--.git/
|  |--node_modules/
|  |--my-forms/
|  |  |--dist
|  |  |--src
|  |  |--templates/
|  |--.blinkmrc.json
|  |--package.json
```

Depending on the framework plugin used, the `my-forms/dist/` folder will contain your form components. For more details on the output of the plugins, please see the plugins `docs/` folder.
