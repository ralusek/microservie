// Types
import { MicroservieMiddleware, MicroservieConfig, MicroservieContext, AvailableContext } from '@/types';

// Helpers
import executeMiddleware from './helpers/executeMiddleware';

// Utils
import isFunction from '@/utils/isFunction';

async function run<T extends AvailableContext>(
  config: MicroservieConfig,
  context: T,
  middleware: (() => MicroservieMiddleware[]) | MicroservieMiddleware[]
): Promise<MicroservieContext> {
  // We get the middleware if it is behind a getter function.
  // This is allowed due to the getter function being an option
  // for the user avoiding circular dependencies when setting up
  // the necessary middleware in their application.
  const retrievedMiddleware = isFunction(middleware) ? middleware() : middleware;

  const newContext = context as MicroservieContext;
  // @ts-ignore
  newContext.metrics = context.metrics || {};
  // @ts-ignore
  newContext.namedResults = context.namedResults || {};
  // @ts-ignore
  newContext.results = newContext.results = [];
  if (config.name)
    context.metrics[config.name] = {
      startedAt: Date.now(),
    } as MicroservieContext['metrics'][keyof MicroservieContext['metrics']];

  const result = await executeMiddleware(newContext, retrievedMiddleware);
  if (config.name) {
    context.metrics[config.name].finishedAt = Date.now();
    context.namedResults[config.name] = result;
  }

  return newContext;
}

export default run;
