import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sucrase from '@rollup/plugin-sucrase';
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

const stripLog = stripLogger({
  variableNames: ['log'],
  propertyNames: ['debug', 'info', 'enableAll'],
  packageNames: ['loglevel']
});

const defaultPlugins = [
  stripLog,
  nodeResolve(),
  commonjs(),
  sucrase({
    exclude: ['node_modules/**'],
    transforms: []
  }),
  license({
    banner: bannerTemplate
  })
];

export default {
  input: 'src/main.js',
  plugins: defaultPlugins,
  output: [
    // minified UMD build
    {
      name: 'plugins-client-sdk',
      file: pkg.browser,
      format: 'umd',
      sourcemap: true,
      plugins: [terser()]
    },

    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    },

    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()]
    }
  ]
};
