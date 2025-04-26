import { Service } from "../service.ts";
import { Layer } from "../layer.ts";

export class FlatMapInput<OriginalInput, MappedInput, Output>
  extends Layer<Service<MappedInput, Output>, Service<OriginalInput, Output>> {
  constructor(
    private readonly fn: (input: OriginalInput) => Promise<MappedInput>,
  ) {
    super();
  }

  public static of<OriginalInput, MappedInput, Output>(
    fn: (input: OriginalInput) => Promise<MappedInput>,
  ): FlatMapInput<OriginalInput, MappedInput, Output> {
    return new FlatMapInput(fn);
  }

  public layer(
    inner: Service<MappedInput, Output>,
  ): Service<OriginalInput, Output> {
    return async (input: OriginalInput) => {
      const mappedInput = await this.fn(input);
      return inner(mappedInput);
    };
  }
}
