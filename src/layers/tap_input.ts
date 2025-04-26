import type { Service } from "../service.ts";
import { Layer } from "../layer.ts";

/**
 * A layer that observes the input of a service at a specific point in the
 * layer pipeline using a provided function.
 *
 * @typeParam Input - The input type of the service.
 * @typeParam Output - The output type of the service.
 */
export class TapInput<Input, Output>
  extends Layer<Service<Input, Output>, Service<Input, Output>> {
  /**
   * Constructor for capturing the tap function.
   *
   * @param fn - The function that observes the input.
   */
  constructor(
    private readonly fn: (input: Input) => void,
  ) {
    super();
  }

  /**
   * Creates a new instance of TapInput with the provided tap function.
   *
   * @param fn - The function that observes the input.
   * @returns A new instance of TapInput.
   */
  public static of<Input, Output>(
    fn: (input: Input) => void,
  ): TapInput<Input, Output> {
    return new TapInput(fn);
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
    return (input: Input) => {
      this.fn(input);
      return inner(input);
    };
  }
}
