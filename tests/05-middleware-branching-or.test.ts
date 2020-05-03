import 'mocha';
import { expect } from 'chai';

// Types
import { Microservie } from '../lib/types';

import microservie from '../lib/index';

let instance: Microservie;

describe('Middleware: Branching $or', () => {
  it('should accept branching $or', () => {
    instance = microservie(
      {
        name: 'Branching $or',
      },
      () => [
        {
          $or: [() => {}, () => {}],
        },
      ]
    );
  });

  it('should call all middleware simultaneously and resolve when the first resolves.', () => {
    const called: { [key in string]: boolean } = {};
    const resolved: { [key in string]: boolean } = {};
    const errored: { [key in string]: Error } = {};

    instance = microservie(
      {
        name: 'Branching $or',
      },
      () => [
        {
          $or: [
            () => {
              called.a = true;
              return new Promise((resolve) => {
                setTimeout(() => {
                  expect(errored.c).to.not.be.undefined;
                  expect(called.b).to.be.true;
                  expect(called.c).to.be.true;
                  expect(resolved.b).to.not.be.true;
                  resolve((resolved.a = true));
                }, 15);
              });
            },
            () => {
              called.b = true;
              return new Promise((resolve) => {
                setTimeout(() => {
                  expect(errored.c).to.not.be.undefined;
                  expect(called.a).to.be.true;
                  expect(called.c).to.be.true;
                  expect(resolved.a).to.be.true;
                  resolve((resolved.b = true));
                }, 30);
              });
            },
            () => {
              called.c = true;
              errored.c = new Error('Hey');
              throw errored.c;
            },
          ],
        },
      ]
    );

    return instance.run({}).then(() => {
      // All 3 were called.
      expect(called.a).to.be.true;
      expect(called.b).to.be.true;
      expect(called.c).to.be.true;

      // A should have been resolved and we shouldn't have waited for b to resolve
      expect(resolved.a).to.be.true;
      expect(resolved.b).to.not.be.true;

      // Expect c to have errored, and it shouldn't prevent this from resolving.
      expect(errored.c).to.not.be.undefined;
    });
  });
});
