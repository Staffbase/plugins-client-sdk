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
      const res = connect();
      expect(res instanceof Promise).toBeTrue();
    });

    test('should provide a function', async () => {
      const fn = await connect();
      expect(fn).toBeFunction();
    });

    test('should resolve after 500 ms', async () => {
      const start = new Date().getTime();
      return connect().then(() => {
        const end = new Date().getTime();
        expect(end - start).toBeGreaterThan(490);
      });
    });

    test('should resolve before 600 ms', async () => {
      const start = new Date().getTime();
      return connect().then(() => {
        const end = new Date().getTime();
        expect(end - start).toBeLessThan(600);
      });
    });

    describe('send function', () => {
      test('should reject on unknown commands', async () => {
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
            test('command.' + cmd, async () => {
              const sendFn = await connect();
              return expect(sendFn(command[cmd], commandData[cmd])).resolves.toMatchSnapshot();
            });
          }
        }
      });
    });
  });
});
