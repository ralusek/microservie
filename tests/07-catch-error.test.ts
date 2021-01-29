import 'mocha';
import { expect } from 'chai';

import microservie from '../lib/index';

describe('Error catching', () => {
  it('should pass the expected context through the middleware', async () => {
    let failed = false;

    const instance = microservie({}, [
      microservie.catchWrap(
        {
          $or: [() => Promise.reject(new Error('A')), () => Promise.reject(new Error('B'))],
        },
        (err) => {
          expect(err).to.not.be.undefined;
          expect(err.message === 'A' || err.message === 'B').to.be.true;
          return Promise.reject(new Error('C'));
        }
      ),
    ]);

    await instance.run({}).catch((err) => {
      failed = true;
      expect(err.message).to.equal('C');
    });

    expect(failed).to.be.true;
  });
});
