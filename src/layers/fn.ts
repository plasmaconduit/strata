import { Layer } from "../layer.ts";

export class FnLayer<Inner, Outer> extends Layer<Inner, Outer> {
  constructor(private readonly fn: (service: Inner) => Outer) {
    super();
  }

  public static of<Inner, Outer>(
    fn: (service: Inner) => Outer,
  ): FnLayer<Inner, Outer> {
    return new FnLayer(fn);
  }

  public layer(inner: Inner): Outer {
    return this.fn(inner);
  }
}
