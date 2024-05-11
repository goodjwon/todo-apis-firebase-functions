module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "google",
        "plugin:@typescript-eslint/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: ["tsconfig.json", "tsconfig.dev.json"],
        sourceType: "module",
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: [
        "/lib/**/*", // Ignore built files.
        "*.js", // .js 파일 무시
    ],
    plugins: [
        "@typescript-eslint",
        "import",
    ],
    rules: {
        "quotes": ["error", "double"],
        "import/no-unresolved": 1,
        "indent": ["error", 4],
        "max-len": ["error", { "code": 140 }],
        "require-jsdoc": "off",
    },
    settings: {
        "import/resolver": {
            node: {
                extensions: [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    },    
};
