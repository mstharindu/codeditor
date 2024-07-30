import * as esbuild from 'esbuild-wasm';

export const pathPlugin = (input: string) => {
  return {
    name: 'path-plugin',
    setup(build: esbuild.PluginBuild) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResole', args);

        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          const urlObj = new URL(
            args.path,
            `https://unpkg.com${args.resolveDir}/`
          );
          console.log('RESOLVE DIR::::', urlObj.href);

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: input,
          };
        }

        const response = await fetch(args.path);

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const text = await response.text();

        //const json = await response.json();
        return {
          loader: 'jsx',
          contents: text,
          resolveDir: `${new URL('./', response.url).pathname}`,
        };
      });
    },
  };
};
