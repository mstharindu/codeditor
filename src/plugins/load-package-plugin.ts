import localforage from 'localforage';
import * as esbuild from 'esbuild-wasm';

const packageCache = localforage.createInstance({
  name: 'packageCache',
});

export const loadPackagePlugin = (input: string) => {
  return {
    name: 'load-package-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: input,
          };
        }

        const packageContent = await packageCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (packageContent) {
          return packageContent;
        }

        const response = await fetch(args.path);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const text = await response.text();

        const packagePayload: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: text,
          resolveDir: `${new URL('./', response.url).pathname}`,
        };

        await packageCache.setItem(args.path, packagePayload);

        //const json = await response.json();
        return packagePayload;
      });
    },
  };
};
