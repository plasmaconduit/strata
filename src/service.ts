/**
 * The core type for strata services. Simply a function that takes an input
 * and returns a promise of an output.
 */
export type Service<Input, Output> = (input: Input) => Promise<Output>;
