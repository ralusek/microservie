import 'mocha';
import { expect } from 'chai';

import microservie from '../lib/index';

let instance;

describe('Middleware: Branching $and', () => {
  it('should accept branching $and', () => {
    instance = microservie(
      {
        name: 'Branching $and',
      },
      () => [
        {
          $and: [() => {}, () => {}],
        },
      ]
    );
  });

  it('should call all middleware and resolve only if all middlewares do not throw errors.', () => {
    const called: { [key in string]: boolean } = {};
    const resolved: { [key in string]: boolean } = {};
    const errored: { [key in string]: Error } = {};

    instance = microservie(
      {
        name: 'Branching $and',
      },
      () => [
        {
          $and: [
            () => {
              called.a = true;
              return new Promise((resolve) => {
                setTimeout(() => {
                  expect(called.a).to.be.true;
                  expect(called.b).to.be.true;
                  expect(called.c).to.be.true;
                  resolve((resolved.a = true));
                }, 15);
              });
            },
            () => {
              called.b = true;
              return new Promise((resolve) => {
                setTimeout(() => {
                  expect(called.a).to.be.true;
                  expect(called.b).to.be.true;
                  expect(called.c).to.be.true;
                  expect(resolved.a).to.be.true;
                  resolve((resolved.b = true));
                }, 20);
              });
            },
            () => {
              called.c = true;
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  expect(called.a).to.be.true;
                  expect(called.b).to.be.true;
                  expect(called.c).to.be.true;
                  expect(resolved.a).to.be.true;
                  expect(resolved.b).to.be.true;
                  resolve((resolved.c = true));
                }, 30);
              });
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

      // All 3 middlewares should have been resolved.
      expect(resolved.a).to.be.true;
      expect(resolved.b).to.be.true;
      expect(resolved.c).to.be.true;

      // Expect no errors.
      expect(errored.c).to.be.undefined;
    });
  });

  it('should call all of the middlewares but error if any of them throw an error', async () => {
    const called: { [key in string]: boolean } = {};
    const resolved: { [key in string]: boolean } = {};
    const errored: { [key in string]: Error } = {};

    instance = microservie(
      {
        name: 'Branching $and',
      },
      () => [
        {
          $and: [
            (context) => {
              context.something = 'hi'; // just a type test

              called.a = true;
              return new Promise((resolve) => {
                setTimeout(() => {
                  expect(called.a).to.be.true;
                  expect(called.b).to.be.true;
                  expect(called.c).to.be.true;
                  resolve((resolved.a = true));
                }, 15);
              });
            },
            (context) => {
              called.b = true;
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  expect(called.a).to.be.true;
                  expect(called.b).to.be.true;
                  expect(called.c).to.be.true;
                  expect(resolved.a).to.be.true;
                  reject((errored.b = new Error('Error')));
                }, 20);
              });
            },
            () => {
              called.c = true;
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  expect(called.a).to.be.true;
                  expect(called.b).to.be.true;
                  expect(called.c).to.be.true;
                  expect(resolved.a).to.be.true;
                  expect(errored.b).to.be.an.instanceof(Error);
                  resolve((resolved.c = true));
                }, 30);
              });
            },
          ],
        },
      ]
    );

    await instance.run({}).catch((error) => {
      errored.d = new Error();

      // All 3 were called.
      expect(called.a).to.be.true;
      expect(called.b).to.be.true;
      expect(called.c).to.be.true;

      expect(resolved.a).to.be.true;
      expect(resolved.b).to.be.undefined;
      expect(resolved.c).to.be.undefined; // Resolves, but not before b errors, which is what calls this catch

      // Expect b to have errored
      expect(errored.b).to.be.an.instanceof(Error);
    });

    expect(errored.d).to.not.be.undefined;
  });
});
