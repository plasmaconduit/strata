import assert from "node:assert";
import { MapOutput } from "./map_output.ts";
import { Layer } from "../layer.ts";

Deno.test("map an output", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const mapOutputLayer: StringToStringLayer = MapOutput.of((output) =>
    output.toUpperCase()
  );

  const mappedOutputService = mapOutputLayer.layer(helloService);

  // when ...
  const result = await mappedOutputService("world");

  // then ...
  assert.equal(result, "HELLO, WORLD");
});
