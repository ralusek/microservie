import { Microservie } from '@/types';

export default function isMicroservie<IC extends object>(test: any): test is Microservie<IC> {
  return test && test.IS_MICROSERVIE === true;
}
