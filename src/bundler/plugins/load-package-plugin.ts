import localforage from 'localforage';
import * as esbuild from 'esbuild-wasm';

const packageCache = localforage.createInstance({
  name: 'packageCache',
});

const fetchPackage = async (
  path: string
): Promise<{ packageContent: string; responseUrl: string }> => {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }

  const packageContent = await response.text();

  return { packageContent, responseUrl: response.url };
};

export const loadPackagePlugin = (input: string) => {
  return {
    name: 'load-package-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: input,
        };
      });
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const packageContent = await packageCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        if (packageContent) {
          return packageContent;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: esbuild.OnLoadArgs) => {
        const { packageContent, responseUrl } = await fetchPackage(args.path);

        const escapedContent = packageContent
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const packagePayload: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: `const styleTag = document.createElement('style');
        styleTag.innerText = '${escapedContent}';
        document.head.appendChild(styleTag);`,
          resolveDir: `${new URL('./', responseUrl).pathname}`,
        };

        await packageCache.setItem(args.path, packagePayload);

        //const json = await response.json();
        return packagePayload;
      });

      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const { packageContent, responseUrl } = await fetchPackage(args.path);

        const packagePayload: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: packageContent,
          resolveDir: `${new URL('./', responseUrl).pathname}`,
        };

        await packageCache.setItem(args.path, packagePayload);

        //const json = await response.json();
        return packagePayload;
      });
    },
  };
};
