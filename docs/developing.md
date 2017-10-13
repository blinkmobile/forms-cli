# Developing

The forms transformer is a monorepo. There are a few tools you need to be familiar with.

- [lerna](https://lernajs.io/)
- [npm link](https://docs.npmjs.com/cli/link)

## Setup

1. Clone the repo
2. From the project root folder, run `npm run lerna:bootstrap`

## Development

Working on a monorepo is much like a normal repo, the main difference is package dependencies. All devDependencies are kept at the root level, and the individual packages only list the dependencies they need

### Installing a dependency from NPM

This works the same as usual

1. `cd packages/blah` where `blah` is the package that needs the module
2. `npm i --save <module name>`

### Installing dependency from the repo

Assuming `parent-package` is the package that will include the dependency, and `@blinkmobile/new-package` v1.0.0-alpha is the new package you are adding

1. `cd packages/parent-package`
2. edit the 'dependencies' property in `package.json` to include a new property:
```
{
  "dependencies": {
    "@blinkmobile/new-package": "1.0.0-alpha"
  }
}
```
3. cd to the repo base folder
4. run `npm run lerna:bootstrap`

## Testing

- Name your tests with the following format `original-file-name.test.js`
- Run all tests from the repo base folder via `npm run test`

## Using

Make sure you have [@blinkmobile/cli](https://www.npmjs.com/package/@blinkmobile/cli) installed.

1. cd into the `packages/forms-transformer` folder
2. link the package using `npm link`
3. you should now be able to run `bm forms`

Once this is done, `packages/forms-transformer` is symlinked to the global npm folder, meaning any changes to the code are reflected in the cli program
