export type MicroservieConfig = {
  /**
   * The name of this microservie middleware.
   * If provided, will be used to add metrics to the context.
   */
  name?: string;
};

export type Microservie<T extends AvailableContext> = {
  /**
   *
   */
  run: (context: T) => Promise<MicroservieContext>;

  /**
   * Indicates whether or not is a microservie.
   * Better than checking type against contructor,
   * as differing versions wouldn't be the same.
   */
  readonly IS_MICROSERVIE: true;
};

export type AvailableContext = Omit<Record<string, any>, 'metrics' | 'namedResults' | 'results'>;

export type MicroservieContext = AvailableContext & {
  /**
   * Metrics, keyed by microservie name, if provided.
   */
  readonly metrics: {
    [key in string]: {
      /**
       * When the microservie began execution.
       */
      startedAt: number;
      /**
       * When the microservie completed execution.
       */
      finishedAt: number;
    };
  };
  /**
   * Results, keyed by microservie name, if provided.
   * TODO consider making this set to a generic value of the microservie.
   */
  readonly namedResults: {
    [key in string]: any;
  };
  readonly results: any[];
};

export type MicroservieMiddlewareFn<> = (context: MicroservieContext) => void;

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
      $or: MicroservieMiddleware[];
      $and?: never;
      $orSequential?: never;
      $andSequential?: never;
    }
  | {
      $or?: never;
      /**
       * The provided middleware will be executed simultaneously.
       * Will error if ANY middleware error.
       * Will not resolve until ALL middleware resolves.
       */
      $and: MicroservieMiddleware[];
      $orSequential?: never;
      $andSequential?: never;
    }
  | {
      $or?: never;
      $and?: never;
      /**
       * The provided middleware will be executed sequentially.
       * Will only error if ALL middleware error.
       * Will resolve as soon as ONE middleware resolves.
       */
      $orSequential: MicroservieMiddleware[];
      $andSequential?: never;
    }
  | {
      $or?: never;
      $and?: never;
      $orSequential?: never;
      /**
       * The provided middleware will be executed sequentially.
       * Will error if ANY middleware error.
       * Will not resolve until ALL middleware resolves.
       */
      $andSequential: MicroservieMiddleware[];
    };

export type MicroservieMiddleware =
  | MicroservieMiddlewareFn
  | MicroservieBranchingMiddleware
  | Microservie<AvailableContext>;

export type MicroservieCatchWrap = (
  middleware: MicroservieMiddleware,
  errorHandler: (err: any) => any
) => MicroservieMiddleware;
