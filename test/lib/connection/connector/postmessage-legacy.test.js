/* eslint-disable no-global-assign */
/* eslint-env jest, es6 */

import stubPostMessage, { mockPostMessage } from '../../mocks';
import connect from '../../../../src/lib/connection/connector/postmessage-legacy';
import { disconnect } from '../../../../src/lib/connection/connector/postmessage-legacy';
import command from '../../../../src/lib/connection/commands.js';
import { unload as unloadManager } from '../../../../src/lib/connection/manager';

const mockVersion = '3.5-test';
const standardMsg = { state: 'platformInfo', info: {} };

describe('connector/postmessage-legacy', () => {
  describe('connect', () => {
    beforeEach(() => {
      mockPostMessage();
    });

    afterEach(() => {
      disconnect();
      unloadManager();
    });

    it('should be a function', () => {
      expect(connect).toBeFunction();
    });

    it('should yield a Promise', () => {
      const res = connect();
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
      stubPostMessage(standardMsg);
      return expect(connect()).resolves.toBeFunction();
    });

    it('should provide a function', async () => {
      stubPostMessage(standardMsg);
      const fn = await connect();
      return expect(fn).toBeFunction();
    });

    describe('send function', () => {
      describe('accepts sdk commands', () => {
        const info = {
          state: 'platformInfo',
          info: { native: 'ios', mobile: true, version: mockVersion }
        };

        beforeEach(() => {
          stubPostMessage(info);
        });

        it('should reject on unknown commands', async () => {
          const sendFn = await connect();
          try {
            await sendFn('unknown-command');
          } catch (e) {
            expect(e.message).toEqual('Command unknown-command not supported by driver');
          }
        });

        describe('accepts all comands', () => {
          // mock window open
          window.open = function() {};

          const commandData = {
            prefContentLang: ['de_DE', 'en_US']
          };

          for (const cmd in command) {
            if (command.hasOwnProperty(cmd)) {
              it('command.' + cmd, async () => {
                const sendFn = await connect();
                return expect(sendFn(command[cmd], commandData[cmd])).resolves.toMatchSnapshot();
              });
            }
          }
        });
      });

      describe('invoke commands', () => {
        const fileUpload = {
          state: 'finishedImageUploadForPlugin',
          file: true
        };

        beforeEach(() => {
          stubPostMessage(fileUpload);
        });

        it(command.nativeUpload, async () => {
          const sendFn = await connect();
          const nativeUpload = await sendFn(command.nativeUpload);
          expect(nativeUpload).toEqual(true);
        });
      });
    });
  });
});
