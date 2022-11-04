const Dotenv = require('dotenv-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const path = require('path');

module.exports = function(config) {
  // Add monorepo node_modules to the exclusion paths of Piral's default loaders.
  const rootNodeModules = path.resolve(__dirname, '../../../node_modules');

  config.module.rules = config.module.rules.map((rule) => {
    const newRule = { ...rule };
    if (rule.exclude) {
      newRule.exclude = [rule.exclude, rootNodeModules];
    }
    if (
      config.mode === 'production' &&
      rule.use[0].loader &&
      rule.use[0].loader.includes &&
      rule.use[0].loader.includes('file-loader')
    ) {
      rule.use[0].options.publicPath = '.';
    }
    return newRule;
  });

  config.resolve.symlinks = false;

  // Make sure that loaders are used from piral-cli-webpack5 instead of some
  // random versions that might exist on the root node_modules folder on the mono repo.
  config.resolveLoader = {
    modules: [
      './node_modules/piral-cli-webpack5/node_modules',
      './node_modules',
      path.resolve(rootNodeModules, './piral-cli-webpack5/node_modules'),
      rootNodeModules,
    ],
  };

  // Add new plugins, loaders, etc. below this point

  config.plugins.push(new Dotenv());
  config.plugins.push(new ForkTsCheckerWebpackPlugin());

  return config;
};
