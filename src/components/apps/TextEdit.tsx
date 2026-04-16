import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FileText, Search, Undo2, Redo2, FileDown, Settings2, Share, Plus, Type, List } from 'lucide-react';

interface TextEditProps {
  initialContent?: string;
  fileName?: string;
}

export const TextEdit: React.FC<TextEditProps> = ({ initialContent = '', fileName = 'Untitled.txt' }) => {
  const [content, setContent] = useState(initialContent);
  const [history, setHistory] = useState<string[]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isInternalChange = useRef(false);

  const updateContent = useCallback((newContent: string) => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newContent);
    
    // Limit history size to 100
    if (newHistory.length > 100) {
      newHistory.shift();
    } else {
      setHistoryIndex(newHistory.length - 1);
    }
    
    setHistory(newHistory);
    setContent(newContent);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isInternalChange.current = true;
      const prevContent = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setContent(prevContent);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isInternalChange.current = true;
      const nextContent = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setContent(nextContent);
    }
  }, [history, historyIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white overflow-hidden rounded-b-xl">
      {/* Toolbar */}
      <div className="h-12 border-b border-black/30 flex items-center px-4 gap-2 bg-[#2d2d2d] shrink-0">
        <div className="flex items-center gap-2 mr-6">
          <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <FileText size={18} className="text-blue-400" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold leading-tight truncate max-w-[120px]">{fileName}</span>
            <span className="text-[10px] text-white/30 leading-tight">Edited</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 mr-2">
            <button 
              onClick={undo}
              disabled={historyIndex === 0}
              className={`p-1.5 rounded-md transition-all ${historyIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
              title="Undo (Cmd+Z)"
            >
              <Undo2 size={15} />
            </button>
            <button 
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              className={`p-1.5 rounded-md transition-all ${historyIndex === history.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10 text-white/70 hover:text-white'}`}
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo2 size={15} />
            </button>
          </div>

          <div className="h-6 w-[1px] bg-white/10 mx-1" />

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all" title="New Document">
              <Plus size={16} />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all" title="Save / Export">
              <FileDown size={16} />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all" title="Find (Cmd+F)">
              <Search size={16} />
            </button>
          </div>

          <div className="h-6 w-[1px] bg-white/10 mx-1" />

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all" title="Format Settings">
              <Type size={16} />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all" title="List Styles">
              <List size={16} />
            </button>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all" title="Share">
              <Share size={16} />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-all" title="Settings">
              <Settings2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative overflow-hidden flex">
        {/* Line Numbers */}
        <div className="w-12 bg-[#1a1a1a] border-r border-white/5 flex flex-col items-end py-4 pr-3 text-[11px] font-mono text-white/20 select-none leading-6">
          {content.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        
        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => updateContent(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent p-6 outline-none resize-none text-[14px] font-mono leading-7 text-white/90 selection:bg-blue-500/40 custom-scrollbar"
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 border-t border-black/20 bg-[#252525] flex items-center px-4 justify-between text-[10px] text-white/40 font-medium shrink-0">
        <div className="flex gap-4">
          <span>{content.length} characters</span>
          <span>{content.split('\n').length} lines</span>
        </div>
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span>Plain Text</span>
        </div>
      </div>
    </div>
  );
};
