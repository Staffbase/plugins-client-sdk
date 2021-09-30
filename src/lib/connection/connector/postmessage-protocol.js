import { commands } from '../commands';

/**
 * Postmessage protocol (3.6)
 */

export default {
  HELLO: 'HELLO', // send this if ready to communicate
  SUCCESS: 'SUCCESS', // receive this after pluginLoaded was sent
  INVOCATION: 'INVOCATION', // send this to call a function in the frontend
  ERROR: 'ERROR' // receive this when something goes wrong
};

export const invocationMapping = {
  [commands.openLink]: 'openLink',
  [commands.scrollInput]: 'scrollInputIntoView',
  [commands.nativeUpload]: 'nativeFileUpload',
  [commands.nativeShare]: 'nativeShareDialog',
  [commands.langInfos]: 'getPluginLanguageInfo',
  [commands.prefContentLang]: 'getPreferredContentLocale'
};
