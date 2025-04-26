import { Layer } from "../layer.ts";
import { Service } from "../service.ts";

export class TapOutput<Input, Output>
  extends Layer<Service<Input, Output>, Service<Input, Output>> {
  constructor(
    private readonly fn: (output: Output) => void,
  ) {
    super();
  }

  public static of<Input, Output>(
    fn: (output: Output) => void,
  ): TapOutput<Input, Output> {
    return new TapOutput(fn);
  }

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
