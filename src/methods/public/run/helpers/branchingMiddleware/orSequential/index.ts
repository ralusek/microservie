import { any } from 'indigobird';

// Types
import { MicroServieMiddleware } from '@/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default (context: any, middlewares: MicroServieMiddleware[]): PromiseLike<any> => {
  return any(
    middlewares,
    (middleware) => executeMiddleware(context, middleware),
    { concurrency: 1 }
  );
};
