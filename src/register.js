// @ts-check

// node_modules/@playwright/test/lib/transform.js
require("@babel/register")({
    cwd: process.cwd(),
    exclude: [/[\\/]node_modules[\\/]/],
    babelrc: false,
    configFile: false,
    presets: [
        [
            require.resolve("@babel/preset-typescript"),
            {
                onlyRemoveTypeImports: true,
            },
        ],
    ],
    plugins: [
        [require.resolve("@babel/plugin-proposal-class-properties")],
        [require.resolve("@babel/plugin-proposal-numeric-separator")],
        [
            require.resolve(
                "@babel/plugin-proposal-logical-assignment-operators"
            ),
        ],
        [require.resolve("@babel/plugin-proposal-nullish-coalescing-operator")],
        [require.resolve("@babel/plugin-proposal-optional-chaining")],
        [require.resolve("@babel/plugin-syntax-json-strings")],
        [require.resolve("@babel/plugin-syntax-optional-catch-binding")],
        [require.resolve("@babel/plugin-syntax-async-generators")],
        [require.resolve("@babel/plugin-syntax-object-rest-spread")],
        [require.resolve("@babel/plugin-proposal-export-namespace-from")],
        [require.resolve("@babel/plugin-transform-modules-commonjs")],
        [require.resolve("@babel/plugin-proposal-dynamic-import")],
    ],
    sourceMaps: "inline",
    extensions: [".ts"],
    // @ts-ignore
    assumptions: {
        // Without this, babel defines a top level function that
        // breaks playwright evaluates.
        setPublicClassFields: true,
    },
});
