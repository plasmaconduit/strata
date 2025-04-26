/**
 * The core composition type for strata services. A layer is a function that
 * takes a service as its input and returns a service as its output.
 *
 * @typeParam Inner - The inner service that this layer will wrap.
 * @typeParam Outer - The resulting service that this layer will produce.
 */
export abstract class Layer<Inner, Outer> {
  /**
   * Creates a new service by wrapping the given service with this layer.
   *
   * @param inner - The inner service that this layer will wrap.
   * @returns The resulting service that this layer will produce.
   */
  abstract layer(inner: Inner): Outer;

  /**
   * Creates a new layer that applies the supplied layer and then this layer.
   *
   * @param next - The next layer to apply.
   * @returns A new layer that composes the supplied layer with this layer.
   */
  public andThen<NewInner>(
    next: Layer<NewInner, Inner>,
  ): Layer<NewInner, Outer> {
    return new AndThenLayer(this, next);
  }
}

/**
 * A layer that applies two layers together in sequence.
 *
 * @typeParam Inner - The inner service that the first layer wraps.
 * @typeParam Outer - The resulting service that this layer will produce.
 * @typeParam NewInner - The service this layer will wrap in both layers
 */
export class AndThenLayer<Inner, Outer, NewInner>
  extends Layer<NewInner, Outer> {
  /**
   * Constructor for capturing the current layer and the next layer to apply.
   *
   * @param current - The current layer to apply.
   * @param next - The next layer to apply.
   */
  constructor(
    private readonly current: Layer<Inner, Outer>,
    private readonly next: Layer<NewInner, Inner>,
  ) {
    super();
  }

  /**
   * Creates a new service by wrapping the given service with this layer.
   *
   * @param inner - The inner service that this layer will wrap.
   * @returns The resulting service that this layer will produce.
   */
  public layer(inner: NewInner): Outer {
    return this.current.layer(this.next.layer(inner));
  }
}
