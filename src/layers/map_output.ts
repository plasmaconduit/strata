import { Layer } from "../layer.ts";
import { Service } from "../service.ts";

export class MapOutput<OriginalOutput, MappedOutput, Input> extends Layer<
  Service<Input, OriginalOutput>,
  Service<Input, MappedOutput>
> {
  constructor(
    private readonly fn: (output: OriginalOutput) => MappedOutput,
  ) {
    super();
  }

  public static of<OriginalOutput, MappedOutput, Input>(
    fn: (output: OriginalOutput) => MappedOutput,
  ): MapOutput<OriginalOutput, MappedOutput, Input> {
    return new MapOutput(fn);
  }

  public layer(
    inner: Service<Input, OriginalOutput>,
  ): Service<Input, MappedOutput> {
    return async (input: Input) => {
      const output = await inner(input);
      return this.fn(output);
    };
  }
}
