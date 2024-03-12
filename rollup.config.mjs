import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import stripLogger from 'rollup-plugin-strip-logger';
import license from 'rollup-plugin-license';
import pkg from './package.json' assert { type: 'json' };

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

const defaultPlugins = [
  stripLogger({
    variableNames: ['log'],
    propertyNames: ['debug']
  }),
  nodeResolve(),
  commonjs(),
  babel({ babelHelpers: 'bundled' }),
  license({
    banner: bannerTemplate
  })
];

export default {
  input: 'src/main.js',
  plugins: defaultPlugins,
  output: [
    // browser-friendly UMD build
    {
      name: 'plugins-client-sdk',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true
    },

    // minified UMD build
    {
      name: 'plugins-client-sdk',
      file: pkg.browser.replace('.js', '.min.js'),
      format: 'umd',
      sourcemap: true,
      plugins: [terser()]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    { file: pkg.main, format: 'cjs', sourcemap: true },
    { file: pkg.module, format: 'esm', sourcemap: true }
  ]
};
