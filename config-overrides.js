/* eslint-disable react-hooks/rules-of-hooks */
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { useBabelRc, override } = require('customize-cra');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const polyFillOverride = function(config) {
  config.plugins.push(
    new NodePolyfillPlugin({
      excludeAliases: [
        "assert",
        "buffer",
        "console",
        "constants",
        "crypto",
        "domain",
        "events",
        "os",
        "path",
        "punycode",
        "querystring",
        "stream",
        "_stream_duplex",
        "_stream_passthrough",
        "_stream_transform",
        "_stream_writable",
        "string_decoder",
        "sys",
        "timers",
        "tty",
        "url",
        "util",
        "vm",
        "zlib",
      ],
    })
  );
  return config;
};

const ignoreWarnings = value => config => {
  config.ignoreWarnings = value;
  return config;
};

const copyWebpackOverride = function(config) {
  config.plugins.push(
    new CopyWebpackPlugin({ patterns: [
      {from: 'node_modules/swagger-ui-dist', to: 'swagger'}
    ]})
  );
  return config;
};

module.exports = override(
  polyFillOverride,
  copyWebpackOverride,
  useBabelRc(),
  ignoreWarnings([/Failed to parse source map/])
)
