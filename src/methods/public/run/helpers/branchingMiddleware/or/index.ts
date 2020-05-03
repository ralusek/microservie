import bluebird from 'bluebird';

// Types
import { MicroServieMiddleware } from '~/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default (context: any, middlewares: MicroServieMiddleware[]): PromiseLike<any> => {
  const totalCount = middlewares.length;
  const errors: Error[] = [];
  let firstError: Error;
  let hasResolved = false;

  return new Promise((resolve, reject) => {
    bluebird.map(middlewares, (middleware) => {
      return executeMiddleware(context, middleware)
        .then((result) => {
          // If one has already resolved, will not bother with these subsequent successes.
          if (hasResolved) return;
          hasResolved = true;
          resolve(result);
        })
        .catch((err) => {
          // If one has already resolved, will not bother with errors.
          if (hasResolved) return;
          if (!firstError) {
            firstError = err;
            // @ts-ignore
            firstError.microservieErrors = errors;
          }
          errors.push(err);

          // We only reject if ALL of the middleware has been rejected.
          if (errors.length === totalCount) return reject(firstError);
        });
    });
  });
};
