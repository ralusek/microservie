import { all } from 'indigobird';

// Types
import { MicroServieMiddleware } from '@/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default (context: any, middlewares: MicroServieMiddleware[]): PromiseLike<any> => {
  return all(middlewares, (middleware) => executeMiddleware(context, middleware), { concurrency: 1 });
};
