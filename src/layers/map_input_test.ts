import assert from "node:assert";
import { MapInput } from "./map_input.ts";
import { Layer } from "../layer.ts";

Deno.test("map an input", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const mapInputLayer: StringToStringLayer = MapInput.of((input) =>
    `${input}!!!`
  );

  const mappedInputService = mapInputLayer.layer(helloService);

  // when ...
  const result = await mappedInputService("world");

  // then ...
  assert.equal(result, "Hello, world!!!");
});
