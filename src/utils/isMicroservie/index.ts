import { Microservie, MicroservieContext } from '@/types';

export default function isMicroservie(test: any): test is Microservie<MicroservieContext> {
  return test && test.IS_MICROSERVIE === true;
}
