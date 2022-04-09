module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "es6": true,
    "jquery": true,
    "jest": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    'airbnb-base',
    'plugin:fsd/all',
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "fsd",
  ],
  "rules": {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
  "settings": {
    "import/resolver": {
      "node": {
        "extensions": ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
