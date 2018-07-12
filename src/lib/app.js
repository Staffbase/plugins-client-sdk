import cmd from './connection/commands';
import sendMessage from './connection/connection';

/**
 * Get the version of the Staffbase App
 *
 * @return {Promise<string>}
 */
export async function getVersion() {
  return sendMessage(cmd.version);
}

/**
 * Check if app is native
 *
 * @return {Promise<boolean>}
 */
export async function isNative() {
  return sendMessage(cmd.native);
}

/**
 * Check if app is mobile
 *
 * @return {Promise<boolean>}
 */
export async function isMobile() {
  return sendMessage(cmd.mobile);
}

/**
 * Open a link in a native Browser
 *
 * @param {string} url the url to open in the browsers
 *
 * @return {Promise<any>}
 */
export async function openLink(url) {
  return sendMessage(cmd.openLink, url);
}
