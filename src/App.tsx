import { useEffect, useRef, useState } from 'react';
import * as esbuild from 'esbuild-wasm';
import './App.css';
import { pathPlugin } from './plugins/path-plugin';
import { loadPackagePlugin } from './plugins/load-package-plugin';

let initialized = false;

const iframeHTML = `<html>
	<body>
		<div id="root"></div>
		<script>
			window.addEventListener('message', (event) => {
        try{
          eval(event.data)
        }catch(e){
          document.body.innerHTML = '<pre style="color: red">'+e+'</pre>'
          console.error(e)
        }			
			})
		</script>
	</body>
</html>`;

function App() {
  const [input, setInput] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const initialize = async () => {
      if (initialized) return;
      initialized = true;

      await esbuild.initialize({
        worker: true,
        wasmURL: 'https://unpkg.com/esbuild-wasm@0.23.0/esbuild.wasm',
      });
    };

    initialize();

    return () => {
      esbuild.stop();
    };
  }, []);

  const onClickSubmit = async () => {
    try {
      if (iframeRef?.current) {
        iframeRef.current.srcdoc = iframeHTML;
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

      if (iframeRef?.current?.contentWindow) {
        //iframeRef.current.srcdoc = iframeHTML;
        iframeRef.current.contentWindow.postMessage(
          result.outputFiles[0].text,
          '*'
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        height: '100vh',
      }}
    >
      <textarea
        style={{ width: '800px', height: '200px' }}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <button onClick={onClickSubmit}>Submit</button>
      <div>
        <iframe
          title="Preview"
          ref={iframeRef}
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: '300px',
            width: '800px',
          }}
          sandbox="allow-scripts"
          srcDoc={iframeHTML}
        ></iframe>
      </div>
    </div>
  );
}

export default App;
