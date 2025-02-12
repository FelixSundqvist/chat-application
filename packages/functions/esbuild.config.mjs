import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node2020",
  minify: true,
  format: "cjs",
  outfile: "lib/index.js",
  sourcemap: true,
  external: [
    "firebase-admin",
    "firebase-functions",
    "sanitize-html",
    "validator",
  ],
});
