import { build } from "esbuild";
import { mkdirSync } from "fs";

mkdirSync("api", { recursive: true });

await build({
  entryPoints: ["api/handler.ts"],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: "api/index.js",
  external: [
    // Node.js built-ins
    "fs", "path", "os", "crypto", "stream", "http", "https", "net", "tls",
    "url", "util", "events", "buffer", "querystring", "zlib", "child_process",
    "worker_threads", "cluster", "dns", "dgram", "readline", "repl",
    "string_decoder", "timers", "tty", "v8", "vm", "perf_hooks",
    // Native modules that can't be bundled
    "pg-native",
    "bufferutil",
    "utf-8-validate",
  ],
  banner: {
    js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`.trim(),
  },
});

console.log("API bundle built successfully");
