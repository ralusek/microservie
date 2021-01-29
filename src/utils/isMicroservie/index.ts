import { Microservie } from '@/types';

export default function isMicroservie<IC extends object, MC extends IC>(test: any): test is Microservie<IC, MC> {
  return test && test.IS_MICROSERVIE === true;
}
