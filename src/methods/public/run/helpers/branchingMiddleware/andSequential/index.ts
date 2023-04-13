import { all } from 'indigobird';

// Types
import { MicroservieContext, MicroservieMiddleware } from '@/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default function andSequential(
  context: MicroservieContext,
  middlewares: MicroservieMiddleware[]
): PromiseLike<any> {
  return all(middlewares, (middleware) => executeMiddleware(context, middleware), { concurrency: 1 });
}
