# Blink Forms Forms JSON Renderer

Renders a Blink Mobile Form Definition to a normalised JSON structure, then writes that structure to files. For use with the Forms Transformer.

## Installation

Make sure you have the Forms transformer extention to the Blink Mobile Technologies CLI installed:

```
npm install -g @blinkmobile/cli @blinkmobile/forms-cli
```

Create your `.blinkmrc.json` in your project folder

```sh
$ mkdir my-project
$ cd my-project
$ bm forms init
```

When prompted, select "JSON" from the list of plugins.

The resulting JSON files will be written to the `sourcePath` (component source) folder in `my-project`
