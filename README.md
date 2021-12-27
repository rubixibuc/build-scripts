# Scripts

## usage

`npx @rubixibuc/build-scripts [command]`

commands:

- build
- eslint
- prettier
- run
- stylelint

## configuration

build-scripts.config.js

defaults:

```javascript
module.exports = {
  alias: {}, // webpack aliases
  background: "#000", // app meta
  entry: "./src/index", // webpack entry
  exposes: {}, // module-federation exposed paths
  links: [], // injected link tags
  logo: "provided image", // favicons (all sizes generated)
  metas: [], // injected meta tags
  name: "myapp", // module-federation var name
  scripts: [], // injected script tags
  shared: {}, // module-federation shared modues
  theme_color: "#fff", // app meta
  title: "My App", // site title
};
```

see for injected tag documentation:
https://www.npmjs.com/package/html-webpack-tags-plugin
