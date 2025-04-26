import { Layer } from "../layer.ts";
import { Service } from "../service.ts";

export class MapError<Input, Output>
  extends Layer<Service<Input, Output>, Service<Input, Output>> {
  constructor(
    private readonly fn: (error: unknown) => unknown,
  ) {
    super();
  }

  public static of<Input, Output>(
    fn: (error: unknown) => unknown,
  ): MapError<Input, Output> {
    return new MapError(fn);
  }

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
