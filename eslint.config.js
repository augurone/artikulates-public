import babelParser from '@babel/eslint-parser';
// eslint-disable-next-line import/no-extraneous-dependencies
import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import * as importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import globals from 'globals';


export default [
    js.configs.recommended,
    react.configs.flat.recommended,
    {
        files: ["src/**/*.{js,mjs,cjs,jsx}"],
        ignores: [".next/**", "**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: babelParser,
            parserOptions: {
                requireConfigFile: false,
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true
                },
                babelOptions: {
                    presets: ["@babel/preset-env", "@babel/preset-react"],
                    plugins: ["@babel/plugin-syntax-jsx"]
                }
            },
            globals: { ...globals.browser, ...globals.node }
        },
        plugins: {
            "jsx-a11y": jsxA11y,
            react: react,
            "@next/next": next,
            import: importPlugin
        },
        settings: {
            react: {
                version: "detect"
            },
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".mjs", ".cjs"],
                    path: ["node_modules"]
                }
            }
        },
        rules: {
            // Add these React-specific rules
            "react/jsx-uses-vars": "error",
            "react/jsx-uses-react": "error",
            "no-unused-vars": [
                "error",
                 {
                    "ignoreRestSiblings": true
                }
            ],
            
            "semi": ["error", "always"],
            "import/order": [
                "error",
                {
                    alphabetize: { order: "asc", caseInsensitive: true },
                    groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
                    "newlines-between": "always"
                }
            ],
            "import/no-useless-path-segments": [
                "error",
                {
                    noUselessIndex: true
                }
            ],
            "import/no-extraneous-dependencies": [
                "error",
                {
                    devDependencies: ["eslint.config.js", "webpack.config.js", "**/test/**"],
                    optionalDependencies: false,
                    peerDependencies: false
                }
            ],
            "arrow-parens": ["error", "as-needed", { requireForBlockBody: true }],
            "comma-dangle": ["error", "never"],
            "comma-style": "error",
            "constructor-super": "off",
            "class-methods-use-this": "off",
            "implicit-arrow-linebreak": "error",
            "import/no-cycle": "off",
            "indent": ["error", 4, { SwitchCase: 1 }],
            "lines-between-class-members": ["error"],
            "max-classes-per-file": "off",
            "max-len": ["error", { code: 200, tabWidth: 4 }],
            "no-console": "error",
            "no-multiple-empty-lines": "error",
            "no-param-reassign": ["off"],
            "no-plusplus": ["error", { allowForLoopAfterthoughts: true }],
            "no-restricted-globals": "off",
            "no-undef": "off",
            "object-curly-newline": ["error", { consistent: true }],
            'object-curly-spacing': ['error', 'always'],
            "operator-linebreak": ["error", "before", { overrides: { "&&": "after", "||": "after" } }],
            "prefer-destructuring": [
                "error",
                {
                    VariableDeclarator: { array: true, object: true },
                    AssignmentExpression: { array: true, object: true }
                },
                { enforceForRenamedProperties: true }
            ],
            "react/jsx-closing-bracket-location": [
                "error",
                { selfClosing: "after-props", nonEmpty: "after-props" }
            ],
            "react/jsx-max-props-per-line": ["error", { maximum: 1, when: "multiline" }],
            "react/jsx-tag-spacing": ["error", { beforeSelfClosing: "always" }],
            "no-lonely-if": "error",
            "consistent-return": "error",
            "no-undefined": "error",
            "no-nested-ternary": "error",
            "no-unneeded-ternary": "error",
            eqeqeq: ["error", "always"],
            "react/prop-types": "off",
            "func-style": ["error", "expression"],
            "no-use-before-define": ["error", { functions: true }],
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
];
