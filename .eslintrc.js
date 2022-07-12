module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    settings: {
        react: {
            version: "detect"
        },
        "import/resolver" : {
            typescript: {}
        }
    },
    parser: "@babel/eslint-parser",
    parserOptions: {
        requireConfigFile: false,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        "react",
        "react-hooks",
        "prettier",
        "simple-import-sort",
    ],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "react-app",
        "react-app/jest",
        "prettier",
    ],
    rules: {
        "react/function-component-definition": 0,
        "react/boolean-prop-naming": 0,
        "react/prop-types": 0,
        "react-hooks/exhaustive-deps": 1,
        "react/react-in-jsx-scope": 0,
        "no-multi-spaces": 1,
        "no-unused-vars": 1,
        "react/display-name": [0],
        "react-hooks/rules-of-hooks": "error",
        "no-restricted-imports": [
            "error",
            {
                "patterns": ["@mui/*/*/*", "!@mui/material/test-utils/*"]
            }
        ],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error"
        
  },
  overrides: [
    {
        files: ["**/*.{js}"],
        rules: {
            "quotes": ["warn", "single"],
        }},
    {
    files: ["**/*.{ts,tsx}"],
    globals: {
        React: "writable"
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        "import/resolver": {
            typescript: {
                project: "./tsconfig.json"
            }
        }
        },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: "./tsconfig.json"
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "react-app",
        "react-app/jest",
    ],
    rules: {
        "jsx-quotes": ["warn", "prefer-double"],
        "quotes": ["warn", "single"],
        "react/react-in-jsx-scope": "off",
        "react/jsx-filename-extension": [0],
        "react/jsx-closing-tag-location": [1],
        "react/jsx-pascal-case": [1],
        "react/self-closing-comp": [1],
        "react/jsx-wrap-multilines": [1],
        "react/prop-types": [0],
    }

    }
  ]
}
