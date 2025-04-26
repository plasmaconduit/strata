import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: {
      test: "dev"
    }
  },
  package: {
    name: "@plasmaconduit/strata",
    version: Deno.args[0],
    description:
      "Strata is a library that provides a small set of standard interfaces for building network-based clients and servers.",
    private: false,
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/plasmaconduit/strata.git",
    },
    bugs: {
      url: "https://github.com/plasmaconduit/strata/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
