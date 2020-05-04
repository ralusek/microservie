import indigobird from 'indigobird';

// Types
import { MicroServieMiddleware } from '@/types';

// Utils
import isFunction from '@/utils/isFunction';
import isMicroservie from '@/utils/isMicroservie';

// Branching
import or from '../branchingMiddleware/or';
import orSequential from '../branchingMiddleware/orSequential';
import and from '../branchingMiddleware/and';
import andSequential from '../branchingMiddleware/andSequential';

async function executeMiddleware<IC extends object>(
  context: IC,
  middlewares: MicroServieMiddleware<IC> | MicroServieMiddleware<IC>[]
) {
  const asArray = Array.isArray(middlewares) ? middlewares : [middlewares];
  return indigobird.all(
    asArray,
    (middleware) => {
      if (isFunction(middleware)) return middleware(context);
      if (isMicroservie<IC>(middleware)) return middleware.run(context);
      if (middleware.$or) return or(context, middleware.$or);
      if (middleware.$orSequential) return orSequential(context, middleware.$orSequential);
      if (middleware.$and) return and(context, middleware.$and);
      if (middleware.$andSequential) return andSequential(context, middleware.$andSequential);

      return Promise.reject(new Error('Microservie cannot execute middleware, unexpected format provided.'));
    },
    { concurrency: 1 }
  );
}

export default executeMiddleware;
