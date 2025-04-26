import assert from "node:assert";
import { Layer } from "../layer.ts";
import { TapInput } from "./tap_input.ts";

Deno.test("tap the input and log it", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const logs: string[] = [];
  const log = (message: string) => Promise.resolve(logs.push(message));

  const tapInputLayer: StringToStringLayer = TapInput.of((input) => {
    log(`Input: ${input}`);
  });

  const tappedInputService = tapInputLayer.layer(helloService);

  // when ...
  const result = await tappedInputService("world");

  // then ...
  assert.equal(logs[0], "Input: world");
  assert.equal(result, "Hello, world");
});
