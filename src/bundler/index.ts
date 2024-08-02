import * as esbuild from 'esbuild-wasm';
import { pathPlugin } from './plugins/path-plugin';
import { loadPackagePlugin } from './plugins/load-package-plugin';

let initialized = false;

export const initializeBuilder = async () => {
  await esbuild.initialize({
    worker: true,
    wasmURL: 'https://unpkg.com/esbuild-wasm@0.23.0/esbuild.wasm',
  });

  initialized = true;
};

export const build = async (input: string) => {
  if (!initialized) {
    await initializeBuilder();
  }

  const result = await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [pathPlugin(), loadPackagePlugin(input)],
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
  });

  return result.outputFiles[0].text;
};
