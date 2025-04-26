# Strata

Strata is a library that provides a small set of standard interfaces for
building network-based clients and servers.

## Examples

Full example found here:
[examples/deno-fetch-wrapper/src/index.ts](examples/deno-fetch-wrapper/src/index.ts)

```typescript
// Compose together a client that has a defined fallback on error, caches previously
// seen requests, and collapses multiple requests for the same resource into a single
// request.
const define = fallbackOnError<string, string>("Error loading definition")
  .andThen(cache())
  .andThen(collapse())
  .layer(callApi);

// Race multiple requests to the same resource. Only one of them will be
// executed due to the collapse layer. The first one to finish will be used as the
// definition.
Promise.race([define("strata"), define("strata"), define("strata")]).then(
  (definition) => {
    console.log("Definition of strata:", definition);
  },
);
```
