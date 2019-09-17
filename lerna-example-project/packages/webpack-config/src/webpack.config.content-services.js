const path = require("path");
const process = require("process");

const packageJson = require(path.resolve(process.cwd(), "package.json"));
let { name } = packageJson;

// @dtn/the-name-of-the-widget -> the-name-of-the-widget.js
let filename = name.replace("@dtn/", "") + ".js";

module.exports = (env, arg) => ({
  mode: arg.production ? "production" : "development",
  devtool: arg.production ? "none" : "inline-source-maps",
  target: "web",
  context: path.resolve(process.cwd()),

  entry: path.resolve(process.cwd(), "./src/public/content-services.ts"),

  output: {
    path: arg["output-filename"],
    filename,
  },

  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: path.resolve(process.cwd(), "./src"),
        loader: "ts-loader",
      },
    ],
  },
});
