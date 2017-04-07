'use strict'

module.exports = `
Usage: bm forms plugin <command>

Where command is one of:

  add, remove, info

Adding a plugin

  Currently only adding one plugin in per Forms Project is supported.

  A plugin defines the transformation logic and templates for a particular
  front end framework. If you have already selected a plugin during
  \`bm forms init\` you only need to run this command if you want to install
  a custom plugin

  add <plugin-path>     =>  Runs \`npm install <plugin-path> --save\`, and updates
                            the \`.blinkmrc.json\` file with the plugin name

  remove <plugin-name>  =>  Runs \`npm rm <plugin-name> --save\` and updates the
                            \`.blinkmrc.json\` file to remove the plugin name

  info                  =>  Displays information about the installed plugin

  templates             =>  Extract the template files into the template path
                            specified in \`.blinkmrc.json\`
`
