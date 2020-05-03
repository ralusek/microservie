import { Microservie } from '~/types';

export default (test: any): test is Microservie => {
  return test && test.IS_MICROSERVIE === true;
};
