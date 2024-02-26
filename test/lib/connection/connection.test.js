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
      const result = sendMessage(command.version);
      jest.runOnlyPendingTimers();

      expect(await result).toBe('3.4');
    });

    test('should receive a message from postmessage connector if available', async () => {
      messageStup = stubPostMessage(standardMsg36);
      const result = await sendMessage(command.version);
      jest.runOnlyPendingTimers();
      messageStup.stopMessaging();

      expect(result).toBe(mockVersion36);
    });

    test('should upgrade a connection if the postmessage takes longer than the fallback timeout', async () => {
      messageStup = stubPostMessage(standardMsg36, 600);

      let result = sendMessage(command.version);
      jest.runOnlyPendingTimers();
      expect(await result).toBe('3.4');

      result = sendMessage(command.version);
      jest.runOnlyPendingTimers();
      messageStup.stopMessaging();

      expect(await result).toBe(mockVersion36);
    });
  });
});
