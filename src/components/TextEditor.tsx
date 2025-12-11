import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface TextEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
}

export const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, language = 'yaml', readOnly = false }) => {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      fontFamily: 'Consolas, "Courier New", monospace',
      wordWrap: 'on',
      tabSize: 2,
      renderWhitespace: 'selection',
    });
  };

  return (
    <div className="h-full w-full border-r border-gray-200">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={onChange}
        onMount={handleEditorDidMount}
        theme="light"
        options={{
          readOnly,
          automaticLayout: true,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};
