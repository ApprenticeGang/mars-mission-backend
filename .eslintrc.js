module.exports = {
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "parserOptions": {
        "project": "./tsconfig-linter.json"
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "rules": {
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/member-delimiter-style": "error",
        "@typescript-eslint/method-signature-style": "error",
        "@typescript-eslint/naming-convention": ["error",
            { selector: "default", format: ["strictCamelCase"] },
            { selector: "property", format: ["strictCamelCase", "snake_case"] },
            { selector: "variable", types: ["function"], format: [ "strictCamelCase", "StrictPascalCase" ] },
            { selector: "function", format: [ "strictCamelCase", "StrictPascalCase"] },
            { selector: "typeLike", format: [ "StrictPascalCase"] },
        ],
        "@typescript-eslint/no-require-imports": "error",
        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
        "@typescript-eslint/type-annotation-spacing": "error",
        "brace-style": "off",
        "@typescript-eslint/brace-style": "error",
        "comma-spacing": "off",
        "@typescript-eslint/comma-spacing": "error",
        "func-call-spacing": "off",
        "@typescript-eslint/func-call-spacing": "error",
        "indent": "off",
        "@typescript-eslint/indent": ["error", 4],
        "keyword-spacing": "off",
        "@typescript-eslint/keyword-spacing": "error",
        "no-multiple-empty-lines": ["error", { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
        "semi": "off",
        "@typescript-eslint/semi": ["error"],
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": ["error"],
        "@typescript-eslint/no-unsafe-member-access": "off",
    }
};
