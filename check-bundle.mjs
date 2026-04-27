import { build } from 'esbuild';
import { mkdirSync } from 'fs';
mkdirSync('api', { recursive: true });
const result = await build({
  entryPoints: ['api/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: '/tmp/bundle-check.js',
  external: ['pg-native', 'bufferutil', 'utf-8-validate'],
  metafile: true,
});
const inputs = Object.entries(result.metafile.inputs)
  .sort((a, b) => b[1].bytes - a[1].bytes)
  .slice(0, 15);
for (const [name, info] of inputs) {
  console.log(`${(info.bytes / 1024 / 1024).toFixed(2)}MB - ${name}`);
}
