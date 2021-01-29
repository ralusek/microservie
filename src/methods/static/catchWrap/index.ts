import { MicroServieMiddleware, Microservie } from '@/types';
import microservie from '@/index';

function catchWrap<IC extends object, MC extends IC>(
  middleware: MicroServieMiddleware<IC, MC>,
  errorHandler: (err: any) => any
): MicroServieMiddleware<IC, MC> {
  const instance = microservie({}, [middleware]);

  return (context: IC) => {
    return instance.run(context).catch(errorHandler);
  };
}

export default catchWrap;
