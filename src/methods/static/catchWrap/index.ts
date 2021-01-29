import { MicroServieMiddleware, Microservie } from '@/types';
import microservie from '@/index';

function catchWrap<IC extends object>(
  middleware: MicroServieMiddleware<IC>,
  errorHandler: (err: any) => any
): MicroServieMiddleware<IC> {
  const instance = microservie({}, [middleware]);

  return (context: IC) => {
    return instance.run(context).catch(errorHandler);
  };
}

export default catchWrap;
