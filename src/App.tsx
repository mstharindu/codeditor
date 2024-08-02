import { useState } from 'react';
import { CodePreview } from './components/code-preview';
import { CodeEditor } from './components/code-editor';
import './app.css';

function App() {
  const [code, setCode] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CodeEditor setCode={setCode} />
      <CodePreview code={code} />
    </div>
  );
}

export default App;
