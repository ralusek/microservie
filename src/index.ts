// Types
import { AvailableContext, MicroservieMiddleware, Microservie, MicroservieConfig, MicroservieContext } from '@/types';
// Methods
import run from '@/methods/public/run';
import catchWrap from '@/methods/static/catchWrap';

function microservie<T extends AvailableContext>(
  config: MicroservieConfig,
  /**
   * An array of middleware, or a function returning the middleware.
   * Passing as a function can avoid issues with circular dependencies.
   */
  middleware: (() => MicroservieMiddleware[]) | MicroservieMiddleware[]
): Microservie<T> {
  const instance = {
    run: (context: T) => run(config, context, middleware),
  };

  Object.defineProperty(instance, 'IS_MICROSERVIE', { value: true });

  // @ts-ignore
  return instance;
}

microservie.catchWrap = catchWrap;

export default microservie;
