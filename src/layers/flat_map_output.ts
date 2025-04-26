import type { Service } from "../service.ts";
import { Layer } from "../layer.ts";

/**
 * A layer that asynchronously maps the output of a service to a different
 * value and or type using a provided function.
 *
 * @typeParam OriginalOutput - The original output type of the service.
 * @typeParam MappedOutput - The mapped output type of the service.
 * @typeParam Input - The input type of the service.
 */
export class FlatMapOutput<OriginalOutput, MappedOutput, Input> extends Layer<
  Service<Input, OriginalOutput>,
  Service<Input, MappedOutput>
> {
  /**
   * Constructor for capturing the mapping function.
   *
   * @param fn - The function that maps the original output to the mapped output.
   */
  constructor(
    private readonly fn: (output: OriginalOutput) => Promise<MappedOutput>,
  ) {
    super();
  }

  /**
   * Creates a new instance of FlatMapOutput with the provided mapping function.
   *
   * @param fn - The function that maps the original output to the mapped output.
   * @returns A new instance of FlatMapOutput.
   */
  public static of<OriginalOutput, MappedOutput, Input>(
    fn: (output: OriginalOutput) => Promise<MappedOutput>,
  ): FlatMapOutput<OriginalOutput, MappedOutput, Input> {
    return new FlatMapOutput(fn);
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
    return async (input: Input) => {
      const output = await inner(input);
      return this.fn(output);
    };
  }
}
