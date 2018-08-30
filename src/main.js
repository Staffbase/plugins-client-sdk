/**
 * interface exports
 */

let log = require('loglevel');
log.enableAll(); /* experimental */

export { canDownload as deviceCanDownload } from './lib/device';
export { isIos as isIosDevice } from './lib/device';
export { isAndroid as isAndroidDevice } from './lib/device';

export { getVersion as getAppVersion } from './lib/app';
export { isNative as isNativeApp } from './lib/app';
export { isMobile as isMobileApp } from './lib/app';

export { openLink } from './lib/app';
export { openLinkExternal } from './lib/app';
export { openLinkInternal } from './lib/app';
export { getBranchLanguages } from './lib/app';
export { getBranchDefaultLanguage } from './lib/app';
export { getContentLanguages } from './lib/app';
export { getPreferredContentLocale } from './lib/app';

export { getLanguageInfos } from './lib/app'; /* experimental */
export { openNativeFileDialog } from './lib/app'; /* experimental */
