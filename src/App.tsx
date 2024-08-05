import { useState } from 'react';
import { CodePreview } from './components/code-preview';
import { CodeEditor } from './components/code-editor';
import './app.css';
import { Toolbar } from './components/toolbar';

function App() {
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <div className="bg-stone-100 dark:bg-stone-900">
      <Toolbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <div
        className="flex justify-center items-center"
        style={{ height: 'calc(100vh - 48px)' }}
      >
        <CodeEditor setCode={setCode} setError={setError} darkMode={darkMode} />
        <CodePreview code={code} error={error} />
      </div>
    </div>
  );
}

export default App;
