import fallback, { disconnect as fallbackDisconnect } from './connector/fallback.js';
import postMessage, { disconnect as postMessageDisconnect } from './connector/postmessage.js';
import { unload as unloadManager } from './manager';
import log from 'loglevel';

let connector;

const connect = async () => {
  const postMessageConnection = postMessage();
  const fallbackConnection = fallback();

  const realConnectionBucket = [postMessageConnection];
  const fallbackConnectionBucket = realConnectionBucket.concat(fallbackConnection);

  // Wait on the real communication and replace the connector with
  Promise.race(realConnectionBucket).then((newConnector) => {
    log.debug('connection/replace connector ' + newConnector.toString());
    connector = newConnector;
  });

  return await Promise.race(fallbackConnectionBucket);
};

export const disconnect = () => {
  postMessageDisconnect();
  fallbackDisconnect();
  unloadManager();
  connector = null;
};

/**
 * Send a message to the App
 *
 * Will reuse the determined connector
 * to send a message to the Staffbase App
 *
 * @param {any} msg message to send to Staffbase App
 * @param {any} payload that will be attached to the message
 * @return {Promise<any>} result of the request
 */
const sendMessage = async (msg, ...payload) => {
  log.info('connection/sendMessage ' + msg);
  log.debug('connection/sendMessage/payload ' + JSON.stringify(payload));

  if (!connector) {
    connector = connect();
  }

  const sendFn = await connector;
  return sendFn(msg, ...payload);
};

export default sendMessage;
