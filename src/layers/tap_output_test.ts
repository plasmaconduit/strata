import assert from "node:assert";
import { Layer } from "../layer.ts";
import { TapOutput } from "./tap_output.ts";

Deno.test("tap the output and log it", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const logs: string[] = [];
  const log = (message: string) => Promise.resolve(logs.push(message));

  const tapOutputLayer: StringToStringLayer = TapOutput.of((output) => {
    log(`Output: ${output}`);
  });

  const tappedOutputService = tapOutputLayer.layer(helloService);

  // when ...
  const result = await tappedOutputService("world");

  // then ...
  assert.equal(logs[0], "Output: Hello, world");
  assert.equal(result, "Hello, world");
});
