/* eslint-disable no-global-assign */

let chai = require('chai');
let expect = chai.expect;
// let sinon = require('sinon');

import * as manager from '../../../src/lib/connection/manager';

describe('manager', function() {
  beforeEach(function() {});

  afterEach(function() {});

  it('should delete a promise after resolving', done => {
    const promiseID = manager.create();
    const promise = manager.get(promiseID);

    promise
      .then(() => {
        manager.get(promiseID);
      })
      .catch(function(error) {
        expect(error).to.be.ok;
        done();
      });

    manager.resolve(promiseID, true);
  });

  it('should delete a promise after rejecting', done => {
    const promiseID = manager.create();
    const promise = manager.get(promiseID);

    promise
      .then(() => {})
      .catch(function() {
        manager.get(promiseID);
      })
      .catch(function(error) {
        expect(error).to.be.ok;
        done();
      });

    manager.reject(promiseID, true);
  });
});
