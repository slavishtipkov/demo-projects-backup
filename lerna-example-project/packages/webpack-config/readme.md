# @dtn/webpack-config

## Install

```sh
npm install --dev @dtn/webpack-build webpack
```

## Usage

Create a `webpack.config.globals.js` file in the root of your project.

```JavaScript
module.exports = require("@dtn/webpack-config").globals;
```

And add a `build` command to the scripts section of `package.json`. Optionally add a `start` command to run webpack in development mode.

```json
{
  ...
  "scripts": {
    "globals": "webpack --config webpack.config.globals.js --output-path ./dist --output-filename 'filename.js'"
  }
}
```

Run the build with `npm run-script build` or start the development build with `npm start`.
