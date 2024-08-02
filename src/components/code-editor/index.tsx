import React, { useState } from 'react';
import { build } from '../../bundler';

interface CodeEditorProps {
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ setCode }) => {
  const [input, setInput] = useState('');

  const onClickSubmit = async () => {
    const code = await build(input);
    setCode(code);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '50%',
      }}
    >
      <textarea
        style={{ height: '100vh' }}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <button
        onClick={onClickSubmit}
        style={{ position: 'absolute', right: 0, bottom: '0.5rem' }}
      >
        Submit
      </button>
    </div>
  );
};
