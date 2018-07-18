import 'babel-polyfill';
/**
 * interface exports
 */

let log = require('loglevel');
log.enableAll();

export { canDownload as deviceCanDownload } from './lib/device';
export { openLink } from './lib/app';
export { openLinkExternal } from './lib/app';
export { openLinkInternal } from './lib/app';
export { openNativeFileDialog } from './lib/app';
