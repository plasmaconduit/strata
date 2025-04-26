import assert from "node:assert";
import { FlatMapInput } from "./flat_map_input.ts";
import { Layer } from "../layer.ts";

Deno.test("asynchronously manipulates the input", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const asyncUpperCaseInput: StringToStringLayer = FlatMapInput.of(
    async (input: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      return input.toUpperCase();
    },
  );

  const asyncUpperCaseService = asyncUpperCaseInput.layer(helloService);

  // when ...
  const result = await asyncUpperCaseService("world");

  // then ...
  assert.equal(result, "Hello, WORLD");
});

Deno.test("fails while asynchronously manipulating the input", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const asyncUpperCaseInput: StringToStringLayer = FlatMapInput.of(
    async (_input: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      throw new Error("Error while manipulating input");
    },
  );

  const asyncUpperCaseService = asyncUpperCaseInput.layer(helloService);

  // when ...
  const result = asyncUpperCaseService("world");

  // then ...
  await result
    .then(() => {
      throw new Error("Expected to throw, but did not");
    })
    .catch((error) => {
      assert.equal(error.message, "Error while manipulating input");
    });
});
