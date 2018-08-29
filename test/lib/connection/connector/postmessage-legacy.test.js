/* eslint-disable no-global-assign */
/* eslint-env jest, es6 */

import connect from '../../../../src/lib/connection/connector/postmessage-legacy';
import { disconnect } from '../../../../src/lib/connection/connector/postmessage-legacy';
import command from '../../../../src/lib/connection/commands.js';

describe('connector/postmessage-legacy', () => {
  describe('connect', () => {
    beforeEach(() => {
      mockPostMessage();
    });

    afterEach(() => {
      disconnect();
    });

    it('should be a function', () => {
      expect(connect).toBeFunction();
    });

    it('should yield a Promise', () => {
      let res = connect();
      expect(res instanceof Promise).toBeTrue();
    });

    it('should use postMessage', () => {
      jest.spyOn(window.parent, 'postMessage');
      connect();
      expect(window.parent.postMessage).toHaveBeenCalledTimes(1);
    });

    it('should send a pluginLoaded message', () => {
      jest.spyOn(window.parent, 'postMessage');
      connect();

      expect(window.parent.postMessage).toHaveBeenCalledWith('pluginLoaded', '*');
    });

    it('should resolve on platformInfo message', () => {
      stubPostMessage();
      return expect(connect()).resolves.toBeFunction();
    });

    it('should provide a function', async () => {
      stubPostMessage();
      let fn = await connect();
      return expect(fn).toBeFunction();
    });

    describe('send function', async () => {
      describe('accepts sdk commands', async () => {
        let mockVersion = '3.5-test';
        let info = {
          state: 'platformInfo',
          info: { native: 'ios', mobile: true, version: mockVersion }
        };

        beforeEach(() => {
          stubPostMessage(info);
        });

        it('should reject on unknown commands', async () => {
          let sendFn = await connect();
          try {
            await sendFn('unknown-command');
          } catch (e) {
            expect(e.message).toEqual('Command unknown-command not supported by driver');
          }
        });

        describe('accepts all comands', async () => {
          // mock window open
          window.open = function() {};

          let commandData = {
            prefContentLang: ['de_DE', 'en_US']
          };

          for (let cmd in command) {
            if (command.hasOwnProperty(cmd)) {
              it('command.' + cmd, async () => {
                let sendFn = await connect();
                return expect(sendFn(command[cmd], commandData[cmd])).resolves.toMatchSnapshot();
              });
            }
          }
        });
      });

      describe('invoke commands', async () => {
        let fileUpload = {
          state: 'finishedImageUploadForPlugin',
          file: true
        };

        beforeEach(() => {
          stubPostMessage(fileUpload);
        });

        it(command.nativeUpload, async () => {
          let sendFn = await connect();
          let nativeUpload = await sendFn(command.nativeUpload);
          expect(nativeUpload).toEqual(true);
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
  let callback = null;
  let fakeEvent = { data: msg || { state: 'platformInfo', info: {} } };
  let addEventListener = (m, cb) => {
    callback = cb;
  };

  let postMessage = (m, o) => {
    window.setTimeout(() => {
      callback(fakeEvent);
    }, 10);
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
  jest
    .spyOn(window, 'addEventListener')
    .mockImplementation(cbAEL || function(message, receiveMessage) {});
  jest.spyOn(window.parent, 'postMessage').mockImplementation(cbPM || function(message, origin) {});
}
