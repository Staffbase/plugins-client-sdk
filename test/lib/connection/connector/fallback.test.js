/* eslint-env jest, es6 */

import connect from '../../../../src/lib/connection/connector/fallback';
import { disconnect } from '../../../../src/lib/connection/connector/fallback';
import command from '../../../../src/lib/connection/commands';

describe('connector/fallback', () => {
  describe('connect', () => {
    afterEach(() => {
      disconnect();
    });

    test('should be a function', () => {
      expect(connect).toBeFunction();
    });

    test('should yield a Promise', () => {
      let res = connect();
      expect(res instanceof Promise).toBeTrue();
    });

    test('should provide a function', async () => {
      let fn = await connect();
      expect(fn).toBeFunction();
    });

    test('should resolve after 500 ms', async () => {
      let start = new Date().getTime();
      return connect().then(() => {
        let end = new Date().getTime();
        expect(end - start).toBeGreaterThan(490);
      });
    });

    test('should resolve before 600 ms', async () => {
      let start = new Date().getTime();
      return connect().then(() => {
        let end = new Date().getTime();
        expect(end - start).toBeLessThan(600);
      });
    });

    describe('send function', async () => {
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
  });
});
