import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json' assert { type: 'json' };
import html from 'rollup-plugin-template-html';
import serve from 'rollup-plugin-serve';

const defaultBrowserPluginOptions = [
  nodeResolve(),
  commonjs(),
  babel({ babelHelpers: 'bundled' }),
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
  }
];
