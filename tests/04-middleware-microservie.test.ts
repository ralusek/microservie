import 'mocha';
import { expect } from 'chai';

// Types
import { Microservie } from '../lib/types';

import microservie from '../lib/index';

let instances: { [k in string]: Microservie } = {};

describe('Middleware: Microservies', () => {
  it('should accept Microservies as middleware', () => {
    instances.a = microservie(
      {
        name: 'a',
      },
      () => []
    );
    instances.b = microservie(
      {
        name: 'b',
      },
      () => []
    );
    instances.c = microservie(
      {
        name: 'c',
      },
      () => [instances.a, instances.b]
    );
  });

  it('should run the Microservies as middleware, and their respective middlewares', () => {
    const called: { [key in string]: boolean } = {};

    instances.a = microservie(
      {
        name: 'a',
      },
      () => [() => (called.a = true)]
    );
    instances.b = microservie(
      {
        name: 'b',
      },
      () => [() => (called.b = true)]
    );
    instances.c = microservie(
      {
        name: 'c',
      },
      () => [instances.a, instances.b]
    );

    return instances.c.run({}).then(() => {
      expect(called.a).to.be.true;
      expect(called.b).to.be.true;
    });
  });

  it('should error if any of the Microservies error.', () => {
    let error: Error;
    let lastCalled = false;
    const message = 'The error.';
    instances.b = microservie(
      {
        name: 'b',
      },
      () => [() => Promise.reject((error = new Error(message)))]
    );

    return instances.c.run({}).then(
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
