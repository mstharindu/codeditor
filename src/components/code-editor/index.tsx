import React, { useRef } from 'react';
import { build } from '../../bundler';
import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { FaPlay } from 'react-icons/fa';

interface CodeEditorProps {
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  darkMode: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  setCode,
  setError,
  darkMode,
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
    <div className="flex flex-col relative w-1/2 h-full">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="//Write your code here"
        onMount={handleEditorDidMount}
        theme={darkMode ? 'vs-dark' : 'light'}
      />
      <div className="absolute right-0 -top-[2.8rem]">
        <button
          onClick={onClickSubmit}
          className="bg-green-600 p-3 rounded-full flex items-center justify-center"
        >
          <FaPlay />
        </button>
      </div>
    </div>
  );
};
