import { copyFile, constants } from 'node:fs/promises';
import sucrase from '@rollup/plugin-sucrase';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json' assert { type: 'json' };
import serve from 'rollup-plugin-serve';

const html = (options) => {
  return {
    name: 'html',

    async generateBundle() {
      try {
        await copyFile(options.template, options.destFile);
        console.log(`${options.template} copied to ${options.destFile}`);
      } catch {
        console.error('The file could not be copied');
      }
    }
  };
};

const defaultBrowserPluginOptions = [
  nodeResolve(),
  commonjs(),
  sucrase({
    exclude: ['node_modules/**'],
    transforms: []
  }),
  html({
    template: 'resources/index.html',
    destFile: 'dist/index.html'
  }),
  serve('dist')
];

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.js',
    output: {
      name: 'plugins-client-sdk',
      file: pkg.browser.replace('.min.js', '.js'),
      format: 'umd',
      sourcemap: true
    },
    plugins: defaultBrowserPluginOptions
  }
];
