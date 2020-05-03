import 'mocha';
import { expect } from 'chai';

// Types
import { Microservie } from '../lib/types';

import microservie from '../lib/index';

let instance: Microservie;

describe('Instantiation', () => {
  it('should instantiate a new instance.', () => {
    instance = microservie(
      {
        name: 'A',
      },
      []
    );
  });

  it('should fail instantiation with no arguments.', () => {
    try {
      // @ts-ignore
      microservie();
      throw new Error('Should not have been called.');
    } catch (err) {
      expect(err).to.exist;
    }
  });
});
