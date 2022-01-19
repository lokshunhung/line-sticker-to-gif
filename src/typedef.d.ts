declare module "@babel/register" {
    import { TransformOptions } from "@babel/core";

    namespace Register {
        interface Options extends Omit<TransformOptions, "ignore" | "only"> {
            /**
             * The current working directory. It is advised to set this to `__dirname`,
             * or `require("path").join(__dirname, "..")` if the caller script is not in the workspace root.
             *
             * Not documented in official api.
             * If not provided, defaults to `"."`, which may be problematic.
             *
             * Source: https://github.com/babel/babel/blob/6892d51472fd9f5e8d4b76c3776273de15585ccf/packages/babel-register/src/node.js#L140
             *
             * Explanation from Kent C. Dodds: https://youtu.be/w41L_ajkcbo?t=1117
             *
             * Default value: `"."`
             */
            cwd: string;

            /**
             * Array of ignore conditions, either a regex or a function. (Optional)
             * File paths that match any condition are not compiled.
             *
             * If both `options.only` and `options.ignore` are not specified, babel will only
             * ignore any node_modules inside the current working directory specified by `options.cwd`.
             *
             * Source: https://github.com/babel/babel/blob/6892d51472fd9f5e8d4b76c3776273de15585ccf/packages/babel-register/src/node.js#L147-L155
             *
             * Default value: `[ new RegExp("^" + escapeRegExp(cwd) + "(?:" + path.sep + ".*)?" + escapeRegExp(path.sep + "node_modules" + path.sep), "i") ]`
             */
            ignore?: Array<RegExp | ((filepath: string) => boolean)>;

            /**
             * Array of accept conditions, either a regex or a function. (Optional)
             * File paths that match all conditions are compiled.
             *
             * If both `options.only` and `options.ignore` are not specified, babel will only
             * compile things inside the current working directory specified by `options.cwd`.
             *
             * Source: https://github.com/babel/babel/blob/6892d51472fd9f5e8d4b76c3776273de15585ccf/packages/babel-register/src/node.js#L143
             *
             * Default value: `[ new RegExp("^" + escapeRegExp(cwd), "i") ]`
             */
            only?: Array<RegExp | ((filepath: string) => boolean)>;

            /**
             * Setting this will remove the currently hooked extensions of `.es6`, `.es`, `.jsx`, `.mjs`
             * and `.js` so you'll have to add them back if you want them to be used again.
             *
             * Default value: `[ ".es6", ".es", ".jsx", ".js", ".mjs" ]`
             */
            extensions?: Array<string>;

            /**
             * Setting this to false will disable the cache.
             *
             * Default value: `true`
             */
            cache?: boolean;
        }
    }

    const Register: {
        (options?: Register.Options): void;

        default(options?: Register.Options): void;

        revert(): void;
    };

    export = Register;
}
