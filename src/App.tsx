import { useEffect, useState } from 'react';
import * as esbuild from 'esbuild-wasm';
import './App.css';
import { pathPlugin } from './plugins/pathPlugin';

let initialized = false;

function App() {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    const initialize = async () => {
      if (initialized) return;
      initialized = true;

      await esbuild.initialize({
        worker: true,
        wasmURL: '/esbuild.wasm',
      });
    };

    initialize();

    return () => {
      esbuild.stop();
    };
  }, []);

  const onClickSubmit = async () => {
    try {
      // const transformed = await esbuild.transform(input, {
      //   loader: 'jsx',
      //   target: 'es2015',
      // });

      const result = await esbuild.build({
        entryPoints: ['index.js'],
        bundle: true,
        write: false,
        plugins: [pathPlugin(input)],
      });

      setCode(result.outputFiles[0].text);
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
        <h2>Compiled code</h2>
        <pre
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: '300px',
            width: '800px',
          }}
        >
          {code}
        </pre>
      </div>
    </div>
  );
}

export default App;
