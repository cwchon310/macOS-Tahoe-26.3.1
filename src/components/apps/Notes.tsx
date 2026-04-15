import React, { useState, useEffect } from 'react';
import { SquarePen, Trash2, Search, Folder, Undo, Redo } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  history: string[];
  historyIndex: number;
}

export const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', title: 'Welcome to Notes', content: 'This is a high-fidelity macOS clone. You can create and edit notes here.', date: '10:10 AM', history: ['This is a high-fidelity macOS clone. You can create and edit notes here.'], historyIndex: 0 },
    { id: '2', title: 'Shopping List', content: 'Milk\nEggs\nBread\nApples', date: 'Yesterday', history: ['Milk\nEggs\nBread\nApples'], historyIndex: 0 },
  ]);
  const [activeNoteId, setActiveNoteId] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState('');

  const activeNote = notes.find(n => n.id === activeNoteId);

  const updateNote = (content: string) => {
    const title = content.split('\n')[0] || 'New Note';
    setNotes(prev => prev.map(n => {
      if (n.id === activeNoteId) {
        const newHistory = [...n.history.slice(0, n.historyIndex + 1), content];
        if (newHistory.length > 50) newHistory.shift(); // Limit history
        
        return { 
          ...n, 
          content, 
          title, 
          date: 'Just now',
          history: newHistory,
          historyIndex: newHistory.length - 1
        };
      }
      return n;
    }));
  };

  const undo = () => {
    if (!activeNote || activeNote.historyIndex <= 0) return;
    const newIndex = activeNote.historyIndex - 1;
    const content = activeNote.history[newIndex];
    const title = content.split('\n')[0] || 'New Note';
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, content, title, historyIndex: newIndex } : n));
  };

  const redo = () => {
    if (!activeNote || activeNote.historyIndex >= activeNote.history.length - 1) return;
    const newIndex = activeNote.historyIndex + 1;
    const content = activeNote.history[newIndex];
    const title = content.split('\n')[0] || 'New Note';
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, content, title, historyIndex: newIndex } : n));
  };

  const addNote = () => {
    const newNote = { 
      id: Date.now().toString(), 
      title: 'New Note', 
      content: '', 
      date: 'Just now', 
      history: [''], 
      historyIndex: 0 
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = () => {
    if (!activeNoteId) return;
    const newNotes = notes.filter(n => n.id !== activeNoteId);
    setNotes(newNotes);
    if (newNotes.length > 0) {
      setActiveNoteId(newNotes[0].id);
    } else {
      setActiveNoteId('');
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[#1e1e1e]/95 text-white overflow-hidden rounded-b-xl backdrop-blur-2xl">
      {/* Sidebar - Folders */}
      <div className="w-48 bg-white/5 border-r border-black/20 flex flex-col pt-12 shrink-0">
        <div className="px-3 mb-2 text-[11px] font-semibold text-white/40 uppercase tracking-wider">iCloud</div>
        <div className="flex items-center gap-2 px-3 py-1.5 mx-2 rounded-md bg-white/10 text-[13px] font-medium cursor-default">
          <Folder size={14} className="text-yellow-500 fill-yellow-500" />
          <span>Notes</span>
        </div>
      </div>

      {/* Sidebar - Notes List */}
      <div className="w-64 bg-white/5 border-r border-black/20 flex flex-col shrink-0">
        <div className="h-[52px] border-b border-black/20 flex items-center px-4 justify-between shrink-0">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1.5 text-white/40" />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-md pl-8 pr-3 py-1 text-[12px] outline-none focus:border-yellow-500/50 transition-all placeholder:text-white/40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.map(note => (
            <div 
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`p-3 rounded-lg cursor-default transition-colors ${
                activeNoteId === note.id ? 'bg-yellow-500 text-black' : 'hover:bg-white/10 text-white'
              }`}
            >
              <div className="font-bold text-[13px] truncate mb-1">{note.title || 'New Note'}</div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className={activeNoteId === note.id ? 'text-black/70 font-medium' : 'text-white/40'}>{note.date}</span>
                <span className={`truncate ${activeNoteId === note.id ? 'text-black/60' : 'text-white/40'}`}>
                  {note.content.substring(note.title.length).trim().substring(0, 20) || 'No additional text'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
        <div className="h-[52px] border-b border-black/20 flex items-center px-4 justify-end shrink-0 gap-4">
          <div className="flex items-center gap-2 mr-auto">
             <span className="text-xs text-white/40">Last edited: {activeNote?.date}</span>
          </div>
          <Undo size={16} className={`cursor-pointer transition-colors ${activeNote && activeNote.historyIndex > 0 ? 'text-white/80 hover:text-white' : 'text-white/20'}`} onClick={undo} />
          <Redo size={16} className={`cursor-pointer transition-colors ${activeNote && activeNote.historyIndex < activeNote.history.length - 1 ? 'text-white/80 hover:text-white' : 'text-white/20'}`} onClick={redo} />
          <Trash2 size={16} className="text-white/40 hover:text-white cursor-pointer transition-colors" onClick={deleteNote} />
          <SquarePen size={18} className="text-white/40 hover:text-white cursor-pointer transition-colors" onClick={addNote} />
        </div>
        {activeNote ? (
          <textarea
            value={activeNote.content}
            onChange={(e) => updateNote(e.target.value)}
            className="flex-1 bg-transparent p-8 outline-none resize-none font-sans text-[15px] leading-relaxed text-white/90 placeholder:text-white/20"
            placeholder="Start typing..."
            autoFocus
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-white/20 text-sm">
            Select or create a note
          </div>
        )}
      </div>
    </div>
  );
};
