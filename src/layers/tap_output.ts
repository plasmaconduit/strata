import type { Service } from "../service.ts";
import { Layer } from "../layer.ts";

/**
 * A layer that observes the output of a service at a specific point in the
 * layer pipeline using a provided function.
 *
 * @typeParam Input - The input type of the service.
 * @typeParam Output - The output type of the service.
 */
export class TapOutput<Input, Output>
  extends Layer<Service<Input, Output>, Service<Input, Output>> {
  /**
   * Constructor for capturing the tap function.
   *
   * @param fn - The function that observes the output.
   */
  constructor(
    private readonly fn: (output: Output) => void,
  ) {
    super();
  }

  /**
   * Creates a new instance of TapOutput with the provided tap function.
   *
   * @param fn - The function that observes the output.
   * @returns A new instance of TapOutput.
   */
  public static of<Input, Output>(
    fn: (output: Output) => void,
  ): TapOutput<Input, Output> {
    return new TapOutput(fn);
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
      const output = await inner(input);
      this.fn(output);
      return output;
    };
  }
}
