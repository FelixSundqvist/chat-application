import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  outfile: "lib/index.js",
  bundle: true,
  minify: true,
  platform: "node",
  target: "node2020",
  external: [
    "firebase-admin",
    "firebase-functions",
    "sanitize-html",
    "validator",
  ],
});
