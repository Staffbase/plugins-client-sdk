import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import html from 'rollup-plugin-template-html';
import pkg from './package.json';

const defaultBrowserPluginOptions = [
    resolve(),
    commonjs(),
    babel({
        plugins: ["module:fast-async"],
        exclude: ['node_modules/**']
    }),
    html({
        template: 'resources/index.html',
        fileName: 'index.html'
    }),
    serve('dist')
];

export default [
    // browser-friendly UMD build
    {
        input: 'src/main.js',
        output: {
            name: 'plugins-client-sdk',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true
        },
        plugins: defaultBrowserPluginOptions
    },

];
