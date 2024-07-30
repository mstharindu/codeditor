import * as esbuild from 'esbuild-wasm';
import localforage from 'localforage';

const packageCache = localforage.createInstance({
  name: 'packageCache',
});

export const pathPlugin = (input: string) => {
  return {
    name: 'path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        console.log('onResole', args);

        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          const urlObj = new URL(
            args.path,
            `https://unpkg.com${args.resolveDir}/`
          );

          return {
            path: urlObj.href,
            namespace: 'a',
          };
        }

        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: 'a',
        };
      });

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
