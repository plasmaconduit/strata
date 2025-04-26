import type { Service } from "../service.ts";
import { Layer } from "../layer.ts";

/**
 * A layer that maps the promise produced by a service to a different
 * promise using a provided function.
 *
 * @typeParam OriginalOutput - The original output type of the service.
 * @typeParam MappedOutput - The mapped output type of the service.
 * @typeParam Input - The input type of the service.
 */
export class MapPromise<OriginalOutput, MappedOutput, Input> extends Layer<
  Service<Input, OriginalOutput>,
  Service<Input, MappedOutput>
> {
  /**
   * Constructor for capturing the mapping function.
   *
   * @param fn - The function that maps the original output to the mapped output.
   */
  constructor(
    private readonly fn: (
      output: Promise<OriginalOutput>,
    ) => Promise<MappedOutput>,
  ) {
    super();
  }

  /**
   * Creates a new instance of MapPromise with the provided mapping function.
   *
   * @param fn - The function that maps the original output to the mapped output.
   * @returns A new instance of MapPromise.
   */
  public static of<OriginalOutput, MappedOutput, Input>(
    fn: (output: Promise<OriginalOutput>) => Promise<MappedOutput>,
  ): MapPromise<OriginalOutput, MappedOutput, Input> {
    return new MapPromise(fn);
  }

  /**
   * Creates a new service by wrapping the given service with this layer.
   *
   * @param inner - The inner service that this layer will wrap.
   * @returns The resulting service that this layer will produce.
   */
  public layer(
    inner: Service<Input, OriginalOutput>,
  ): Service<Input, MappedOutput> {
    return (input: Input) => {
      const promise = inner(input);
      return this.fn(promise);
    };
  }
}
