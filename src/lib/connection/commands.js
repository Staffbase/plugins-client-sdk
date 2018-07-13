import reverse from '../utils/reverseObject';

/**
 * @typedef {{ ios: string, android: string, version: string, mobile: string, native: string, openLink: string}} PlatformCommands
 * @typedef {{ 'dev-ios': string, 'dev-android': string, 'app-version': string, 'app-mobile': string, 'app-native': string, 'openExternalLink':string}} ReversedPlatformCommands
 */

/**
 * Platform independat definition
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
  nativeUpload: 'nativeFileUpload'
};

/**
 * All supported commands with reversed keys and properties
 *
 * @type {ReversedPlatformCommands>}
 */
export const reversedCommands = reverse(commands);

export default commands;
