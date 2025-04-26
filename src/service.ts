export type Service<Input, Output> = (input: Input) => Promise<Output>;
