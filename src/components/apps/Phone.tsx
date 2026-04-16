import React, { useState } from 'react';
import { Phone as PhoneIcon, User, History, Star, Voicemail, Search, Grid, Plus, MoreVertical, PhoneCall, PhoneOff, Mic, MicOff, Volume2, Video } from 'lucide-react';

export const Phone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'recents' | 'contacts' | 'keypad' | 'voicemail'>('recents');
  const [isCalling, setIsCalling] = useState(false);
  const [currentCall, setCurrentCall] = useState<string | null>(null);

  const recents = [
    { name: 'John Doe', type: 'Mobile', time: '10:45 AM', status: 'incoming' },
    { name: 'Jane Smith', type: 'FaceTime Video', time: 'Yesterday', status: 'outgoing' },
    { name: 'Mom', type: 'Home', time: 'Tuesday', status: 'missed' },
    { name: '+1 (555) 123-4567', type: 'Mobile', time: 'Monday', status: 'incoming' },
    { name: 'Work', type: 'Office', time: 'Sunday', status: 'outgoing' },
  ];

  const contacts = [
    { name: 'Alice Johnson', initial: 'A' },
    { name: 'Bob Wilson', initial: 'B' },
    { name: 'Charlie Brown', initial: 'C' },
    { name: 'David Miller', initial: 'D' },
    { name: 'Eve Davis', initial: 'E' },
  ];

  const startCall = (name: string) => {
    setCurrentCall(name);
    setIsCalling(true);
  };

  return (
    <div className="flex flex-col h-full bg-black/10 text-white overflow-hidden select-none backdrop-blur-3xl">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 flex justify-between items-center liquid-glass z-10">
        <h1 className="text-3xl font-bold capitalize tracking-tight">{activeTab}</h1>
        <div className="flex gap-4">
          <div className="p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer">
            <Search size={20} className="text-blue-400" />
          </div>
          <div className="p-2 hover:bg-white/10 rounded-full transition-all cursor-pointer">
            <Plus size={24} className="text-blue-400" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4 custom-scrollbar">
        {activeTab === 'recents' && (
          <div className="space-y-1">
            {recents.map((call, i) => (
              <div 
                key={i} 
                className="flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-all duration-200 group cursor-default active:scale-[0.98]"
                onClick={() => startCall(call.name)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-inner ${call.status === 'missed' ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60'}`}>
                    {call.name[0]}
                  </div>
                  <div>
                    <div className={`font-bold text-[15px] ${call.status === 'missed' ? 'text-red-400' : 'text-white'}`}>{call.name}</div>
                    <div className="text-[12px] text-white/40 font-medium">{call.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[13px] text-white/30 font-medium">{call.time}</div>
                  <div className="p-1.5 hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                    <MoreVertical size={16} className="text-white/40" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-6">
            {contacts.map((contact, i) => (
              <div key={i} className="group">
                <div className="text-[11px] font-bold text-white/20 px-4 mb-2 uppercase tracking-widest">{contact.initial}</div>
                <div className="px-4 py-3 hover:bg-white/5 rounded-2xl transition-all cursor-default border-b border-white/5 font-medium text-[15px] active:scale-[0.99]">
                  {contact.name}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'keypad' && (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="text-4xl font-light mb-12 tracking-[0.2em] h-12 text-white/90"></div>
            <div className="grid grid-cols-3 gap-x-10 gap-y-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((num) => (
                <div 
                  key={num} 
                  className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center hover:bg-white/15 active:bg-white/25 transition-all cursor-pointer shadow-lg active:scale-90 group"
                >
                  <span className="text-3xl font-medium group-hover:scale-110 transition-transform">{num}</span>
                  {typeof num === 'number' && num >= 2 && num <= 9 && (
                    <span className="text-[9px] text-white/30 font-bold tracking-widest mt-0.5">
                      {num === 2 ? 'ABC' : num === 3 ? 'DEF' : num === 4 ? 'GHI' : num === 5 ? 'JKL' : num === 6 ? 'MNO' : num === 7 ? 'PQRS' : num === 8 ? 'TUV' : 'WXYZ'}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-12 w-20 h-20 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-all cursor-pointer shadow-[0_0_30px_rgba(34,197,94,0.4)] active:scale-95">
              <PhoneIcon size={36} fill="white" className="text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div className="absolute bottom-0 w-full h-24 liquid-glass border-t border-white/5 flex justify-around items-center px-4 pb-4 z-20">
        <TabItem icon={Star} label="Favorites" active={activeTab === 'favorites'} onClick={() => setActiveTab('favorites')} />
        <TabItem icon={History} label="Recents" active={activeTab === 'recents'} onClick={() => setActiveTab('recents')} />
        <TabItem icon={User} label="Contacts" active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} />
        <TabItem icon={Grid} label="Keypad" active={activeTab === 'keypad'} onClick={() => setActiveTab('keypad')} />
        <TabItem icon={Voicemail} label="Voicemail" active={activeTab === 'voicemail'} onClick={() => setActiveTab('voicemail')} />
      </div>

      {/* In-Call Overlay */}
      {isCalling && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[100px] z-50 flex flex-col items-center justify-between py-24 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center gap-6">
            <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-5xl font-bold shadow-2xl">
              {currentCall?.[0]}
            </div>
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight">{currentCall}</h2>
              <p className="text-white/40 mt-2 font-medium tracking-wide uppercase text-[11px]">calling...</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-x-14 gap-y-10">
            <CallAction icon={MicOff} label="mute" />
            <CallAction icon={Grid} label="keypad" />
            <CallAction icon={Volume2} label="speaker" />
            <CallAction icon={Plus} label="add call" />
            <CallAction icon={Video} label="FaceTime" />
            <CallAction icon={User} label="contacts" />
          </div>

          <div 
            className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-all cursor-pointer shadow-[0_0_40px_rgba(239,68,68,0.4)] active:scale-90"
            onClick={() => setIsCalling(false)}
          >
            <PhoneOff size={36} fill="white" className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

const TabItem: React.FC<{ icon: any, label: string, active: boolean, onClick: () => void }> = ({ icon: Icon, label, active, onClick }) => (
  <div 
    className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${active ? 'text-blue-500' : 'text-white/40 hover:text-white/60'}`}
    onClick={onClick}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </div>
);

const CallAction: React.FC<{ icon: any, label: string }> = ({ icon: Icon, label }) => (
  <div className="flex flex-col items-center gap-2 group cursor-pointer">
    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
      <Icon size={28} />
    </div>
    <span className="text-[12px] text-white/60 group-hover:text-white transition-colors">{label}</span>
  </div>
);
