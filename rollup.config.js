import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
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

const stripLog = stripLogger({
  variableNames: ['log'],
  propertyNames: ['debug', 'info', 'enableAll'],
  packageNames: ['log-level']
});


const defaultPlugins = [
  stripLog,
  resolve(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    include: ['src/**/*.js'],
    exclude: './node_modules/**'
  }),
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

    { file: pkg.module, format: 'esm', sourcemap: true },
    {
      file: pkg.module.replace('.js', '.min.js'),
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    }
  ]
};
