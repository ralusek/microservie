import { any } from 'indigobird';

// Types
import { MicroservieContext, MicroservieMiddleware } from '@/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default function or(context: MicroservieContext, middlewares: MicroservieMiddleware[]): PromiseLike<any> {
  return any(middlewares, (middleware) => executeMiddleware(context, middleware), { concurrency: middlewares.length });
}
