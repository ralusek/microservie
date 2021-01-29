import { all } from 'indigobird';

// Types
import { MicroServieMiddleware } from '@/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default function and<IC extends object, MC extends IC>(
  context: IC,
  middlewares: MicroServieMiddleware<IC, MC>[]
): PromiseLike<any> {
  return all(middlewares, (middleware) => executeMiddleware(context, middleware), { concurrency: middlewares.length });
}
