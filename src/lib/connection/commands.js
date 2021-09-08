import reverse from '../utils/reverseObject';

/**
 * @typedef { Object.<string, string> } PlatformCommands
 * @typedef { Object.<string, string> } ReversedPlatformCommands
 */

/**
 * Platform independent definition
 * of supported commands
 *
 * @type {PlatformCommands}
 */
export const commands = {
  ios: 'dev-ios',
  android: 'dev-android',
  version: 'app-version',
  mobile: 'app-mobile',
  native: 'app-native',
  openLink: 'openExternalLink',
  nativeUpload: 'nativeFileUpload',
  keyboardHandling: 'applyKeyboardHandling',
  nativeShare: 'nativeShareDialog',
  langInfos: 'getLanguageInfos',
  branchDefaultLang: 'getBranchDefaultLanguage',
  prefContentLang: 'getPreferredContentLocale'
};

/**
 * All supported commands with reversed keys and properties
 *
 * @type {ReversedPlatformCommands>}
 */
export const reversedCommands = reverse(commands);

export default commands;
