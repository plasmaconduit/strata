import { Layer } from "../layer.ts";
import { Service } from "../service.ts";

export class TapInput<Input, Output>
  extends Layer<Service<Input, Output>, Service<Input, Output>> {
  constructor(
    private readonly fn: (input: Input) => void,
  ) {
    super();
  }

  public static of<Input, Output>(
    fn: (input: Input) => void,
  ): TapInput<Input, Output> {
    return new TapInput(fn);
  }

  public layer(
    inner: Service<Input, Output>,
  ): Service<Input, Output> {
    return (input: Input) => {
      this.fn(input);
      return inner(input);
    };
  }
}
