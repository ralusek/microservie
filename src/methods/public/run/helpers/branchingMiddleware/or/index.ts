import { any } from 'indigobird';

// Types
import { MicroServieMiddleware } from '@/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default function or<IC extends object>(context: IC, middlewares: MicroServieMiddleware<IC>[]): PromiseLike<any> {
  return any(middlewares, (middleware) => executeMiddleware(context, middleware), { concurrency: middlewares.length });
}
