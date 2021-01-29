import 'mocha';
import { expect } from 'chai';

import microservie from '../lib/index';

let instance;

describe('Context', () => {
  it('should pass the expected context through the middleware', async () => {
    const testObj = {
      hi: 'hey',
    };
    let finished = false;

    const instance = microservie<typeof testObj, typeof testObj>(
      {
        name: 'A',
      },
      [
        (context) => {
          expect(context).to.equal(testObj);
        },
        (context) => {
          expect(context).to.equal(testObj);
        },
        {
          $or: [
            (context) => {
              expect(context).to.equal(testObj);
            },
          ],
        },
        {
          $and: [
            (context) => {
              expect(context).to.equal(testObj);
              finished = true;
            },
          ],
        },
      ]
    );

    await instance.run(testObj);
    expect(finished).to.be.true;
  });
});
