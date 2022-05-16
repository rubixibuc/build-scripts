# 🔨 build-scripts 🧹

**Batteries included [webpack](https://webpack.js.org/) with [module federation](https://webpack.js.org/concepts/module-federation/) build and linting scripts**

## Quick Start

- create entry file **./src/bootstrap.js**
- optionally create [configuration file](#configuration)

```shell
npx @rubixibuc/build-scripts run
```

## Usage

```shell
npm i -D @rubixibuc/build-scripts
```

and add to package.json

```json
{
  "scripts": {
    "start": "build-scripts run",
    "build": "build-scripts build"
  }
}
```

- create entry file **./src/bootstrap.js**
- optionally create [configuration file](#configuration)

## Example Project Yeoman Generator

[@rubixibuc/generator-sites](https://www.npmjs.com/package/@rubixibuc/generator-sites)

## Importing Assets

**All asset types are supported according to the following rules**

```javascript
import exp from "./some-asset.png?data";
// exp === "data:[...]"

import exp from "./some-asset.png?file";
// exp === "[...]/some-asset.1234.png?file"

import exp from "./some-asset.txt?source";
// exp === "contents of file"

import exp from "./some-image.png?file&as=webp";
// exp === "[...]/some-image.1234.webp"
```

**Specific rules for \*.css imports**

```javascript
import exp from "./some-style.css";
// exp === new CSSStyleSheet()
// https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet

import exp from "./some-style.css?string";
// exp === "contents of file"

import "./some-style.css?style";
// inject as style tag
```

## Example [lint-staged](https://github.com/okonet/lint-staged) Config

```json
{
  "*.js": "build-scripts eslint --cache --fix",
  "*.css": "build-scripts stylelint --fix",
  "*.{json,md}": "build-scripts prettier --fix"
}
```

## Commands

- [build](#build)
- [eslint](#eslint)
- [prettier](#prettier)
- [run](#run)
- [stylelint](#stylelint)

### \[build\]

**Outputs production build to /dist folder**

```shell
build-scripts build
```

### \[eslint\]

**Runs eslint against project files**

```shell
build-scripts eslint [-f, --fix] [-c, --cache] [-mw, --max-warnings <max-warnings>] <paths/globs>
```

### \[prettier\]

**Runs prettier against project files**

```shell
build-scripts prettier [-f, --fix] <paths/globs>
```

### \[run\]

**Runs dev server**

_if specified, command line port overrides setting from config_

```shell
build-scripts run [-p, --port <port>]
```

### \[stylelint\]

**Runs stylelint against project files**

```shell
build-scripts stylelint [-f, --fix] [-cs, --custom-syntax <custom-syntax>] [-mw, --max-warnings <max-warnings>] <paths/globs>
```

## Configuration:

**build-scripts.config.js**

_multiple config file formats are [supported](https://github.com/davidtheclark/cosmiconfig#explorersearch)_

#### example + defaults 👇

```javascript
module.exports = {
  // app meta
  background: "#fff",
  // module federation exposed paths
  exposes: {},
  // inject link tags,
  links: [],
  // favicons (all sizes generated)
  // undefined = "<included image>"
  logo: void 0,
  // injected meta tags,
  metas: [],
  // obfuscator options see: https://github.com/javascript-obfuscator/webpack-obfuscator#obfuscatoroptions
  // falsey = disabled
  // {} = options
  obfuscator: false,
  // includes both "core-js/stable" and "regenerator-runtime/runtime"
  // manually import "@rubixibuc/build-scripts/polyfill"
  // choices: ["entry", false]
  // "entry" = include entry web polyfill
  // false = no web polyfill
  polyfill: "entry",
  // webpack dev server port
  port: 8080,
  // module federation remotes
  remotes: {},
  // injected script tags
  scripts: [],
  // module federation shared modules
  shared: {},
  // app meta
  themeColor: "#fff",
  // site title
  title: "My App",
  // module federation var name
  varName: "myapp",
};
```

_see for injected tags documentation_
https://www.npmjs.com/package/html-webpack-tags-plugin
