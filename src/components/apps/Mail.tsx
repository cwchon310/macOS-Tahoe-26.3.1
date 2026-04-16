import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail as MailIcon, Inbox, Send, Archive, Trash2, Star, Search, RefreshCw, ChevronLeft, User, Paperclip } from 'lucide-react';

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  content: string;
  unread?: boolean;
}

const MOCK_EMAILS: Email[] = [
  { id: '1', from: 'Adriana', subject: 'Weekend Plans', preview: 'Hey! Are we still on for the hike this weekend?', date: '9:41 AM', content: 'Hey! Are we still on for the hike this weekend? The weather looks great and I found a new trail we should try. Let me know if you need a ride!', unread: true },
  { id: '2', from: 'Apple Intelligence', subject: 'Your Genmoji is ready', preview: 'The Genmoji you created in Spotlight is now available in your library.', date: 'Yesterday', content: 'The Genmoji you created in Spotlight is now available in your library. You can use it in Messages, Mail, and other apps. We\'ve also generated a few variations based on your recent activity.', unread: true },
  { id: '3', from: 'GitHub', subject: 'Security Alert', preview: 'A new security vulnerability was found in one of your repositories.', date: 'Tuesday', content: 'A new security vulnerability was found in one of your repositories. Please review the details and take action. We recommend updating your dependencies as soon as possible to mitigate any risks.' },
  { id: '4', from: 'Design Team', subject: 'Tahoe UI Feedback', preview: 'We\'ve reviewed the latest Liquid Glass implementations.', date: 'Monday', content: 'We\'ve reviewed the latest Liquid Glass implementations and the feedback is overwhelmingly positive. The depth and translucency are spot on. Let\'s move forward with the Control Center refinements.' },
];

export const Mail: React.FC = () => {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<Email[]>(MOCK_EMAILS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmails = emails.filter(email => 
    email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleSelectEmail = (id: string) => {
    setSelectedEmailId(id);
    setEmails(prev => prev.map(e => e.id === id ? { ...e, unread: false } : e));
  };

  return (
    <div className="flex h-full w-full text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-48 bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col p-2 gap-1">
        <div className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">Mailboxes</div>
        <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/10 text-white shadow-sm">
          <Inbox size={16} className="text-blue-400" />
          <span className="text-sm font-medium">Inbox</span>
          <span className="ml-auto text-xs text-white/40">4</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <Send size={16} className="text-white/60" />
          <span className="text-sm font-medium">Sent</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <Archive size={16} className="text-white/60" />
          <span className="text-sm font-medium">Archive</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <Trash2 size={16} className="text-white/60" />
          <span className="text-sm font-medium">Trash</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <Star size={16} className="text-white/60" />
          <span className="text-sm font-medium">Flagged</span>
        </button>
      </div>

      {/* List Pane */}
      <div className="w-80 bg-black/10 backdrop-blur-md border-r border-white/10 flex flex-col">
        <div className="p-4 flex flex-col gap-3 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Inbox</h1>
            <button 
              onClick={handleRefresh}
              className={`p-1.5 rounded-full hover:bg-white/10 transition-all ${isLoading ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={16} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" size={14} />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md py-1 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 opacity-40">
              <RefreshCw size={24} className="animate-spin" />
              <span className="text-xs font-medium">Checking for mail...</span>
            </div>
          ) : (
            filteredEmails.length > 0 ? (
              filteredEmails.map((email) => (
                <div 
                  key={email.id}
                  onClick={() => handleSelectEmail(email.id)}
                  className={`p-4 border-b border-white/5 cursor-default transition-all relative ${
                    selectedEmailId === email.id ? 'bg-blue-600/30' : 'hover:bg-white/5'
                  }`}
                >
                  {email.unread && (
                    <div className="absolute left-1.5 top-5 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}
                  <div className="flex justify-between items-start mb-0.5">
                    <span className={`text-sm ${email.unread ? 'font-bold' : 'font-semibold'}`}>{email.from}</span>
                    <span className="text-[10px] text-white/40">{email.date}</span>
                  </div>
                  <div className={`text-xs truncate ${email.unread ? 'text-white font-medium' : 'text-white/80'}`}>{email.subject}</div>
                  <div className="text-[11px] text-white/40 line-clamp-2 mt-1 leading-relaxed">{email.preview}</div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-2 opacity-40">
                <Search size={20} />
                <span className="text-xs font-medium">No results for "{searchQuery}"</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Detail Pane */}
      <div className="flex-1 bg-black/5 backdrop-blur-sm relative overflow-hidden">
        <AnimatePresence mode="wait">
          {selectedEmail ? (
            <motion.div 
              key={selectedEmail.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="h-full flex flex-col"
            >
              {/* Toolbar */}
              <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <Archive size={18} className="text-white/60" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <Trash2 size={18} className="text-white/60" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <Star size={18} className="text-white/60" />
                </button>
                <div className="h-4 w-px bg-white/10 mx-1" />
                <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                  <User size={18} className="text-white/60" />
                </button>
              </div>

              {/* Email Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold shadow-lg">
                      {selectedEmail.from[0]}
                    </div>
                    <div className="flex flex-col">
                      <h2 className="text-2xl font-bold tracking-tight">{selectedEmail.subject}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold">{selectedEmail.from}</span>
                        <span className="text-xs text-white/40">to Me</span>
                        <span className="text-xs text-white/40 ml-2">{selectedEmail.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-base text-white/90 leading-relaxed whitespace-pre-wrap">
                    {selectedEmail.content}
                  </div>

                  {/* Smart Summary */}
                  <div className="mt-12 p-6 rounded-[32px] liquid-glass border border-white/20 shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center">
                          <RefreshCw size={10} className="text-white animate-pulse" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Smart Summary</span>
                      </div>
                      <p className="text-sm font-medium text-white/90 leading-relaxed">
                        {selectedEmail.id === '1' && "Adriana is checking if you're still available for a hike this weekend. She's found a new trail and is offering a ride."}
                        {selectedEmail.id === '2' && "Your custom Genmoji is ready for use across macOS. Several variations have been created based on your style."}
                        {selectedEmail.id === '3' && "GitHub detected a security vulnerability in your code. They recommend an immediate dependency update."}
                        {selectedEmail.id === '4' && "The Design Team approved the Liquid Glass UI implementation and wants to proceed with Control Center refinements."}
                      </p>
                    </div>
                  </div>

                  {/* Mock Attachment */}
                  {selectedEmail.id === '4' && (
                    <div className="mt-12 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Paperclip size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">Tahoe_UI_Specs.pdf</span>
                        <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider">2.4 MB • PDF Document</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20 select-none">
              <MailIcon size={80} strokeWidth={1} />
              <span className="mt-4 text-sm font-medium">No Message Selected</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
