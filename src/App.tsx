import { useState } from 'react';
import { CodePreview } from './components/code-preview';
import { CodeEditor } from './components/code-editor';
import './app.css';

function App() {
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CodeEditor setCode={setCode} setError={setError} />
        <CodePreview code={code} error={error} />
      </div>
    </div>
  );
}

export default App;
