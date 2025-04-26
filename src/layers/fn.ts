import { Layer } from "../layer.ts";

/**
 * A convenience class that creates a layer from a function.
 *
 * @typeParam Inner - The inner service that this layer will wrap.
 * @typeParam Outer - The resulting service that this layer will produce.
 */
export class FnLayer<Inner, Outer> extends Layer<Inner, Outer> {
  /**
   * Constructor for capturing the function that creates the layer.
   *
   * @param fn - The function that creates the layer.
   */
  constructor(private readonly fn: (service: Inner) => Outer) {
    super();
  }

  /**
   * Creates a new instance of FnLayer with the provided function.
   *
   * @param fn - The function that creates the layer.
   * @returns A new instance of FnLayer.
   */
  public static of<Inner, Outer>(
    fn: (service: Inner) => Outer,
  ): FnLayer<Inner, Outer> {
    return new FnLayer(fn);
  }

  /**
   * Creates a new service by wrapping the given service with this layer.
   *
   * @param inner - The inner service that this layer will wrap.
   * @returns The resulting service that this layer will produce.
   */
  public layer(inner: Inner): Outer {
    return this.fn(inner);
  }
}
