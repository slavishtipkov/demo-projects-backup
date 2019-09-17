/* eslint-env node */
const webpackConfig = require("@dtn/webpack-config");
const merge = require("webpack-merge");

module.exports = (env, arg) => {
  return merge(webpackConfig.contentServices(env, arg), {
    output: {
      libraryTarget: "window",
    },

    externals: {
      "mapbox-gl": "mapboxgl",
    },
  });
};
