import 'mocha';
import { expect } from 'chai';

import microservie from '../lib/index';

let instance;

describe('LazyInstantiation', () => {
  it('should accept a getter function as middleware.', () => {
    instance = microservie(
      {
        name: 'Lazy',
      },
      () => []
    );
  });

  it('should not call the getter function upon instantiation.', () => {
    instance = microservie(
      {
        name: 'Lazy',
      },
      () => {
        throw new Error('Should not have been called.');
      }
    );
  });

  it('should call the getter only after running.', () => {
    let hasCalled = false;
    const instance = microservie(
      {
        name: 'Lazy',
      },
      () => {
        hasCalled = true;
        return [];
      }
    );
    expect(hasCalled).to.be.false;

    instance.run({
      hi: 'hey',
    });

    expect(hasCalled).to.be.true;
  });
});
