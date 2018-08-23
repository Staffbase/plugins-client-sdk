/* eslint-disable no-global-assign */
/* eslint-env jest, es6 */

import connect from '../../../../src/lib/connection/connector/postmessage';
import { disconnect } from '../../../../src/lib/connection/connector/postmessage';
import command from '../../../../src/lib/connection/commands.js';
import genId from '../../../../src/lib/utils/genId';

jest.mock('../../../../src/lib/utils/genId');

describe('postmessage', () => {
  describe('connect', () => {
    beforeEach(() => {
      disconnect();
      mockPostMessage();
    });

    afterEach(() => {
      disconnect();
    });

    test('should be a function', () => {
      expect(connect).toBeFunction();
    });

    test('should yield a Promise', () => {
      let res = connect();
      expect(res instanceof Promise).toBeTrue;
    });

    test('should use postMessage', () => {
      jest.spyOn(window.parent, 'postMessage');
      connect();
      expect(window.parent.postMessage).toHaveBeenCalledTimes(1);
    });

    test('should send a HELLO message', () => {
      jest.spyOn(window.parent, 'postMessage');
      connect();
      let message = window.parent.postMessage.mock.calls[0][0];
      expect(message[0]).toEqual('HELLO');
    });

    test('should resolve on SUCCESS message', async () => {
      stubPostMessage();
      return expect(await connect()).toBe.ok;
    });

    test('should provide a function', async () => {
      stubPostMessage();
      let fn = await connect();
      return expect(fn).toBeFunction();
    });

    describe('send function', async () => {
      describe('should accept sdk commands', async () => {
        let mockVersion = '3.6-test';

        beforeEach(() => {
          stubPostMessage();
        });

        afterEach(() => {
          disconnect();
        });

        test(command.ios, async () => {
          let sendFn = await connect();
          let ios = await sendFn(command.ios);
          expect(ios).toBe.true;
        });

        test(command.android, async () => {
          let sendFn = await connect();
          let android = await sendFn(command.android);
          expect(android).toBe.false;
        });

        test(command.mobile, async () => {
          let sendFn = await connect();
          let mobile = await sendFn(command.mobile);
          expect(mobile).toBe.true;
        });

        test(command.version, async () => {
          let sendFn = await connect();
          let version = await sendFn(command.version);
          expect(version).toEqual(mockVersion);
        });

        test('throw error on unknown commands', async () => {
          let sendFn = await connect();
          let data = 'Command unknown not supported by driver';

          try {
            await sendFn('unknown');
          } catch (error) {
            expect(error.message).toEqual(data);
          }
        });
      });

      describe('should send invoke commands', async () => {
        let responseSpy;

        beforeEach(() => {
          responseSpy = stubPostMessage();
        });

        afterEach(() => {
          disconnect();
        });
        test(command.openLink, async () => {
          let sendFn = await connect();
          let data = 'Link opened';
          let success = ['SUCCESS', 'ff22', data];

          genId.mockReturnValue('ff22');
          responseSpy.changeMsg(success);
          let result = await sendFn(command.openLink, 'http://staffbase.com');

          expect(result).toEqual(data);
        });

        test('reject on error', async () => {
          let sendFn = await connect();
          let data = 'No url set.';
          let error = ['ERROR', 'ff22', data];

          genId.mockReturnValue('ff22');
          responseSpy.changeMsg(error);
          expect(sendFn(command.openLink, 'http://staffbase.com')).rejects.toEqual(data);
        });
      });
    });
  });
});

/**
 * Stub the post message interface
 *
 * postMessage will triger the registered message handler directly
 * either with default event mock or the provided msg
 *
 * @param {any} msg to send to the eventListener
 * @return {function}
 */
function stubPostMessage(msg) {
  let mockVersion = '3.6-test';
  let callback = null;
  let fakeEvent = msg || [
    'SUCCESS',
    0,
    {
      platform: { native: 'ios', mobile: true, version: mockVersion },
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
  let addEventListener = (m, cb) => {
    callback = cb;
  };

  let postMessage = (m, o) => {
    // forwards correct message id
    fakeEvent[1] = m[1];

    window.setTimeout(() => {
      callback({ data: fakeEvent });
    }, 10);
  };

  mockPostMessage(addEventListener, postMessage);

  return { changeMsg: msg => (fakeEvent = msg) };
}

/**
 * Mock the post message interface
 *
 * so acting on post message will yield no results by default
 * or provide custom implementations
 *
 * @param {function} cbAEL window.addEventListener implementation
 * @param {function} cbPM window.postMessage implementation
 */
function mockPostMessage(cbAEL, cbPM) {
  jest
    .spyOn(window, 'addEventListener')
    .mockImplementation(cbAEL || function(message, receiveMessage) {});
  jest.spyOn(window.parent, 'postMessage').mockImplementation(cbPM || function(message, origin) {});
}
