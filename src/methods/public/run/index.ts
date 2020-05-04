// Types
import { MicroServieMiddleware, MicroservieConfig, MicroservieContext } from '@/types';

// Helpers
import executeMiddleware from './helpers/executeMiddleware';

// Utils
import isFunction from '@/utils/isFunction';

async function run<IC extends object>(
  config: MicroservieConfig,
  context: IC,
  middleware: (() => MicroServieMiddleware<IC>[]) | MicroServieMiddleware<IC>[]
): Promise<MicroservieContext<IC>> {
  // We get the middleware if it is behind a getter function.
  // This is allowed due to the getter function being an option
  // for the user avoiding circular dependencies when setting up
  // the necessary middleware in their application.
  const retrievedMiddleware = isFunction(middleware) ? middleware() : middleware;

  const newContext: MicroservieContext<IC> = context as MicroservieContext<IC>;

  newContext.metrics = newContext.metrics || {};
  newContext.namedResults = newContext.namedResults || {};
  newContext.results = newContext.results = [];
  if (config.name)
    newContext.metrics[config.name] = {
      startedAt: Date.now(),
    } as MicroservieContext<IC>['metrics'][keyof MicroservieContext<IC>['metrics']];

  const result = await executeMiddleware(context, retrievedMiddleware);
  if (config.name) {
    newContext.metrics[config.name].finishedAt = Date.now();
    newContext.namedResults[config.name] = result;
  }

  return newContext;
}

export default run;
