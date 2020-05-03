import bluebird from 'bluebird';

// Types
import { MicroServieMiddleware } from '~/types';

// Utils
import isFunction from '~/utils/isFunction';
import isMicroservie from '~/utils/isMicroservie';

// Branching
import or from '../branchingMiddleware/or';
import orSequential from '../branchingMiddleware/orSequential';
import and from '../branchingMiddleware/and';
import andSequential from '../branchingMiddleware/andSequential';

async function executeMiddleware(context: any, middlewares: MicroServieMiddleware | MicroServieMiddleware[]) {
  const asArray = Array.isArray(middlewares) ? middlewares : [middlewares];
  return bluebird.mapSeries(asArray, (middleware) => {
    if (isFunction(middleware)) return middleware(context);
    if (isMicroservie(middleware)) return middleware.run(context);
    if (middleware.$or) return or(context, middleware.$or);
    if (middleware.$orSequential) return orSequential(context, middleware.$orSequential);
    if (middleware.$and) return and(context, middleware.$and);
    if (middleware.$andSequential) return andSequential(context, middleware.$andSequential);

    return Promise.reject(new Error('Microservie cannot execute middleware, unexpected format provided.'));
  });
}

export default executeMiddleware;
