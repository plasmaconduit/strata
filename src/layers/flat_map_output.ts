import { Layer } from "../layer.ts";
import { Service } from "../service.ts";

export class FlatMapOutput<OriginalOutput, MappedOutput, Input> extends Layer<
  Service<Input, OriginalOutput>,
  Service<Input, MappedOutput>
> {
  constructor(
    private readonly fn: (output: OriginalOutput) => Promise<MappedOutput>,
  ) {
    super();
  }

  public static of<OriginalOutput, MappedOutput, Input>(
    fn: (output: OriginalOutput) => Promise<MappedOutput>,
  ): FlatMapOutput<OriginalOutput, MappedOutput, Input> {
    return new FlatMapOutput(fn);
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
