import postMessageLegacy from './connector/postmessage-legacy.js';
import fallback from './connector/fallback.js';
import postMessage from './connector/postmessage.js';
import putMessage from './connector/putMessage.js';

let connect = Promise.race([postMessage(), postMessageLegacy(), putMessage(), fallback()]);

/**
 * Send a message to the App
 *
 * Will reuse the determined connector
 * to send a message to the Staffbase App
 *
 * @param {any} msg message to send to Staffbase App
 * @param {any} payload that will be attached to the message
 * @return {Promis<any>} result of the request
 */
export default async function sendMessage(msg, ...payload) {
  return connect.then(sendFn => sendFn(msg, ...payload));
}
