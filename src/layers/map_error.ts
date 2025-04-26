import type { Service } from "../service.ts";
import { Layer } from "../layer.ts";

/**
 * A layer that maps the error of a service to a different value and or type
 * using a provided function.
 *
 * @typeParam Input - The input type of the service.
 * @typeParam Output - The output type of the service.
 */
export class MapError<Input, Output>
  extends Layer<Service<Input, Output>, Service<Input, Output>> {
  /**
   * Constructor for capturing the mapping function.
   *
   * @param fn - The function that maps the error to a different value.
   */
  constructor(
    private readonly fn: (error: unknown) => unknown,
  ) {
    super();
  }

  /**
   * Creates a new instance of MapError with the provided mapping function.
   *
   * @param fn - The function that maps the error to a different value.
   * @returns A new instance of MapError.
   */
  public static of<Input, Output>(
    fn: (error: unknown) => unknown,
  ): MapError<Input, Output> {
    return new MapError(fn);
  }

  /**
   * Creates a new service by wrapping the given service with this layer.
   *
   * @param inner - The inner service that this layer will wrap.
   * @returns The resulting service that this layer will produce.
   */
  public layer(
    inner: Service<Input, Output>,
  ): Service<Input, Output> {
    return async (input: Input) => {
      try {
        return await inner(input);
      } catch (error) {
        throw this.fn(error);
      }
    };
  }
}
