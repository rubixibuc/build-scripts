module.exports = () => {
  const { cosmiconfig } = require("cosmiconfig");
  const explorer = cosmiconfig(require("../package.json").name);

  explorer
    .search()
    .then(({ config, isEmpty }) => {})
    .catch((error) => {});
};
