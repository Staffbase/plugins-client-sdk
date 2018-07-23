import { commands } from '../commands';

/**
 * Postmessage legacy protocol (3.5)
 */

export default {
  init: 'pluginLoaded', // send this if ready to communicate
  platformInfo: 'platformInfo', // receive this after pluginLoaded was sent
  startUpload: 'startImageUploadForPlugin', // start a file upload process
  finishUpload: 'finishedImageUploadForPlugin' // return the file data uploaded
};

export const invocationMapping = {
  [commands.nativeUpload]: 'nativeFileUpload'
};
