import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import stripLogger from 'rollup-plugin-strip-logger';
import license from 'rollup-plugin-license';
import pkg from './package.json';
import serve from 'rollup-plugin-serve';
import html from 'rollup-plugin-template-html';


const bannerTemplate = `
Bundle of <%= pkg.name %>
@file <%= pkg.description %>
@see <%= pkg.homepage %>
@version <%= pkg.version %>

<% _.forEach(pkg.contributors, function (contributor) { %>@author <%= contributor %>
<% }) %>
@copyright <%= pkg.author.name %> <%= moment().format('YYYY') %>
@license <%= pkg.license %>
`;

const defaultBrowserPluginOptions = [
    // stripLogger({
    //   variableNames: ['log'],
    //   propertyNames: ['debug', 'enableAll'],
    //   packageNames: ['log-level']
    // }),
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
