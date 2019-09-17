module.exports = {
  extends: ["@commitlint/config-conventional", "@commitlint/config-lerna-scopes"],

  rules: {
    "header-max-length": [2, "always", 120],
    "type-enum": [
      2,
      "always",
      ["build", "ci", "chore", "docs", "deps", "enhance", "feat", "fix", "perf", "refactor", "revert", "style", "test"],
    ],
    "type-empty": [0],
  },
};
