![project logo](./project-logo.jpeg)

Batteries included [webpack](https://webpack.js.org/) + [module federation](https://webpack.js.org/concepts/module-federation/) build and linting scripts

# Quick Start

- create `./src/bootstrap.js` entry file
- add optional [configuration](#configuration)
- run directly
  ```shell
  npx @rubixibuc/build-scripts run
  ```
  or install globally
  ```shell
  npm i -g @rubixibuc/build-scripts
  build-scripts run
  ```

# Usage

- create `./src/bootstrap.js` entry file
- add optional [configuration](#configuration)
- add dependency to project
  ```shell
  npm i -D @rubixibuc/build-scripts
  ```
- add `start` and `build` scripts to package.json
  ```json
  {
    "scripts": {
      "start": "build-scripts run",
      "build": "build-scripts build"
    }
  }
  ```

# CLI

- `build`

  Outputs production build to `./dist` folder

  ```shell
  build-scripts build
  ```

- `eslint`

  Runs eslint against project files

  ```shell
  build-scripts eslint [-f, --fix] [-c, --cache] [-mw, --max-warnings <max-warnings>] <paths/globs>
  ```

- `prettier`

  Runs prettier against project files

  ```shell
  build-scripts prettier [-f, --fix] <paths/globs>
  ```

- `run`

  Runs dev server

  _if specified, command line port overrides setting from config_

  ```shell
  build-scripts run [-p, --port <port>]
  ```

- `stylelint`

  Runs stylelint against project files

  ```shell
  build-scripts stylelint [-f, --fix] [-cs, --custom-syntax <custom-syntax>] [-mw, --max-warnings <max-warnings>] <paths/globs>
  ```

# Configuration

- `build-scripts.config.js`

  [configuration formats](https://github.com/davidtheclark/cosmiconfig#explorersearch)

  example + defaults 👇

  ```javascript
  module.exports = {
    // app meta
    background: "#fff",
    // module federation exposed paths
    exposes: {},
    // link tags [1]
    links: [],
    // favicons (all sizes generated)
    // undefined = "<included image>"
    logo: void 0,
    // meta tags [1]
    metas: [],
    // obfuscator options [2]
    // false = disabled
    // {} = options
    obfuscator: false,
    // import web polyfills
    // {} = custom polyfill configuration
    // false = no polyfills
    // undefined = include all polyfills
    polyfill: {
      // imports both "core-js/stable" and "regenerator-runtime/runtime"
      // import "@rubixibuc/build-scripts/polyfill/browser" to add manually
      // true = browser polyfill
      // false = no browser polyfill
      browser: true,
      // imports both "@webcomponents/webcomponentsjs" and "construct-style-sheets-polyfil"
      // import "@rubixibuc/build-scripts/polyfill/component" to add manually
      // true = component polyfill
      // false = no component polyfill
      component: true,
    },
    // webpack dev server port
    port: 8080,
    // import src/preboot.(tsx|ts|jsx|js) before async bootstrap
    // undefined = auto detect
    // false = ignore
    // true = force
    preboot: void 0,
    // module federation remotes
    remotes: {},
    // script tags [1]
    scripts: [],
    // module federation shared modules
    shared: {},
    // tailwindcss configuration [3]
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

  - **[1]** [tags documentation](https://www.npmjs.com/package/html-webpack-tags-plugin)

  - **[2]** [obfuscator options](https://github.com/javascript-obfuscator/webpack-obfuscator#obfuscatoroptions)

  - **[3]** [tailwindcss configuration](https://tailwindcss.com)

- example [`.lintstagedrc.json`](https://github.com/okonet/lint-staged)

  ```json
  {
    "*.js": "build-scripts eslint --cache --fix",
    "*.css": "build-scripts stylelint --fix",
    "*.{json,md}": "build-scripts prettier --fix"
  }
  ```

# Javascript Variants

- `*.js`
- `*.jsx`
- `*.ts` (transpiles, but doesn't do build time typechecking)
- `*.tsx` (transpiles, but doesn't do build time typechecking)

# Importing Assets

- All asset types are supported according to the following rules

  ```javascript
  import exp from "./some-asset.png?data";
  // exp === "data:[...]"

  import exp from "./some-asset.png?file";
  // exp === "[...]/some-asset.1234.png?file"

  import exp from "./some-asset.txt?source";
  // exp === "contents of file"
  ```

- Specific rules for \*.css imports

  ```javascript
  import exp from "./some-style.css";
  // exp === new CSSStyleSheet()
  // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet

  import exp from "./some-style.css?string";
  // exp === "processed css as string"

  import "./some-style.css?style";
  // load style
  ```

- Additional rule for creating webp formatted images

  ```javascript
  import exp from "./some-image.png?file&as=webp";
  // exp === "[...]/some-image.1234.webp"
  ```
