module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      sourceType: 'module',
    },
    plugins: [
      '@typescript-eslint/eslint-plugin',
    ],
    extends: [
      "prettier",
    ],
    root: true,
    env: {
      node: true,
      jest: true,
    },
    ignorePatterns: [
      '.eslintrc.js', 
      'index.js'
    ],
    rules: {
      "@typescript-eslint/member-delimiter-style": [
        "error",
        {
          "multiline": {
            "delimiter": "none",
            "requireLast": true
          },
          "singleline": {
            "delimiter": "semi",
            "requireLast": false
          }
        }
      ],
      "@typescript-eslint/naming-convention": "error",
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
      "@typescript-eslint/quotes": [
        "error",
        "single"
      ],
      "@typescript-eslint/semi": [
        "error",
        "never"
      ],
      "@typescript-eslint/naming-convention": [0],
      "comma-dangle": [
        "error",
        "always-multiline"
      ],
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
      "eol-last": "error",
      "new-parens": "error",
      "no-return-await": "error",
      "no-trailing-spaces": "error",
      "prefer-template": "error",
    },
  };
  