import type { Service } from "../service.ts";
import { Layer } from "../layer.ts";

/**
 * A layer that maps the input of a service to a different value and or type
 * using a provided function.
 *
 * @typeParam OriginalInput - The original input type of the service.
 * @typeParam MappedInput - The mapped input type of the service.
 * @typeParam Output - The output type of the service.
 */
export class MapInput<OriginalInput, MappedInput, Output>
  extends Layer<Service<MappedInput, Output>, Service<OriginalInput, Output>> {
  /**
   * Constructor for capturing the mapping function.
   *
   * @param fn - The function that maps the original input to the mapped input.
   */
  constructor(
    private readonly fn: (input: OriginalInput) => MappedInput,
  ) {
    super();
  }

  /**
   * Creates a new instance of MapInput with the provided mapping function.
   *
   * @param fn - The function that maps the original input to the mapped input.
   * @returns A new instance of MapInput.
   */
  public static of<OriginalInput, MappedInput, Output>(
    fn: (input: OriginalInput) => MappedInput,
  ): MapInput<OriginalInput, MappedInput, Output> {
    return new MapInput(fn);
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
    return (input: OriginalInput) => {
      const mappedInput = this.fn(input);
      return inner(mappedInput);
    };
  }
}
