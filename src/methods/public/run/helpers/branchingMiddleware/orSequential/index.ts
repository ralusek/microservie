import { any } from 'indigobird';

// Types
import { MicroServieMiddleware } from '@/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default function orSequential<IC extends object, MC extends IC>(
  context: IC,
  middlewares: MicroServieMiddleware<IC, MC>[]
): PromiseLike<any> {
  return any(middlewares, (middleware) => executeMiddleware(context, middleware), { concurrency: 1 });
}
