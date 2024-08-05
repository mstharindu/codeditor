import React, { useRef } from 'react';
import { build } from '../../bundler';
import { Editor } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { FaPlay, FaIndent } from 'react-icons/fa';
import * as prettier from 'prettier/standalone';
import babel from 'prettier/plugins/babel';
import esTree from 'prettier/plugins/estree';

const commonClasses = {
  button:
    'p-2 flex items-center justify-center border-2 border-slate-900 dark:border-slate-100 dark:text-slate-100',
};

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

  const onClickPrettier = async () => {
    if (!editorRef.current) return;

    const code = editorRef.current.getValue();

    const output = await prettier.format(code, {
      parser: 'babel',
      plugins: [babel, esTree],
      useTabs: false,
      semi: true,
      singleQuote: true,
    });

    editorRef.current.setValue(output);
  };

  return (
    <div className="flex flex-col relative w-1/2 h-full">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue="//Write your code here"
        onMount={handleEditorDidMount}
        theme={darkMode ? 'vs-dark' : 'light'}
        options={{
          wordWrap: 'on',
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
      <div className="absolute right-0 -top-[2.7rem] flex space-x-2">
        <button onClick={onClickPrettier} className={commonClasses.button}>
          <FaIndent />
        </button>
        <button
          onClick={onClickSubmit}
          className={`${commonClasses.button} bg-green-600 border-green-600`}
        >
          <FaPlay />
        </button>
      </div>
    </div>
  );
};
