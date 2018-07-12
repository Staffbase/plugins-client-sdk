/* eslint-disable no-unused-vars */
import cmd from './connection/commands';
import sendMessage from './connection/connection';
import { isNative, getVersion } from './app';
import compareVersions from 'compare-versions';
import catchLinks from './polyfills/catch-links';

/**
 * Check if device is using ios
 *
 * @return {Promise<boolean>}
 */
async function isIos() {
  return sendMessage(cmd.ios);
}

/**
 * Check if device is using android
 *
 * @return {Promise<boolean>}
 */
async function isAndroid() {
  return sendMessage(cmd.android);
}

/**
 * Check if device is able to perform a download.
 *
 * @return {Promise<boolean>}
 */
export async function canDownload() {
  let [native, version, ios] = await Promise.all([isNative(), getVersion(), isIos()]);

  // mobile ios devices can not download with an app version less than 3.5
  // but apps below 3.5 don't have the platform information from the frontend available
  // so we disable download for all native ios devices under these conditions

  return !(compareVersions(version, '3.5') < 0 && native && ios);
}

/**
 * Initialize the connection and add the link handling on ios
 */
Promise.all([isIos(), isNative()]).then(([isIOS, isNative]) => {
  if (isIOS && isNative) {
    console.log('Activating external link handler.'); // eslint-disable-line no-console
    catchLinks(window, url => console.log('external link ', url)); // eslint-disable-line no-console
  }
});