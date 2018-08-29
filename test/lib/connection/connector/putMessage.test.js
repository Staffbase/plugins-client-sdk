/* eslint-disable no-global-assign */
/* eslint-env jest, es6 */

import connect from '../../../../src/lib/connection/connector/putMessage';
import { disconnect } from '../../../../src/lib/connection/connector/putMessage';
import stubPutMessage from '../../iosMocks';
import command from '../../../../src/lib/connection/commands.js';
import genId from '../../../../src/lib/utils/genId';
import { unload as unloadManager } from '../../../../src/lib/connection/manager';

jest.mock('../../../../src/lib/utils/genId');

let mockVersion = '3.6-dev';
let info = { native: 'ios', mobile: true, version: mockVersion };

let language = { branchDefaultLanguage: 'de_DE' };

let welcomeMessage = ['SUCCESS', 'abcd', { platform: info, language: language }];

describe('putmessage', () => {
  describe('connect', () => {
    let messageMock;

    beforeEach(() => {
      genId.mockReturnValue('abcd');
      messageMock = stubPutMessage(welcomeMessage);
    });

    afterEach(() => {
      messageMock.stopMessaging();
      disconnect();
      unloadManager();
    });

    it('should be a function', () => {
      expect(connect).toBeFunction();
    });

    it('should yield a Promise', () => {
      let res = connect();
      expect(res instanceof Promise).toBeTrue();
    });

    it('should install handler functions', () => {
      connect();
      expect(window.Staffbase.plugins.getMessages).toBeFunction();
      expect(window.Staffbase.plugins.putMessage).toBeFunction();
    });

    it('should send a HELLO message', () => {
      connect();
      let message = window.Staffbase.plugins.getMessages();
      expect(message[0][0]).toEqual('HELLO');
    });

    it('should resolve on SUCCESS message', async () => {
      return expect(await connect()).toBe.ok;
    });

    it('should provide a function', async () => {
      let fn = await connect();
      return expect(fn).toBeFunction();
    });

    describe('send function', async () => {
      describe('should accept sdk commands', async () => {
        it(command.ios, async () => {
          let sendFn = await connect();
          let ios = await sendFn(command.ios);
          expect(ios).toBeTrue();
        });

        it(command.android, async () => {
          let sendFn = await connect();
          let android = await sendFn(command.android);
          expect(android).toBeFalse();
        });

        it(command.mobile, async () => {
          let sendFn = await connect();
          let mobile = await sendFn(command.mobile);
          expect(mobile).toBeTrue();
        });

        it(command.version, async () => {
          let sendFn = await connect();
          let version = await sendFn(command.version);
          expect(version).toEqual(mockVersion);
        });

        it('throw error on unknown commands', async () => {
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
        it(command.openLink, async () => {
          let sendFn = await connect();
          let data = 'Link opened';
          let success = ['SUCCESS', 'ff33', data];

          genId.mockReturnValue('ff33');
          messageMock.changeMsg(success);
          let result = await sendFn(command.openLink, 'http://staffbase.com');

          expect(result).toEqual(data);
        });

        it('reject on error', async () => {
          let sendFn = await connect();
          let data = 'No url set.';
          let error = ['ERROR', 'ff33', data];

          genId.mockReturnValue('ff33');
          messageMock.changeMsg(error);
          expect(sendFn(command.openLink, 'http://staffbase.com')).rejects.toEqual(data);
        });
      });
    });
  });
});
