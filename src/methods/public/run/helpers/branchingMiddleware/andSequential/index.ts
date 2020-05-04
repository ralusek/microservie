import { all } from 'indigobird';

// Types
import { MicroServieMiddleware } from '@/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default function andSequential<IC extends object>(
  context: IC,
  middlewares: MicroServieMiddleware<IC>[]
): PromiseLike<any> {
  return all(middlewares, (middleware) => executeMiddleware(context, middleware), { concurrency: 1 });
}
