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

jest.useFakeTimers({ advanceTimers: true });
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

      let result = await sendMessage(command.version);
      expect(result).toBe('3.4');
      jest.advanceTimersByTime(2000);
      // await delay(200);

      result = await sendMessage(command.version);
      messageStup.stopMessaging();

      expect(result).toBe(mockVersion36);
    });
  });
});

const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));
