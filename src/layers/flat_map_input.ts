import type { Service } from "../service.ts";
import { Layer } from "../layer.ts";

/**
 * A layer that asynchronously maps the input of a service to a different
 * value and or type using a provided function.
 *
 * @typeParam OriginalInput - The original input type of the service.
 * @typeParam MappedInput - The mapped input type of the service.
 * @typeParam Output - The output type of the service.
 */
export class FlatMapInput<OriginalInput, MappedInput, Output>
  extends Layer<Service<MappedInput, Output>, Service<OriginalInput, Output>> {
  /**
   * Constructor for capturing the mapping function.
   *
   * @param fn - The function that maps the original input to the mapped input.
   */
  constructor(
    private readonly fn: (input: OriginalInput) => Promise<MappedInput>,
  ) {
    super();
  }

  /**
   * Creates a new instance of FlatMapInput with the provided mapping function.
   *
   * @param fn - The function that maps the original input to the mapped input.
   * @returns A new instance of FlatMapInput.
   */
  public static of<OriginalInput, MappedInput, Output>(
    fn: (input: OriginalInput) => Promise<MappedInput>,
  ): FlatMapInput<OriginalInput, MappedInput, Output> {
    return new FlatMapInput(fn);
  }

  /**
   * Creates a new service by wrapping the given service with this layer.
   *
   * @param inner - The inner service that this layer will wrap.
   * @returns The resulting service that this layer will produce.
   */
  public layer(
    inner: Service<MappedInput, Output>,
  ): Service<OriginalInput, Output> {
    return async (input: OriginalInput) => {
      const mappedInput = await this.fn(input);
      return inner(mappedInput);
    };
  }
}
