export type MicroservieConfig = {
  /**
   * The name of this microservie middleware.
   * If provided, will be used to add metrics to the context.
   */
  name?: string;
};

export type Microservie = {
  /**
   *
   */
  run: (context: any) => PromiseLike<any>;

  /**
   * Indicates whether or not is a microservie.
   * Better than checking type against contructor,
   * as differing versions wouldn't be the same.
   */
  readonly IS_MICROSERVIE: true;
};

export type MicroservieContext = {
  /**
   * Metrics, keyed by microservie name, if provided.
   */
  metrics: {
    [key in string]: {
      /**
       * When the microservie began execution.
       */
      startedAt: string;
      /**
       * When the microservie completed execution.
       */
      finishedAt: string;
    };
  };
  /**
   * Results, keyed by microservie name, if provided.
   * TODO consider making this set to a generic value of the microservie.
   */
  namedResults: {
    [key in string]: any;
  };
  results: any[];
};

export type MicroservieMiddlewareFn = (context: any) => void;

type MicroservieBranchingMiddlewareMap = {};

/**
 * References map type, but only allows for one property to be present at a time.
 * This is what the actual interface is meant to be.
 */
export type MicroservieBranchingMiddleware =
  | {
      /**
       * The provided middleware will be executed simultaneously.
       * Will only error if ALL middlware error.
       * Will resolve as soon as ONE middleware resolves.
       */
      $or: MicroServieMiddleware[];
      $and: never;
      $orSequential: never;
      $andSequential: never;
    }
  | {
      $or: never;
      /**
       * The provided middleware will be executed simultaneously.
       * Will error if ANY middleware error.
       * Will not resolve until ALL middleware resolves.
       */
      $and: MicroServieMiddleware[];
      $orSequential: never;
      $andSequential: never;
    }
  | {
      $or: never;
      $and: never;
      /**
       * The provided middleware will be executed sequentially.
       * Will only error if ALL middleware error.
       * Will resolve as soon as ONE middleware resolves.
       */
      $orSequential: MicroServieMiddleware[];
      $andSequential: never;
    }
  | {
      $or: never;
      $and: never;
      $orSequential: never;
      /**
       * The provided middleware will be executed sequentially.
       * Will error if ANY middleware error.
       * Will not resolve until ALL middleware resolves.
       */
      $andSequential: MicroServieMiddleware[];
    };

export type MicroServieMiddleware = MicroservieMiddlewareFn | MicroservieBranchingMiddleware | Microservie;
