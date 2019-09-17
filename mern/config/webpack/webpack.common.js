const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src", "app"),
  output: {
    filename: "js/bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: [/node_modules/],
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  node: "current"
                }
              }
            ],
            "@babel/preset-react"
          ]
        }
      }
    ]
  }
};
