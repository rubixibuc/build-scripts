# 🔨 build-scripts 🧹

**Batteries included [webpack](https://webpack.js.org/) + [module federation](https://webpack.js.org/concepts/module-federation/) build and linting scripts**

## Quick Start

- create **./src/bootstrap.js** entry file
- optionally create [configuration file](#configuration)
- run directly:
  ```shell
  npx @rubixibuc/build-scripts run
  ```
  or install globally:
  ```shell
  npm i -g @rubixibuc/build-scripts
  build-scripts run
  ```

## Usage

- create **./src/bootstrap.js** entry file
- optionally create [configuration file](#configuration)
- add dependency to project:
  ```shell
  npm i -D @rubixibuc/build-scripts
  ```
- add `start` and `build` scripts to package.json:
  ```json
  {
    "scripts": {
      "start": "build-scripts run",
      "build": "build-scripts build"
    }
  }
  ```

## Commands

```shell
build-scripts [command]
```

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

### build-scripts.config.js

_multiple config file formats are [supported](https://github.com/davidtheclark/cosmiconfig#explorersearch)_

example + defaults 👇

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
  // false = disabled
  // {} = options
  obfuscator: false,
  // includes both "core-js/stable" and "regenerator-runtime/runtime"
  // import "@rubixibuc/build-scripts/polyfill" to include manually
  // choices: ["entry", false]
  // "entry" = include entry web polyfill
  // false = no web polyfill
  polyfill: "entry",
  // webpack dev server port
  port: 8080,
  // require file before async bootstrap
  // false = no preboot
  // true = src/preboot.(js|jsx|ts|tsx)
  // "{pathToFile}" = src/{pathToFile}
  preboot: false,
  // module federation remotes
  remotes: {},
  // injected script tags
  scripts: [],
  // module federation shared modules
  shared: {},
  // tailwindcss configuration see: https://tailwindcss.com/
  // tailwindcss utility classes are automatically prefixed with varName found below
  // false = no tailwindcss
  // {} = tailwindcss configuration
  tailwindcss: false,
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

### Example [lint-staged](https://github.com/okonet/lint-staged) Config

```json
{
  "*.js": "build-scripts eslint --cache --fix",
  "*.css": "build-scripts stylelint --fix",
  "*.{json,md}": "build-scripts prettier --fix"
}
```

## Javascript variants

- \*.js
- \*.jsx
- \*.ts (transpiles, but doesn't do build time typechecking)
- \*.tsx (transpiles, but doesn't do build time typechecking)

## Importing Assets

**All asset types are supported according to the following rules**

```javascript
import exp from "./some-asset.png?data";
// exp === "data:[...]"

import exp from "./some-asset.png?file";
// exp === "[...]/some-asset.1234.png?file"

import exp from "./some-asset.txt?source";
// exp === "contents of file"
```

**Specific rules for \*.css imports**

```javascript
import exp from "./some-style.css";
// exp === new CSSStyleSheet()
// https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet

import exp from "./some-style.css?string";
// exp === "processed css as string"

import "./some-style.css?style";
// load style
```

**Additional rule for creating webp format images**

```javascript
import exp from "./some-image.png?file&as=webp";
// exp === "[...]/some-image.1234.webp"
```
