const { composePlugins, withNx } = require('@nx/webpack');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  config.devServer = {
    hot: false,
    hotOnly: false
  }
  // e.g. `config.plugins.push(new MyPlugin())`
  return config;
});
