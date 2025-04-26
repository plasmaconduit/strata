import assert from "node:assert";
import { FnLayer } from "./layers/fn.ts";
import { Service } from "./service.ts";
import { Layer } from "./layer.ts";

Deno.test("simple layer application", async () => {
  // given ...
  type StringToStringService = Service<string, string>;
  type ALlCapsLayer = Layer<StringToStringService, StringToStringService>;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const allCapsLayer: ALlCapsLayer = FnLayer.of(
    (inner) => async (input: string) => {
      const result = await inner(input);
      return result.toUpperCase();
    },
  );
  const toUpperHelloService = allCapsLayer.layer(helloService);

  // when ...
  const result = await toUpperHelloService("world");

  // then ...
  assert.equal(result, "HELLO, WORLD");
});

Deno.test("simple layer composition", async () => {
  // given ...
  type StringToStringService = Service<string, string>;
  type StringInStringOutLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const allCapsLayer: StringInStringOutLayer = FnLayer.of(
    (inner) => async (input: string) => {
      const result = await inner(input);
      return result.toUpperCase();
    },
  );

  const exclamationLayer: StringInStringOutLayer = FnLayer.of(
    (inner) => async (input: string) => {
      const result = await inner(input);
      return `${result}!!!`;
    },
  );

  const toUpperThenToLowerHelloService = allCapsLayer
    .andThen(exclamationLayer)
    .layer(helloService);

  // when ...
  const result = await toUpperThenToLowerHelloService("world");

  // then ...
  assert.equal(result, "HELLO, WORLD!!!");
});

Deno.test("layer application with different types", async () => {
  // given ...
  type SplitAndDisplayLayer = Layer<
    Service<string[], number>,
    Service<string, string>
  >;

  const arrayLengthService = (input: string[]) => Promise.resolve(input.length);
  const splitAndDisplayLayer: SplitAndDisplayLayer = FnLayer.of(
    (inner) => async (input: string) => {
      const result = await inner(input.split(""));
      return `string length: ${result}`;
    },
  );

  // string -> string[]
  //             ↓
  // string <- number
  const stringLengthAsStringService = splitAndDisplayLayer.layer(
    arrayLengthService,
  );

  // when ...
  const result = await stringLengthAsStringService("Hello, world!");

  // then ...
  assert.equal(result, "string length: 13");
});

Deno.test("layer composition with different types", async () => {
  // given ...
  type SplitAndDisplayLayer = Layer<
    Service<string[], number>,
    Service<string, string>
  >;
  type CharCodeAndHashLayer = Layer<
    Service<number[], string>,
    Service<string[], number>
  >;

  const splitAndDisplayLayer: SplitAndDisplayLayer = FnLayer.of(
    (inner) => async (input: string) => {
      const result = await inner(input.split(""));
      return `to upper hash: ${result}`;
    },
  );
  const charCodeAndHashLayer: CharCodeAndHashLayer = FnLayer.of(
    (inner) => async (input: string[]) => {
      const result = await inner(input.map((s) => s.charCodeAt(0)));
      return result.split("").map((s) => s.charCodeAt(0)).reduce(
        (a, b) => a + b,
        0,
      );
    },
  );

  const charCodesToUpperService = (input: number[]) =>
    Promise.resolve(
      input.map((c) => String.fromCharCode(c).toUpperCase()).join(""),
    );

  // string -> string[] -> number[]
  //                         ↓
  // string <- number <-  string
  const stringToUpperHashedString = splitAndDisplayLayer
    .andThen(charCodeAndHashLayer)
    .layer(charCodesToUpperService);

  // when ...
  const result = await stringToUpperHashedString("Hello, world!");

  // then ...
  assert.equal(result, "to upper hash: 873");
});
