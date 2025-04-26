import assert from "node:assert";
import { Layer } from "../layer.ts";
import { FlatMapOutput } from "./flat_map_output.ts";

Deno.test("asynchronously manipulate the output", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const asyncUpperCaseOutput: StringToStringLayer = FlatMapOutput.of(
    async (output: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      return output.toUpperCase();
    },
  );

  const asyncUpperCaseService = asyncUpperCaseOutput.layer(helloService);

  // when ...
  const result = await asyncUpperCaseService("world");

  // then ...
  assert.equal(result, "HELLO, WORLD");
});

Deno.test("fails while asynchronously manipulating the output", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const asyncUpperCaseOutput: StringToStringLayer = FlatMapOutput.of(
    async (_output: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      throw new Error("Error while manipulating output");
    },
  );

  const asyncUpperCaseService = asyncUpperCaseOutput.layer(helloService);

  // when ...
  const result = asyncUpperCaseService("world");

  // then ...
  await result
    .then(() => {
      throw new Error("Expected to throw, but did not");
    })
    .catch((error) => {
      assert.equal(error.message, "Error while manipulating output");
    });
});
