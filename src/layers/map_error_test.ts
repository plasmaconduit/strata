import assert from "node:assert";
import { MapError } from "./map_error.ts";
import { Layer } from "../layer.ts";

Deno.test("map an error", async () => {
  // given ...
  type StringToStringService = (input: string) => Promise<string>;
  type StringToStringLayer = Layer<
    StringToStringService,
    StringToStringService
  >;

  const failingService = (_input: string) =>
    Promise.reject(new Error("Service error"));

  const mapErrorLayer: StringToStringLayer = MapError.of((error) => {
    return error instanceof Error
      ? new Error(`Mapped error: ${error.message}`)
      : new Error("Mapped error: Unknown error");
  });

  const mappedErrorService = mapErrorLayer.layer(failingService);

  // when ...
  const result = mappedErrorService("world");

  // then ...
  await result
    .then(() => {
      throw new Error("Expected to throw, but did not");
    })
    .catch((error) => {
      if (error instanceof Error) {
        assert.equal(error.message, "Mapped error: Service error");
      } else {
        throw new Error("Expected an instance of Error");
      }
    });
});
