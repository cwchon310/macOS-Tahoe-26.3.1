import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Smile, Image as ImageIcon, FileText, Video, Phone, MessageSquare, Users, Compass, Settings as SettingsIcon } from 'lucide-react';

const CONTACTS = [
  { id: 1, name: 'File Transfer', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FT', lastMsg: '[File]', time: '14:20' },
  { id: 2, name: 'Mom', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mom', lastMsg: 'Did you eat?', time: '12:05' },
  { id: 3, name: 'Project Group', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PG', lastMsg: 'Zhang: Let\'s meet at 3', time: 'Yesterday' },
  { id: 4, name: 'WeChat Pay', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WP', lastMsg: 'Payment successful', time: 'Monday' },
];

export const WeChat: React.FC = () => {
  const [activeContact, setActiveContact] = useState(CONTACTS[0]);
  const [selectedTab, setSelectedTab] = useState('chats');
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-full bg-[#f5f5f5] text-black overflow-hidden font-sans">
      {/* Sidebar - Icons */}
      <div className="w-16 bg-[#2e2e2e] flex flex-col items-center pt-12 pb-6 gap-6">
        <div className="w-10 h-10 rounded-md overflow-hidden mb-4 cursor-default">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Avatar" />
        </div>
        <div 
          onClick={() => setSelectedTab('chats')}
          className={`${selectedTab === 'chats' ? 'text-green-500' : 'text-gray-400'} hover:text-white cursor-pointer transition-colors`}
        >
          <MessageSquare size={24} />
        </div>
        <div 
          onClick={() => setSelectedTab('contacts')}
          className={`${selectedTab === 'contacts' ? 'text-green-500' : 'text-gray-400'} hover:text-white cursor-pointer transition-colors`}
        >
          <Users size={24} />
        </div>
        <div 
          onClick={() => setSelectedTab('discover')}
          className={`${selectedTab === 'discover' ? 'text-green-500' : 'text-gray-400'} hover:text-white cursor-pointer transition-colors`}
        >
          <Compass size={24} />
        </div>
        <div className="mt-auto flex flex-col gap-6 items-center">
          <div className="text-gray-400 hover:text-white cursor-pointer transition-colors"><SettingsIcon size={22} /></div>
          <div className="text-gray-400 hover:text-white cursor-pointer transition-colors"><MoreHorizontal size={22} /></div>
        </div>
      </div>

      {/* Contact List */}
      <div className="w-64 bg-[#e6e6e6] border-r border-gray-300 flex flex-col">
        <div className="p-4 flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2 top-2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-[#d9d9d9] rounded px-7 py-1 text-xs outline-none"
            />
          </div>
          <button className="bg-[#d9d9d9] p-1 rounded hover:bg-gray-300 transition-colors">
            <Plus size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {CONTACTS.map(contact => (
            <div 
              key={contact.id}
              onClick={() => setActiveContact(contact)}
              className={`flex items-center gap-3 p-3 cursor-default transition-colors ${
                activeContact.id === contact.id ? 'bg-[#c9c9c9]' : 'hover:bg-[#dadada]'
              }`}
            >
              <img src={contact.avatar} className="w-10 h-10 rounded" alt={contact.name} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate">{contact.name}</span>
                  <span className="text-[10px] text-gray-500">{contact.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{contact.lastMsg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f5f5f5]">
        <div className="h-14 border-b border-gray-300 flex items-center justify-between px-6">
          <span className="font-medium">{activeContact.name}</span>
          <MoreHorizontal size={20} className="text-gray-500 cursor-pointer" />
        </div>

        <div className="flex-1 p-6 overflow-auto flex flex-col gap-4">
          <div className="flex justify-center">
            <span className="text-[10px] text-gray-400 bg-gray-200 px-2 py-0.5 rounded">14:20</span>
          </div>
          
          <div className="flex items-start gap-3">
            <img src={activeContact.avatar} className="w-9 h-9 rounded" alt="Avatar" />
            <div className="bg-white p-2 rounded-md shadow-sm text-sm max-w-[70%]">
              Hello! This is a high-fidelity WeChat simulation on macOS Sequoia.
            </div>
          </div>

          <div className="flex items-start gap-3 flex-row-reverse">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" className="w-9 h-9 rounded" alt="My Avatar" />
            <div className="bg-[#95ec69] p-2 rounded-md shadow-sm text-sm max-w-[70%]">
              Wow, it looks exactly like the real Mac version!
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="h-44 border-t border-gray-300 flex flex-col">
          <div className="flex items-center gap-4 px-4 py-2 text-gray-500">
            <Smile size={20} className="hover:text-black cursor-pointer" />
            <ImageIcon size={20} className="hover:text-black cursor-pointer" />
            <FileText size={20} className="hover:text-black cursor-pointer" />
            <Video size={20} className="hover:text-black cursor-pointer" />
          </div>
          <textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-transparent outline-none p-4 text-sm resize-none"
            placeholder=""
          />
          <div className="p-4 flex justify-end">
            <button className="bg-[#e9e9e9] text-gray-500 px-6 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
              Send (S)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
