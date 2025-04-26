import { FnLayer, Service } from "@plasmaconduit/strata";

const cache = <I, O>() =>
  FnLayer
    .of<Service<I, O>, Service<I, O>>((inner) => {
      const storage = new Map<I, O>();
      return async (input: I) => {
        if (storage.has(input)) {
          return storage.get(input)!;
        }
        const result = await inner(input);
        storage.set(input, result);
        return result;
      };
    });

const collapse = <I, O>() =>
  FnLayer
    .of<Service<I, O>, Service<I, O>>((inner) => {
      const inFlight = new Map<I, Promise<O>>();
      return async (input: I) => {
        if (inFlight.has(input)) {
          return inFlight.get(input)!;
        }
        const result = inner(input);
        inFlight.set(input, result);
        try {
          return await result;
        } finally {
          inFlight.delete(input);
        }
      };
    });

const fallbackOnError = <I, O>(fallback: O) =>
  FnLayer
    .of<Service<I, O>, Service<I, O>>((inner) => {
      return async (input: I) => {
        try {
          return await inner(input);
        } catch (_e) {
          return fallback;
        }
      };
    });

const callApi = async (word: string): Promise<string> => {
  const definition = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
  );
  if (!definition.ok) {
    throw new Error(`Failed to fetch definition for ${word}`);
  }
  // deno-lint-ignore no-explicit-any
  const data: any = await definition.json();
  return data[0].meanings[0].definitions[0].definition;
};

const define = fallbackOnError<string, string>("Error loading definition")
  .andThen(cache())
  .andThen(collapse())
  .layer(callApi);

Promise.race([define("strata"), define("strata"), define("strata")]).then(
  (definition) => {
    console.log("Definition of strata:", definition);
  },
);
