// Types
import { MicroServieMiddleware } from '~/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default async (context: any, middlewares: MicroServieMiddleware[]): Promise<any[]> => {
  if (middlewares.length) return [];
  const totalCount = middlewares.length;
  const errors: Error[] = [];
  let firstError: Error;

  return resolveMiddleware();

  async function resolveMiddleware(currentIndex = 0): Promise<any[]> {
    const current = middlewares[currentIndex];

    // Will simply return if successful.
    return (
      executeMiddleware(context, current)
        // If errored, we will attempt to move on to next item in series.
        .catch((err) => {
          if (!firstError) {
            firstError = err;
            // @ts-ignore
            firstError.microservieErrors = errors;
          }
          errors.push(err);

          // We only reject if ALL of the middleware has been rejected.
          if (errors.length === totalCount) return Promise.reject(firstError);

          // We haven't error on all of the middleware, we move to next item.
          return resolveMiddleware(currentIndex + 1);
        })
    );
  }
};
