import { MicroservieMiddleware, Microservie, MicroservieContext } from '@/types';
import microservie from '@/index';

function catchWrap(middleware: MicroservieMiddleware, errorHandler: (err: any) => any): MicroservieMiddleware {
  const instance = microservie({}, [middleware]);

  return (context) => {
    return instance.run(context).catch(errorHandler);
  };
}

export default catchWrap;
