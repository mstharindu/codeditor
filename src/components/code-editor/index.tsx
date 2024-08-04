import React, { useRef } from 'react';
import { build } from '../../bundler';
import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor';

interface CodeEditorProps {
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  setCode,
  setError,
}) => {
  //const [input, setInput] = useState('');

  const editorRef = useRef<editor.ICodeEditor | null>(null);

  const handleEditorDidMount = (editor: editor.ICodeEditor) => {
    editorRef.current = editor;
  };

  const getValue = () => {
    if (editorRef.current) return editorRef.current.getValue();

    return '';
  };

  const onClickSubmit = async () => {
    setCode('');
    setError('');

    try {
      const input = getValue();
      const code = await build(input);
      setCode(code);
    } catch (e: unknown) {
      if (typeof e === 'string') {
        setError(e);
      } else if (e instanceof Error) {
        setError(e.message);
      }
    }
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
      <Editor
        height="100vh"
        defaultLanguage="javascript"
        defaultValue="//Write your code here"
        onMount={handleEditorDidMount}
      />
      <button
        onClick={onClickSubmit}
        style={{ position: 'absolute', right: 0, bottom: '0.5rem' }}
      >
        Submit
      </button>
    </div>
  );
};
