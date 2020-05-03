import Promise from 'bluebird';

// Types
import { MicroServieMiddleware, Microservie, MicroservieConfig } from '~/types';
// Methods
import run from '~/methods/public/run';

export default (
  config: MicroservieConfig,
  /**
   * An array of middleware, or a function returning the middleware.
   * Passing as a function can avoid issues with circular dependencies.
   */
  middleware: (() => MicroServieMiddleware[]) | MicroServieMiddleware[]
): Microservie => {
  const instance = {
    run: (context: any) => run(config, context, middleware),
  };

  Object.defineProperty(instance, 'IS_MICROSERVIE', { value: true });

  // @ts-ignore
  return instance;
};
