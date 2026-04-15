import React, { useState } from 'react';
import { Save, FileText, Search, Settings, Share } from 'lucide-react';

interface TextEditProps {
  initialContent?: string;
  fileName?: string;
}

export const TextEdit: React.FC<TextEditProps> = ({ initialContent = '', fileName = 'Untitled.txt' }) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white overflow-hidden rounded-b-xl">
      {/* Toolbar */}
      <div className="h-10 border-b border-black/20 flex items-center px-4 gap-4 bg-[#252525] shrink-0">
        <div className="flex items-center gap-2 mr-4">
          <FileText size={16} className="text-blue-400" />
          <span className="text-[13px] font-semibold truncate max-w-[150px]">{fileName}</span>
        </div>
        
        <div className="flex items-center gap-3 text-white/50">
          <button className="hover:text-white transition-colors p-1 rounded hover:bg-white/5">
            <Save size={16} />
          </button>
          <button className="hover:text-white transition-colors p-1 rounded hover:bg-white/5">
            <Search size={16} />
          </button>
          <button className="hover:text-white transition-colors p-1 rounded hover:bg-white/5">
            <Share size={16} />
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-1" />
          <button className="hover:text-white transition-colors p-1 rounded hover:bg-white/5">
            <Settings size={16} />
          </button>
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
          onChange={(e) => setContent(e.target.value)}
          spellCheck={false}
          className="flex-1 bg-transparent p-4 outline-none resize-none text-[13px] font-mono leading-6 text-white/90 selection:bg-blue-500/30 custom-scrollbar"
        />
      </div>

      {/* Status Bar */}
      <div className="h-6 border-t border-black/20 bg-[#252525] flex items-center px-4 justify-between text-[10px] text-white/40 font-medium shrink-0">
        <div className="flex gap-4">
          <span>Characters: {content.length}</span>
          <span>Lines: {content.split('\n').length}</span>
        </div>
        <div>UTF-8</div>
      </div>
    </div>
  );
};
