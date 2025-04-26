import { Layer } from "../layer.ts";
import { Service } from "../service.ts";

export class MapInput<OriginalInput, MappedInput, Output>
  extends Layer<Service<MappedInput, Output>, Service<OriginalInput, Output>> {
  constructor(
    private readonly fn: (input: OriginalInput) => MappedInput,
  ) {
    super();
  }

  public static of<OriginalInput, MappedInput, Output>(
    fn: (input: OriginalInput) => MappedInput,
  ): MapInput<OriginalInput, MappedInput, Output> {
    return new MapInput(fn);
  }

  public layer(
    inner: Service<MappedInput, Output>,
  ): Service<OriginalInput, Output> {
    return (input: OriginalInput) => {
      const mappedInput = this.fn(input);
      return inner(mappedInput);
    };
  }
}
