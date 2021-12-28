# 🔨 build-scripts 🧹

**Batteries included webpack with module federation build scripts**

## Usage

```shell
> npx @rubixibuc/build-scripts [command] ↩
```

**or**

```shell
> npm i -D @rubixibuc/build-scripts ↩
```

and add to package.json:

```json
{
  "scripts": {
    "start": "build-scripts run",
    "build": "build-scripts build"
  }
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
> build-scripts build ↩
```

### \[eslint\]

**Runs eslint against project files**

```shell
> build-scripts eslint [-f, --fix] [-c, --cache] [-mw, --max-warnings <max-warnings>] <paths/globs> ↩
```

### \[prettier\]

**Runs prettier against project files**

```shell
> build-scripts prettier [-f, --fix] <paths/globs> ↩
```

### \[run\]

**Runs dev server**

_if specified, command line port overrides setting from config_

```shell
> build-scripts run [-p, --port <port>] ↩
```

### \[stylelint\]

**Runs stylelint against project files**

```shell
> build-scripts stylelint [-f, --fix] [-cs, --custom-syntax <custom-syntax] [-mw, --max-warnings <max-warnings>] <paths/globs> ↩
```

## Configuration:

**build-scripts.config.js**

_multiple config file formats are [supported](https://github.com/davidtheclark/cosmiconfig#explorersearch)_

#### example + defaults 👇

```javascript
module.exports = {
  // webpack aliases
  alias: {},
  // app meta
  background: "#000",
  // webpack entry
  entry: "./src/index",
  // module-federation exposed paths
  exposes: {},
  // injected link tags
  links: [],
  // favicons (all sizes generated)
  logo: "<included image>",
  // injected meta tags
  metas: [],
  // webpack modules
  modules: ["node_modules"],
  // module-federation var name
  name: "myapp",
  // webpack dev server port
  port: 3000,
  // injected script tags
  scripts: [],
  // module-federation shared modues
  shared: {},
  // app meta
  theme_color: "#fff",
  // site title
  title: "My App",
};
```

_see for injected tag documentation_
https://www.npmjs.com/package/html-webpack-tags-plugin
