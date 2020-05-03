// Types
import { MicroServieMiddleware, MicroservieConfig, MicroservieContext } from '~/types';

// Helpers
import executeMiddleware from './helpers/executeMiddleware';

// Utils
import isFunction from '~/utils/isFunction';

const run = async (
  config: MicroservieConfig,
  context: any = {},
  middleware: (() => MicroServieMiddleware[]) | MicroServieMiddleware[]
): Promise<MicroservieContext> => {
  // We get the middleware if it is behind a getter function.
  // This is allowed due to the getter function being an option
  // for the user avoiding circular dependencies when setting up
  // the necessary middleware in their application.
  const retrievedMiddleware = isFunction(middleware) ? middleware() : middleware;

  context.metrics = context.metrics || {};
  context.namedResults = context.namedResults || {};
  context.results = context.results = [];
  if (config.name)
    context.metrics[config.name] = {
      startedAt: Date.now(),
    };

  const result = await executeMiddleware(context, retrievedMiddleware);
  if (config.name) {
    context.metrics[config.name].finishedAt = Date.now();
    context.namedResults[config.name] = result;
  }

  return context;
};

export default run;
