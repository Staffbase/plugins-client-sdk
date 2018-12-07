import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
import stripLogger from 'rollup-plugin-strip-logger';
import license from 'rollup-plugin-license';
import pkg from './package.json';

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
  stripLogger({
    variableNames: ['log'],
    propertyNames: ['debug', 'info', 'enableAll'],
    packageNames: ['log-level']
  }),
  resolve(),
  commonjs(),
  babel({
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: false,
          runtimeHelpers: true,
          regenerator: true
        }
      ]
    ],
    exclude: ['node_modules/**']
  })
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

  // minified UMD build
  {
    input: 'src/main.js',
    output: {
      name: 'plugins-client-sdk',
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'umd',
      sourcemap: true,
      minify: true
    },
    plugins: defaultBrowserPluginOptions.concat([
      uglify(),
      license({
        banner: bannerTemplate
      })
    ])
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/main.js',
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: true },
      { file: pkg.module, format: 'es', sourcemap: true }
    ],
    plugins: defaultBrowserPluginOptions.concat([
      stripLogger({
        variableNames: ['log'],
        propertyNames: ['debug', 'info', 'enableAll'],
        packageNames: ['log-level']
      })
    ])
  }
];
