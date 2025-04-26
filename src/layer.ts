export abstract class Layer<Inner, Outer> {
  abstract layer(inner: Inner): Outer;

  public andThen<NewInner>(
    next: Layer<NewInner, Inner>,
  ): Layer<NewInner, Outer> {
    return new AndThenLayer(this, next);
  }
}

export class AndThenLayer<Inner, Outer, NewInner>
  extends Layer<NewInner, Outer> {
  constructor(
    private readonly current: Layer<Inner, Outer>,
    private readonly next: Layer<NewInner, Inner>,
  ) {
    super();
  }

  public layer(inner: NewInner): Outer {
    return this.current.layer(this.next.layer(inner));
  }
}
