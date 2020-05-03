
import 'mocha';
import { expect } from 'chai';

// Types
import { Microservie } from '../lib/types';

import microservie from '../lib/index';


let instance: Microservie;

describe('Instantiation', () => {
  it('should instantiate a new instance.', () => {

    instance = microservie({
      name: 'A'
    }, []);

    // expect(true).to.equal(true);
    // // const result = hello();
    // // expect(result).to.equal('Hello World!');
  });
});