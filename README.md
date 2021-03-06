# Blink Forms CLI

[![Greenkeeper badge](https://badges.greenkeeper.io/blinkmobile/forms-cli.svg)](https://greenkeeper.io/)

A tool that takes a Blink Forms definition and converts it into a HTML form for inclusion in a web project.

Currently only works with [Blink Forms definitions](http://blinkmobile.com.au/blink-intelligent-client-bic-forms-interpreter) or our [normalised JSON definition](docs/normalised-json-structure.md)

## Supported Frameworks

- AngularJS 1.5+
- JSON


## Overview

1. BlinkMobile customers create a form definition in our Forms Builder
2. `bm forms init` configures the cli via a series of prompts
3. `bm forms create` is run
4. The source for the forms is written to a folder specified in step #2
5. Developers can modify that source if they please
6. `bm forms build` builds the final library
7. Developers then include the library in their own project just as any other 3rd party library

Please check the [docs/](docs) folder for details on each command and its options.
