import 'mocha';
import { expect } from 'chai';

// Types
import { Microservie } from '../lib/types';

import microservie from '../lib/index';

let instance;

describe('Middleware: Functions', () => {
  it('should accept functions as middleware', () => {
    instance = microservie(
      {
        name: 'Functions',
      },
      () => [() => {}, () => {}, () => {}]
    );
  });

  it('should call the functions in order, awaiting resolution from the previous.', () => {
    const called: any = {};
    const resolved: any = {};

    instance = microservie(
      {
        name: 'Functions',
      },
      () => [
        () => {
          called.a = true;
          return new Promise((resolve) => {
            setTimeout(() => {
              expect(called.a).to.be.true;
              expect(called.b).to.not.be.true;
              expect(called.c).to.not.be.true;
              expect(resolved.a).to.not.be.true;
              expect(resolved.b).to.not.be.true;
              expect(resolved.c).to.not.be.true;
              resolve((resolved.a = true));
            }, 25);
          });
        },
        () => {
          called.b = true;
          return new Promise((resolve) => {
            setTimeout(() => {
              expect(called.a).to.be.true;
              expect(called.b).to.be.true;
              expect(called.c).to.not.be.true;
              expect(resolved.a).to.be.true;
              expect(resolved.b).to.not.be.true;
              expect(resolved.c).to.not.be.true;
              resolve((resolved.b = true));
            }, 25);
          });
        },
        () => {
          called.c = true;
          return new Promise((resolve) => {
            setTimeout(() => {
              expect(called.a).to.be.true;
              expect(called.b).to.be.true;
              expect(called.c).to.be.true;
              expect(resolved.a).to.be.true;
              expect(resolved.b).to.be.true;
              expect(resolved.c).to.not.be.true;
              resolve((resolved.c = true));
            }, 25);
          });
        },
      ]
    );

    return instance.run({}).then(() => {
      expect(resolved.c).to.be.true;
    });
  });

  it('should error if any of the functions error.', () => {
    let error: Error;
    let lastCalled = false;
    const message = 'The error.';
    instance = microservie(
      {
        name: 'Functions',
      },
      () => [
        () => Promise.resolve(),
        () => Promise.reject((error = new Error(message))),
        () => Promise.resolve((lastCalled = true)),
      ]
    );

    return instance.run({}).then(
      () => {
        throw new Error('Should not have been called.');
      },
      () => {
        expect(error).to.not.be.undefined;
        expect(error.message).to.equal(message);
        expect(lastCalled).to.be.false;
      }
    );
  });
});
