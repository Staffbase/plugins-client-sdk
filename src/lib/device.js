/* eslint-disable no-unused-vars */
import cmd from './connection/commands';
import sendMessage from './connection/connection';
import { isNative, getVersion } from './app';
import compareVersions from 'compare-versions';
const log = require('loglevel');
/**
 * Check if device is using ios.
 *
 * @return {Promise<boolean>}
 */
export const isIos = async () => {
  log.debug('device/isIos');
  return sendMessage(cmd.ios);
};

/**
 * Check if device is using android.
 *
 * @return {Promise<boolean>}
 */
export const isAndroid = async () => {
  log.debug('device/isAndroid');
  return sendMessage(cmd.android);
};

/**
 * Check if device is able to perform a download.
 *
 * @return {Promise<boolean>}
 */
export const canDownload = async () => {
  log.debug('device/canDownload');
  let [native, version, ios] = await Promise.all([isNative(), getVersion(), isIos()]);

  // support any development versions like X.Y-dev for compare versions
  const dashIndex = version.indexOf('-');
  version = version.substring(0, dashIndex != -1 ? dashIndex : version.length);

  // mobile ios devices can not download with an app version less than 3.5
  // but apps below 3.5 don't have the platform information from the frontend available
  // so we disable download for all native ios devices under these conditions
  return !(compareVersions(version, '3.5') < 0 && native && ios);
};
