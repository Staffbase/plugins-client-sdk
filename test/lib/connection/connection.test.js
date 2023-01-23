/* eslint-env jest, es6 */

import stubPostMessage from './../mocks';
import sendMessage, { disconnect } from '../../../src/lib/connection/connection.js';
import command from '../../../src/lib/connection/commands.js';

const mockVersion36 = '3.6';
const standardMsg36 = [
  'SUCCESS',
  0,
  {
    platform: { native: 'ios', mobile: true, version: mockVersion36 },
    language: {
      branchLanguages: {
        de: {
          key: 'de',
          locale: 'de_DE',
          name: 'Deutsch',
          localizedName: 'Deutsch'
        },
        en: {
          key: 'en',
          locale: 'en_US',
          name: 'English',
          localizedName: 'Englisch'
        }
      }
    }
  }
];

describe('connection', () => {
  describe('sendMessage', () => {
    let messageStup;

    afterEach(() => {
      disconnect();
    });

    test('should provide a working sendmessage without a connection', async () => {
      const result = await sendMessage(command.version);

      expect(result).toBe('3.4');
    });

    test('should receive a message from postmessage connector if available', async () => {
      messageStup = stubPostMessage(standardMsg36);
      const result = await sendMessage(command.version);
      messageStup.stopMessaging();

      expect(result).toBe(mockVersion36);
    });

    test('should upgrade a connection if the postmessage takes longer than the fallback timeout', async () => {
      messageStup = stubPostMessage(standardMsg36, 600);

      window.setTimeout(() => {});
      let result = await sendMessage(command.version);
      expect(result).toBe('3.4');
      await delay(100);

      result = await sendMessage(command.version);
      messageStup.stopMessaging();

      expect(result).toBe(mockVersion36);
    });
  });
});

const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

/*
 * Mock the post message interface
 *
 * so acting on post message will yield no results by default
 * or provide custom implementations
 *
 * @param {function} cbAEL window.addEventListener implementation
 * @param {function} cbPM window.postMessage implementation
 * /
function mockPostMessage(cbAEL, cbPM) {
  window = {};
  window.parent = {};
  window.addEventListener = cbAEL || function(message, receiveMessage) {};
  window.parent.postMessage = cbPM || function(message, origin) {};
}

/**
 * Stub the post message interface
 *
 * postMessage will triger the registered message handler directly
 * either with default event mock or the provided msg
 *
 * @param {any} msg to send to the eventListener
 * /
function stubPostMessage(msg) {
  let callback = null;
  let fakeEvent = { data: msg || { state: 'platformInfo', info: {} } };
  let addEventListener = (m, cb) => {
    callback = cb;
  };
  let postMessage = (m, o) => {
    callback(fakeEvent);
  };

  mockPostMessage(addEventListener, postMessage);
}
*/
