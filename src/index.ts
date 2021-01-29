// Types
import { MicroServieMiddleware, Microservie, MicroservieConfig } from '@/types';
// Methods
import run from '@/methods/public/run';
import catchWrap from '@/methods/static/catchWrap';

function microservie<IC extends object, MC extends IC>(
  config: MicroservieConfig,
  /**
   * An array of middleware, or a function returning the middleware.
   * Passing as a function can avoid issues with circular dependencies.
   */
  middleware: (() => MicroServieMiddleware<IC, MC>[]) | MicroServieMiddleware<IC, MC>[]
): Microservie<IC, MC> {
  const instance = {
    run: (context: IC) => run(config, context, middleware),
  };

  Object.defineProperty(instance, 'IS_MICROSERVIE', { value: true });

  // @ts-ignore
  return instance;
}

microservie.catchWrap = catchWrap;

export default microservie;
