/* eslint-disable no-global-assign */
/* eslint-env jest, es6 */

import connect from '../../../../src/lib/connection/connector/postmessage';
import { disconnect } from '../../../../src/lib/connection/connector/postmessage';
import command from '../../../../src/lib/connection/commands.js';

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
        let info = ['SUCCESS', 0, { native: 'ios', mobile: true, version: mockVersion }];
        let responseSpy;

        beforeEach(() => {
          responseSpy = jest.fn();
          stubPostMessage(responseSpy.mockReturnValueOnce(info));
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
        let mockVersion = '3.6-test';
        let info = ['SUCCESS', 0, { native: 'ios', mobile: true, version: mockVersion }];
        let responseSpy;

        beforeEach(() => {
          responseSpy = jest.fn();
          stubPostMessage(responseSpy.mockReturnValueOnce(info));
        });

        afterEach(() => {
          disconnect();
        });

        xit(command.openLink, async () => {
          let sendFn = await connect();
          let data = 'Link opened';
          let success = ['SUCCESS', 1, data];

          responseSpy.mockReturnValueOnce(success);
          let result = await sendFn(command.openLink, 'http://staffbase.com');

          expect(result).to.equal(data);
        });

        xit('reject on error', async () => {
          let sendFn = await connect();
          let data = 'No url set.';
          let error = ['ERROR', 1, data];

          responseSpy.mockReturnValueOnce(error);

          try {
            await sendFn(command.openLink, 'http://staffbase.com');
            /* eslint-disable no-undef */
            done(new Error('it did not throw'));
          } catch (error) {
            expect(error).to.equal(data);
          }
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
 */
function stubPostMessage(msg) {
  let mockVersion = '3.6-test';
  let callback = null;
  let fakeEvent = [
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
    callback({ data: fakeEvent });
  };

  mockPostMessage(addEventListener, postMessage);
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
  window = {};
  window.parent = {};
  window.addEventListener = cbAEL || function(message, receiveMessage) {};
  window.parent.postMessage = cbPM || function(message, origin) {};
}
