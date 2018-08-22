import connect from '../../../../src/lib/connection/connector/fallback';
import { disconnect } from '../../../../src/lib/connection/connector/fallback';
import command from '../../../../src/lib/connection/commands';

let chai = require('chai');
let expect = chai.expect;

describe('connector/fallback', function() {
  describe('connect', function() {
    afterEach(function() {
      disconnect();
    });

    it('should be a function', () => {
      expect(connect).to.be.a('function');
    });

    it('should yield a Promise', () => {
      let res = connect();
      expect(res).to.be.a('promise');
    });

    it('should provide a function', async () => {
      let fn = await connect();
      expect(fn).to.be.a('function');
    });

    it('should resolve after 500 ms', async () => {
      let start = new Date().getTime();
      return connect().then(() => {
        let end = new Date().getTime();
        expect(end - start).to.be.at.least(499);
      });
    });

    it('should resolve before 600 ms', async () => {
      let start = new Date().getTime();
      return connect().then(() => {
        let end = new Date().getTime();
        expect(end - start).to.be.at.most(600);
      });
    });

    describe('send function', async function() {
      it('should reject on unknown commands', async () => {
        let sendFn = await connect();
        return expect(sendFn('unknown-asdf-command')).to.be.rejected;
      });

      describe('accepts all comands', async function() {
        // mock window open
        window.open = function() {};

        let commandData = {
          prefContentLang: ['de_DE', 'en_US']
        };

        for (let cmd in command) {
          if (command.hasOwnProperty(cmd)) {
            it('command.' + cmd, async () => {
              let sendFn = await connect();
              return expect(sendFn(command[cmd], commandData[cmd])).to.be.fulfilled;
            });
          }
        }
      });
    });
  });
});
