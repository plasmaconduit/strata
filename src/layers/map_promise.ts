import { Layer } from "../layer.ts";
import { Service } from "../service.ts";

export class MapPromise<OriginalOutput, MappedOutput, Input> extends Layer<
  Service<Input, OriginalOutput>,
  Service<Input, MappedOutput>
> {
  constructor(
    private readonly fn: (
      output: Promise<OriginalOutput>,
    ) => Promise<MappedOutput>,
  ) {
    super();
  }

  public static of<OriginalOutput, MappedOutput, Input>(
    fn: (output: Promise<OriginalOutput>) => Promise<MappedOutput>,
  ): MapPromise<OriginalOutput, MappedOutput, Input> {
    return new MapPromise(fn);
  }

  public layer(
    inner: Service<Input, OriginalOutput>,
  ): Service<Input, MappedOutput> {
    return (input: Input) => {
      const promise = inner(input);
      return this.fn(promise);
    };
  }
}
