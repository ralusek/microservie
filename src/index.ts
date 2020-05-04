// Types
import { MicroServieMiddleware, Microservie, MicroservieConfig } from '@/types';
// Methods
import run from '@/methods/public/run';

function microservie<IC extends object>(
  config: MicroservieConfig,
  /**
   * An array of middleware, or a function returning the middleware.
   * Passing as a function can avoid issues with circular dependencies.
   */
  middleware: (() => MicroServieMiddleware<IC>[]) | MicroServieMiddleware<IC>[]
): Microservie<IC> {
  const instance = {
    run: (context: IC) => run(config, context, middleware),
  };

  Object.defineProperty(instance, 'IS_MICROSERVIE', { value: true });

  // @ts-ignore
  return instance;
}

export default microservie;
