import React, { useState, useEffect } from 'react';
import { Folder, HardDrive, Clock, Star, LayoutGrid, ChevronLeft, ChevronRight, Search, ChevronRight as BreadcrumbSeparator, Info, X, FileText, Image as ImageIcon, Music, Video, FileCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useInstalledApps } from '../../context/InstalledAppsContext';
import { FileIcon } from '../FileIcon';
import { ContextMenu } from '../ContextMenu';

const SIDEBAR_SECTIONS = [
  {
    id: 'favorites',
    label: 'Favorites',
    items: [
      { icon: Clock, label: 'Recents', path: '/recents' },
      { icon: Folder, label: 'Applications', path: '/Applications' },
      { icon: Folder, label: 'Desktop', path: '/Desktop' },
      { icon: Folder, label: 'Documents', path: '/Documents' },
      { icon: Folder, label: 'Downloads', path: '/Downloads' },
    ]
  },
  {
    id: 'icloud',
    label: 'iCloud',
    items: [
      { icon: HardDrive, label: 'iCloud Drive', path: '/iCloud' },
    ]
  }
];

const UTILITIES = [
  { name: 'Activity Monitor', type: 'app', icon: 'https://img.icons8.com/fluency/96/activity-monitor.png' },
  { name: 'AirPort Utility', type: 'app', icon: 'https://img.icons8.com/fluency/96/airport.png' },
  { name: 'Automator', type: 'app', icon: 'https://img.icons8.com/fluency/96/automator.png' },
  { name: 'Bluetooth File Exchange', type: 'app', icon: 'https://img.icons8.com/fluency/96/bluetooth.png' },
  { name: 'Boot Camp Assistant', type: 'app', icon: 'https://img.icons8.com/fluency/96/windows-10.png' },
  { name: 'Calculator', type: 'app', icon: 'https://img.icons8.com/fluency/96/calculator.png' },
  { name: 'ColorSync Utility', type: 'app', icon: 'https://img.icons8.com/fluency/96/color-wheel.png' },
  { name: 'Console', type: 'app', icon: 'https://img.icons8.com/fluency/96/console.png' },
  { name: 'Dictionary', type: 'app', icon: 'https://img.icons8.com/fluency/96/dictionary.png' },
  { name: 'Digital Color Meter', type: 'app', icon: 'https://img.icons8.com/fluency/96/color-dropper.png' },
  { name: 'Disk Utility', type: 'app', icon: 'https://img.icons8.com/fluency/96/hdd.png' },
  { name: 'Font Book', type: 'app', icon: 'https://img.icons8.com/fluency/96/font-book.png' },
  { name: 'Grapher', type: 'app', icon: 'https://img.icons8.com/fluency/96/combo-chart.png' },
  { name: 'Image Capture', type: 'app', icon: 'https://img.icons8.com/fluency/96/camera.png' },
  { name: 'Keychain Access', type: 'app', icon: 'https://img.icons8.com/fluency/96/key.png' },
  { name: 'Migration Assistant', type: 'app', icon: 'https://img.icons8.com/fluency/96/data-transfer.png' },
  { name: 'Preview', type: 'app', icon: 'https://img.icons8.com/fluency/96/preview.png' },
  { name: 'QuickTime Player', type: 'app', icon: 'https://img.icons8.com/fluency/96/quicktime.png' },
  { name: 'Screen Sharing', type: 'app', icon: 'https://img.icons8.com/fluency/96/monitor.png' },
  { name: 'Script Editor', type: 'app', icon: 'https://img.icons8.com/fluency/96/script.png' },
  { name: 'System Information', type: 'app', icon: 'https://img.icons8.com/fluency/96/info.png' },
  { name: 'Terminal', type: 'app', icon: 'https://img.icons8.com/fluency/96/console.png' },
  { name: 'TextEdit', type: 'app', icon: 'https://img.icons8.com/fluency/96/textedit.png' },
  { name: 'VoiceOver Utility', type: 'app', icon: 'https://img.icons8.com/fluency/96/voice-recognition.png' },
];

const RECENTS = [
  { name: 'Project Alpha', type: 'folder', path: '/Documents/Project Alpha' },
  { name: 'Vacation.jpg', type: 'image' },
  { name: 'Resume.pdf', type: 'pdf' },
  { name: 'Budget.xlsx', type: 'excel' },
  { name: 'Notes.txt', type: 'text' },
  { name: 'Presentation.pptx', type: 'powerpoint' },
];

const DESKTOP = [
  { name: 'macOS-Tahoe-26.3.1.iso', type: 'iso' },
  { name: 'Install macOS Tahoe.sh', type: 'script' },
];

const TRASH = [
  { name: 'Deleted Document.docx', type: 'word' },
  { name: 'Old Photo.jpg', type: 'image' },
];

export const Finder: React.FC<{ initialPath?: string }> = ({ initialPath = '/Applications' }) => {
  const { installedApps } = useInstalledApps();
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('finder_expanded_sections');
    return saved ? JSON.parse(saved) : { favorites: true, icloud: true };
  });
  const [hoveredFile, setHoveredFile] = useState<any>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; isOpen: boolean; file: any } | null>(null);
  const [infoModal, setInfoModal] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('finder_expanded_sections', JSON.stringify(expandedSections));
  }, [expandedSections]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const navigateTo = (path: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
    }
  };

  const getAllFiles = () => {
    const allFiles: Array<{ name: string; type: string; icon?: string; path?: string }> = [
      ...RECENTS,
      ...DESKTOP,
      ...TRASH,
      ...UTILITIES,
      ...installedApps.map(app => ({ ...app, type: 'app' }))
    ];
    return allFiles;
  };

  const getFilesForPath = () => {
    if (searchQuery) {
      return getAllFiles();
    }
    switch (currentPath) {
      case '/': return [
        { name: 'Applications', type: 'folder', path: '/Applications' },
        { name: 'Desktop', type: 'folder', path: '/Desktop' },
        { name: 'Documents', type: 'folder', path: '/Documents' },
        { name: 'Downloads', type: 'folder', path: '/Downloads' },
        { name: 'System', type: 'folder', path: '/System' },
        { name: 'Users', type: 'folder', path: '/Users' },
      ];
      case '/Applications': return [
        { name: 'Utilities', type: 'folder', path: '/Applications/Utilities' },
        ...installedApps.map(app => ({ ...app, type: 'app' })).sort((a, b) => a.name.localeCompare(b.name))
      ];
      case '/Applications/Utilities': return UTILITIES;
      case '/Desktop': return DESKTOP;
      case '/recents': return RECENTS;
      case '/Trash': return TRASH;
      default: return [];
    }
  };

  const breadcrumbs = currentPath.split('/').filter(Boolean);
  
  const handleBreadcrumbClick = (index: number) => {
    const newPath = '/' + breadcrumbs.slice(0, index + 1).join('/');
    navigateTo(newPath);
  };

  const files = (getFilesForPath() as Array<{ name: string; type: string; icon?: string; path?: string }>).filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSidebarItem = SIDEBAR_SECTIONS.flatMap(s => s.items).reverse().find(item => 
    item.path && (currentPath === item.path || currentPath.startsWith(item.path + '/'))
  );

  const handleContextMenu = (e: React.MouseEvent, file: any) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, isOpen: true, file });
  };

  const handleDragStart = (e: React.DragEvent, file: any) => {
    e.dataTransfer.setData('finder_file', JSON.stringify(file));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPath: string) => {
    e.preventDefault();
    const fileData = e.dataTransfer.getData('finder_file');
    if (fileData) {
      const file = JSON.parse(fileData);
      console.log(`Moving ${file.name} to ${targetPath}`);
      // In a real app, we would update the file system state here
    }
  };

  return (
    <div className="flex h-full bg-[#1e1e1e]/90 text-white overflow-hidden rounded-b-xl relative">
      {/* Sidebar */}
      <div className="w-[220px] bg-white/5 backdrop-blur-[80px] border-r border-black/20 flex flex-col pt-12 shrink-0">
        <div className="px-3 mb-4">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1.5 text-white/40" />
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-md pl-8 pr-3 py-1 text-[12px] outline-none focus:border-blue-500/50 transition-all placeholder:text-white/40"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.id} className="mb-4">
              <div 
                onClick={() => toggleSection(section.id)}
                className="flex items-center justify-between px-3 py-1 text-[11px] font-bold text-white/40 uppercase tracking-wider cursor-default group hover:text-white/60 transition-colors"
              >
                <span>{section.label}</span>
                <ChevronRight 
                  size={12} 
                  className={`transition-transform duration-200 ${expandedSections[section.id] ? 'rotate-90' : ''} opacity-0 group-hover:opacity-100`} 
                />
              </div>
              
              <div className={`mt-1 space-y-0.5 overflow-hidden transition-all duration-300 ${expandedSections[section.id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                {section.items.map((item, i) => {
                  const isActive = activeSidebarItem?.path === item.path;
                  return (
                    <div 
                      key={i}
                      onClick={() => item.path && navigateTo(item.path)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => item.path && handleDrop(e, item.path)}
                      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-default group active:scale-[0.98] relative ${
                        isActive 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon 
                        size={16} 
                        className={`transition-all duration-200 group-hover:scale-110 ${
                          isActive 
                            ? 'text-white' 
                            : 'text-blue-400 group-hover:text-blue-300'
                        }`} 
                        strokeWidth={2} 
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
        {/* Toolbar */}
        <div className="h-[52px] border-b border-black/20 flex items-center px-4 justify-between bg-[#1e1e1e]/80 backdrop-blur-xl shrink-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex gap-4 text-white/50">
              <ChevronLeft 
                size={20} 
                strokeWidth={2}
                onClick={goBack}
                className={`transition-colors ${historyIndex > 0 ? 'hover:text-white cursor-pointer' : 'opacity-30 cursor-not-allowed'}`} 
              />
              <ChevronRight 
                size={20} 
                strokeWidth={2}
                onClick={goForward}
                className={`transition-colors ${historyIndex < history.length - 1 ? 'hover:text-white cursor-pointer' : 'opacity-30 cursor-not-allowed'}`} 
              />
            </div>
            
            {/* Breadcrumbs */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5 shadow-inner overflow-x-auto max-w-[400px] hide-scrollbar">
              <div 
                className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors text-[12px] font-medium flex items-center gap-1.5 whitespace-nowrap ${breadcrumbs.length === 0 ? 'bg-white/15 text-white shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                onClick={() => navigateTo('/')}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, '/')}
              >
                <HardDrive size={13} className={breadcrumbs.length === 0 ? 'text-white' : 'text-white/50'} />
                <span>Macintosh HD</span>
              </div>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator size={12} className="text-white/20 shrink-0" />
                  <div 
                    className={`px-2.5 py-1 rounded-md cursor-pointer transition-colors text-[12px] font-medium flex items-center gap-1.5 whitespace-nowrap ${index === breadcrumbs.length - 1 ? 'bg-white/15 text-white shadow-sm' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
                    onClick={() => handleBreadcrumbClick(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, '/' + breadcrumbs.slice(0, index + 1).join('/'))}
                  >
                    <Folder size={13} className={index === breadcrumbs.length - 1 ? 'text-blue-400' : 'text-blue-400/50'} strokeWidth={2.5} />
                    <span>{crumb}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-white/50">
            <LayoutGrid size={18} strokeWidth={2} className="cursor-pointer hover:text-white transition-colors" />
            <Search size={18} strokeWidth={2} className="cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Grid */}
          <div className="flex-1 p-6 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-x-4 gap-y-8 overflow-y-auto content-start custom-scrollbar">
            {files.map((file, i) => (
              <div 
                key={i} 
                draggable
                onDragStart={(e) => handleDragStart(e, file)}
                onDragOver={(e) => file.type === 'folder' ? e.preventDefault() : null}
                onDrop={(e) => file.type === 'folder' && file.path ? handleDrop(e, file.path) : null}
                className="flex flex-col items-center gap-1 group cursor-default"
                onDoubleClick={() => file.type === 'folder' && file.path && navigateTo(file.path)}
                onMouseEnter={() => setHoveredFile(file)}
                onMouseLeave={() => setHoveredFile(null)}
                onContextMenu={(e) => handleContextMenu(e, file)}
              >
                <div className="w-16 h-16 flex items-center justify-center relative">
                  {file.type === 'app' && file.icon ? (
                    <img src={file.icon} className="w-14 h-14 object-contain drop-shadow-md group-active:brightness-75 transition-all" referrerPolicy="no-referrer" onError={(e) => { (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/console.png'; }} />
                  ) : file.type === 'folder' ? (
                    <img src="https://img.icons8.com/fluency/96/mac-folder.png" className="w-16 h-16 object-contain drop-shadow-md group-active:brightness-75 transition-all" alt="Folder" />
                  ) : (
                    <FileIcon name={file.name} />
                  )}
                </div>
                <span className="text-[12px] font-medium text-center break-words line-clamp-2 px-1.5 py-0.5 rounded group-hover:bg-blue-600/80 group-active:bg-blue-600 transition-colors max-w-full">
                  {file.name}
                </span>
              </div>
            ))}
          </div>

          {/* Preview Pane */}
          <AnimatePresence>
            {hoveredFile && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="bg-black/20 border-l border-white/10 flex flex-col items-center p-6 shrink-0 overflow-hidden"
              >
                <div className="w-32 h-32 flex items-center justify-center mb-6">
                  {hoveredFile.type === 'app' && hoveredFile.icon ? (
                    <img src={hoveredFile.icon} className="w-24 h-24 object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
                  ) : hoveredFile.type === 'folder' ? (
                    <img src="https://img.icons8.com/fluency/96/mac-folder.png" className="w-24 h-24 object-contain drop-shadow-2xl" />
                  ) : (
                    <FileIcon name={hoveredFile.name} className="w-24 h-32" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-center mb-1 truncate w-full">{hoveredFile.name}</h3>
                <p className="text-[11px] text-white/40 uppercase font-bold tracking-wider mb-6">{hoveredFile.type}</p>
                
                <div className="w-full space-y-4 text-[12px]">
                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 font-medium">Kind</span>
                    <span className="text-white/80">{hoveredFile.type.charAt(0).toUpperCase() + hoveredFile.type.slice(1)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 font-medium">Size</span>
                    <span className="text-white/80">{hoveredFile.type === 'folder' ? '--' : '1.2 MB'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 font-medium">Created</span>
                    <span className="text-white/80">Apr 15, 2026 at 4:26 PM</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          items={[
            { label: 'Open', onClick: () => contextMenu.file.type === 'folder' && contextMenu.file.path && navigateTo(contextMenu.file.path) },
            { label: 'Get Info', onClick: () => setInfoModal(contextMenu.file) },
            { label: '', divider: true },
            { label: 'Move to Trash', onClick: () => {}, danger: true },
          ]}
        />
      )}

      {/* Info Modal */}
      <AnimatePresence>
        {infoModal && (
          <div className="fixed inset-0 z-[10002] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-[320px] bg-[#2d2d2d] rounded-xl shadow-2xl border border-white/10 overflow-hidden"
            >
              <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-white/5">
                <span className="text-xs font-bold text-white/60">Info</span>
                <button onClick={() => setInfoModal(null)} className="text-white/40 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="p-6 flex flex-col items-center">
                <div className="w-20 h-20 mb-6">
                  {infoModal.type === 'app' && infoModal.icon ? (
                    <img src={infoModal.icon} className="w-full h-full object-contain drop-shadow-xl" referrerPolicy="no-referrer" />
                  ) : infoModal.type === 'folder' ? (
                    <img src="https://img.icons8.com/fluency/96/mac-folder.png" className="w-full h-full object-contain drop-shadow-xl" />
                  ) : (
                    <FileIcon name={infoModal.name} className="w-full h-full" />
                  )}
                </div>
                <h2 className="text-lg font-bold text-center mb-6">{infoModal.name}</h2>
                
                <div className="w-full space-y-4 text-[13px]">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Kind</span>
                    <span className="text-white/90">{infoModal.type}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Size</span>
                    <span className="text-white/90">{infoModal.type === 'folder' ? '--' : '1.2 MB'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Created</span>
                    <span className="text-white/90">Apr 15, 2026</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Modified</span>
                    <span className="text-white/90">Today at 7:06 AM</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setInfoModal(null)}
                  className="mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
