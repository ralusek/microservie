import bluebird from 'bluebird';

// Types
import { MicroServieMiddleware } from '@/types';

// Helpers
import executeMiddleware from '../../executeMiddleware';

export default (context: any, middlewares: MicroServieMiddleware[]): PromiseLike<any[]> => {
  return bluebird.mapSeries(middlewares, (middleware) => {
    return executeMiddleware(context, middleware);
  });
};
