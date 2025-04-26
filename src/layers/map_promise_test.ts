import assert from "node:assert";
import { Layer } from "../layer.ts";
import { MapPromise } from "./map_promise.ts";

Deno.test("map a promise to manipulate the output", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const helloService = (input: string) => Promise.resolve(`Hello, ${input}`);

  const mapPromiseLayer: StringToStringLayer = MapPromise.of(
    async (promise) => {
      const result = await promise;
      return result.toUpperCase();
    },
  );

  const mappedPromiseService = mapPromiseLayer.layer(helloService);

  // when ...
  const result = await mappedPromiseService("world");

  // then ...
  assert.equal(result, "HELLO, WORLD");
});

Deno.test("map a failing promise to transform the error", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const failingService = (_input: string) =>
    Promise.reject(new Error("service failure"));

  const mapPromiseLayer: StringToStringLayer = MapPromise.of(
    async (promise) => {
      try {
        return await promise;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Transformed error: ${error.message}`);
        } else {
          throw new Error("Transformed error: Unknown error");
        }
      }
    },
  );

  const mappedPromiseService = mapPromiseLayer.layer(failingService);

  // when ...
  const result = mappedPromiseService("world");

  // then ...
  await result
    .then(() => {
      throw new Error("Expected to throw, but did not");
    })
    .catch((error) => {
      assert.equal(error.message, "Transformed error: service failure");
    });
});

Deno.test("map a failing promise to a successful promise", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const failingService = (_input: string) =>
    Promise.reject(new Error("service failure"));

  const mapPromiseLayer: StringToStringLayer = MapPromise.of(
    async (promise) => {
      try {
        return await promise;
      } catch (error) {
        if (error instanceof Error) {
          return `Recovered from error: ${error.message}`;
        } else {
          throw new Error("Transformed error: Unknown error");
        }
      }
    },
  );

  const mappedPromiseService = mapPromiseLayer.layer(failingService);

  // when ...
  const result = await mappedPromiseService("world");

  // then ...
  assert.equal(result, "Recovered from error: service failure");
});
