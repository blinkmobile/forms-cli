module.exports = `
Usage: bm forms <command>

Where command is one of:

  init, create, build, plugin

Initialising the builder properties

  Asks a series of questions to initialise the library build folders, and then
  copies the Framework templates to the specified folder.

  init          => creates or appends configuration details to .blinkmrc.json

Creating the Library Source

  Reads your Forms definition and uses the Framework templates to build the
  library source, and then saves it to the specified folder.
  This command will build the library automatically, however you can prevent
  this command from building so that you can edit the source files if you
  require further customisation of your forms library

  create        => uses the framework templates to create the source for the
                   forms library
    --no-build  => does not build the compiled library

Building the Library distribution file

  If you have modified your source files you will need to build the library,
  otherwise this command is automatically run when you run 'create'

  build         => builds the library file from the source folder

Plugins

  Front end frameworks are supported via plugins to the Forms Builder.

  plugin        => display the help for plugin commands

`
