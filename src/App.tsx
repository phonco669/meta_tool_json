import React, { useState, useCallback } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { 
  Copy, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Braces,
  HelpCircle
} from 'lucide-react';
import { MainLayout } from './components/MainLayout';
import { TextEditor } from './components/TextEditor';
import { HelpModal } from './components/HelpModal';
import { parseTextToJson } from './utils/textParser';
import { formatJsonToText } from './utils/jsonFormatter';
import { parseMarkdownToJson, formatJsonToMarkdown } from './utils/markdownParser';
import { ValidationResult } from './types';

const DEFAULT_TEXT = `# 示例配置 (Example)
project: MetaTool
version: 1.0.0
user:
  name: Alice
  roles:
    - admin
    - editor
settings:
  theme: dark
  retries: 3`;

function App() {
  const [editorMode, setEditorMode] = useState<'yaml' | 'markdown'>('yaml');
  const [text, setText] = useState(DEFAULT_TEXT);
  const [json, setJson] = useState(() => {
    const { data } = parseTextToJson(DEFAULT_TEXT);
    return data ? JSON.stringify(data, null, 2) : '';
  });
  const [error, setError] = useState<ValidationResult | null>(null);
  const [lastEdited, setLastEdited] = useState<'text' | 'json'>('text');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleTextChange = useCallback((value: string | undefined) => {
    const newVal = value || '';
    setText(newVal);
    setLastEdited('text');
    
    if (!newVal.trim()) {
      setJson('');
      setError(null);
      return;
    }

    const { data, error } = editorMode === 'markdown' 
      ? parseMarkdownToJson(newVal)
      : parseTextToJson(newVal);

    if (error) {
      setError(error);
    } else {
      setError(null);
      try {
        const jsonStr = JSON.stringify(data, null, 2);
        setJson(jsonStr);
      } catch (e) {
        console.error(e);
      }
    }
  }, [editorMode]);

  const handleJsonChange = useCallback((value: string | undefined) => {
    const newVal = value || '';
    setJson(newVal);
    setLastEdited('json');

    if (!newVal.trim()) {
      setText('');
      setError(null);
      return;
    }
    
    try {
      const parsed = JSON.parse(newVal);
      setError(null);
      const textStr = editorMode === 'markdown'
        ? formatJsonToMarkdown(parsed)
        : formatJsonToText(parsed);
      setText(textStr);
    } catch (e: any) {
      setError({
        isValid: false,
        message: e.message,
        line: 0, 
        column: 0
      });
    }
  }, [editorMode]);

  const toggleEditorMode = (mode: 'yaml' | 'markdown') => {
    if (mode === editorMode) return;
    setEditorMode(mode);
    
    // Convert current text to new format via JSON
    if (json) {
      try {
        const parsed = JSON.parse(json);
        const newText = mode === 'markdown' 
          ? formatJsonToMarkdown(parsed)
          : formatJsonToText(parsed);
        setText(newText);
      } catch (e) {
        console.error('Failed to convert text format:', e);
      }
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // 可以添加一个 Toast 提示，这里简化处理
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearAll = () => {
    setText('');
    setJson('');
    setError(null);
  };

  return (
    <MainLayout
      header={
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Braces className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-gray-800 text-lg">JSON Meta Tool</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHelpOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
              title="查看示例"
            >
              <HelpCircle className="w-4 h-4" />
              <span>示例</span>
            </button>
            <button
              onClick={() => copyToClipboard(text)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="复制文本"
            >
              <Copy className="w-4 h-4" />
              <span>复制文本</span>
            </button>
            <button
              onClick={() => copyToClipboard(json)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              title="复制 JSON"
            >
              <Copy className="w-4 h-4" />
              <span>复制 JSON</span>
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>清空</span>
            </button>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between h-6">
          <div className="flex items-center gap-2">
            {error ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                <span className="text-red-600 font-medium">
                  错误: {error.message} {error.line ? `(第 ${error.line} 行)` : ''}
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                <span className="text-green-600 font-medium">校验通过</span>
              </>
            )}
          </div>
          <div className="text-gray-400">
            {lastEdited === 'text' ? '正在编辑: 结构化文本' : '正在编辑: JSON'}
          </div>
        </div>
      }
    >
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col">
            <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">结构化文本</span>
              </div>
              <div className="flex bg-gray-200 rounded p-0.5">
                <button
                  onClick={() => toggleEditorMode('yaml')}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                    editorMode === 'yaml' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  YAML
                </button>
                <button
                  onClick={() => toggleEditorMode('markdown')}
                  className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                    editorMode === 'markdown' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  MD
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <TextEditor
                value={text}
                onChange={handleTextChange}
                language={editorMode}
              />
            </div>
          </div>
        </Panel>
        
        <PanelResizeHandle className="w-1 bg-gray-200 hover:bg-blue-400 transition-colors cursor-col-resize" />
        
        <Panel defaultSize={50} minSize={20}>
          <div className="h-full flex flex-col">
            <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-3 gap-2">
              <Braces className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">JSON 输出</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <TextEditor
                value={json}
                onChange={handleJsonChange}
                language="json"
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </MainLayout>
  );
}

export default App;
