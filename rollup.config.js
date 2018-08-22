import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
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
  resolve(),
  commonjs(),
  babel({
    babelrc: false, // stops babel from using .babelrc files
    plugins: [
      [
        'transform-runtime',
        {
          helpers: false,
          polyfill: false,
          runtimeHelpers: true,
          regenerator: true,
          moduleName: 'babel-runtime'
        }
      ],
      'external-helpers'
    ], // [1]
    presets: [
      [
        'env',
        {
          modules: false, // stop module conversion
          targets: {
            browsers: ['last 2 versions', 'IE >= 10'] // whatever you want here
          }
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
    plugins: [resolve(), commonjs()]
  }
];
