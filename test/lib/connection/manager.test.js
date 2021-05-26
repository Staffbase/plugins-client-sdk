/* eslint-disable no-global-assign */
/* eslint-env jest, es6 */

import * as manager from '../../../src/lib/connection/manager';

describe('manager', () => {
  beforeEach(() => {});

  afterEach(() => {});

  test('should delete a promise after resolving', (done) => {
    const promiseID = manager.create();
    const promise = manager.get(promiseID);

    promise
      .then(() => {
        manager.get(promiseID);
      })
      .catch(function (error) {
        expect(error).toBe.ok;
        done();
      });

    manager.resolve(promiseID, true);
  });

  test('should delete a promise after rejecting', (done) => {
    const promiseID = manager.create();
    const promise = manager.get(promiseID);

    promise
      .then(() => {})
      .catch(function () {
        manager.get(promiseID);
      })
      .catch(function (error) {
        expect(error).toBe.ok;
        done();
      });

    manager.reject(promiseID, true);
  });
});
