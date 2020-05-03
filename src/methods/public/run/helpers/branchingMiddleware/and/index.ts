import bluebird from 'bluebird';

// Types
import { MicroServieMiddleware } from '~/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default (context: any, middlewares: MicroServieMiddleware[]): PromiseLike<any[]> => {
  const totalCount = middlewares.length;
  const resolutions: any[] = [];
  // Keep track explicitly, as resolutions.length isn't reliable due to it being a sparse array
  // having its values set per index directly.
  let resolutionCount = 0;
  let hasErrored = false;

  return new Promise((resolve, reject) => {
    // Would just use bluebird.all, but does not execute simultaneously
    bluebird.map(middlewares, (middleware, i) => {
      return executeMiddleware(context, middleware)
        .then((result) => {
          // Don't both if has errored.
          if (hasErrored) return;

          resolutions[i] = result;
          // Only resolve if all have resolved.
          if (++resolutionCount === totalCount) resolve(resolutions);
        })
        .catch((err) => {
          hasErrored = true;
          reject(err);
        });
    });
  });
};
