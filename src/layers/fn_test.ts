import assert from "node:assert";
import { Layer } from "../layer.ts";
import { FnLayer } from "./fn.ts";

Deno.test("fn layer to manipulate input and output", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const upperCaseAndExclamationLayer: StringToStringLayer = FnLayer.of(
    (inner) => async (input: string) => {
      const result = await inner(`${input}!!!`);
      return result.toUpperCase();
    },
  );

  const upperCaseAndExclamationService = upperCaseAndExclamationLayer.layer(
    helloService,
  );

  // when ...
  const result = await upperCaseAndExclamationService("world");

  // then ...
  assert.equal(result, "HELLO, WORLD!!!");
});
