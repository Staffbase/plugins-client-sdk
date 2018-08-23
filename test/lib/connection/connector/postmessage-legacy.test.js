/* eslint-disable no-global-assign */
/* eslint-env jest, es6 */

import stubPostMessage, { mockPostMessage } from '../../mocks';
import connect from '../../../../src/lib/connection/connector/postmessage-legacy';
import { disconnect } from '../../../../src/lib/connection/connector/postmessage-legacy';
import command from '../../../../src/lib/connection/commands.js';

const mockVersion = '3.5-test';
const standardMsg = { state: 'platformInfo', info: {} };

describe('connector/postmessage-legacy', () => {
  describe('connect', () => {
    beforeEach(() => {
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
      expect(window.parent.postMessage.calledOnce).toBeTrue;
    });

    test('should send a pluginLoaded message', () => {
      jest.spyOn(window.parent, 'postMessage');
      connect();

      expect(window.parent.postMessage).toHaveBeenCalledWith('pluginLoaded', '*');
    });

    test('should resolve on platformInfo message', () => {
      stubPostMessage(standardMsg);
      return expect(connect()).resolves.toBeFunction();
    });

    test('should provide a function', async () => {
      stubPostMessage(standardMsg);
      let fn = await connect();
      return expect(fn).toBeFunction();
    });

    describe('send function', async () => {
      describe('accepts sdk commands', async () => {
        let info = {
          state: 'platformInfo',
          info: { native: 'ios', mobile: true, version: mockVersion }
        };

        beforeEach(() => {
          stubPostMessage(info);
        });

        afterEach(() => {
          disconnect();
        });

        test('should reject on unknown commands', async () => {
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
              test('command.' + cmd, async () => {
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

        test(command.nativeUpload, async () => {
          let sendFn = await connect();
          let nativeUpload = await sendFn(command.nativeUpload);
          expect(nativeUpload).toEqual(true);
        });
      });
    });
  });
});
