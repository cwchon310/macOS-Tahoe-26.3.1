import React from 'react';
import { FileText, FileImage, FileCode, FileSpreadsheet, FileArchive, Disc, Video, Music, File, Database, Terminal, Settings, Globe, Lock, Mail, Phone, Camera, Map, Calendar, Heart, Star } from 'lucide-react';
import { motion } from 'motion/react';

export const FileIcon = ({ name, className = "" }: { name: string, className?: string }) => {
  const ext = name.split('.').pop()?.toLowerCase();
  
  let Icon = File;
  let color = "text-gray-500";
  let label = ext?.toUpperCase();
  let bgGradient = "from-[#f5f5f5] to-[#e0e0e0]";

  switch (ext) {
    case 'pdf': 
      Icon = FileText; 
      color = "text-red-500"; 
      bgGradient = "from-red-50 to-red-100";
      break;
    case 'jpg':
    case 'jpeg':
    case 'png': 
    case 'gif':
    case 'webp':
    case 'heic':
      Icon = FileImage; 
      color = "text-blue-500"; 
      bgGradient = "from-blue-50 to-blue-100";
      break;
    case 'xlsx':
    case 'xls': 
    case 'csv':
      Icon = FileSpreadsheet; 
      color = "text-green-600"; 
      bgGradient = "from-green-50 to-green-100";
      break;
    case 'pptx':
    case 'ppt': 
    case 'key':
      Icon = FileText; 
      color = "text-orange-500"; 
      bgGradient = "from-orange-50 to-orange-100";
      break;
    case 'docx':
    case 'doc': 
    case 'pages':
      Icon = FileText; 
      color = "text-blue-600"; 
      bgGradient = "from-blue-50 to-blue-100";
      break;
    case 'txt': 
    case 'md':
    case 'rtf':
      Icon = FileText; 
      color = "text-gray-600"; 
      bgGradient = "from-gray-50 to-gray-200";
      break;
    case 'sh':
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx':
    case 'json': 
    case 'py':
    case 'rb':
    case 'cpp':
    case 'h':
    case 'swift':
      Icon = FileCode; 
      color = "text-emerald-600"; 
      bgGradient = "from-emerald-50 to-emerald-100";
      break;
    case 'iso':
    case 'dmg': 
    case 'pkg':
      Icon = Disc; 
      color = "text-slate-600"; 
      bgGradient = "from-slate-100 to-slate-200";
      break;
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz': 
    case '7z':
      Icon = FileArchive; 
      color = "text-yellow-600"; 
      bgGradient = "from-yellow-50 to-yellow-100";
      break;
    case 'mov':
    case 'mp4':
    case 'mkv': 
    case 'avi':
      Icon = Video; 
      color = "text-indigo-500"; 
      bgGradient = "from-indigo-50 to-indigo-100";
      break;
    case 'mp3':
    case 'wav': 
    case 'flac':
    case 'm4a':
      Icon = Music; 
      color = "text-pink-500"; 
      bgGradient = "from-pink-50 to-pink-100";
      break;
    case 'db':
    case 'sql':
    case 'sqlite':
      Icon = Database;
      color = "text-purple-600";
      bgGradient = "from-purple-50 to-purple-100";
      break;
    case 'plist':
    case 'xml':
    case 'yaml':
    case 'yml':
      Icon = Settings;
      color = "text-gray-700";
      bgGradient = "from-gray-100 to-gray-200";
      break;
    case 'html':
    case 'htm':
      Icon = Globe;
      color = "text-orange-600";
      bgGradient = "from-orange-50 to-orange-100";
      break;
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      className={`w-14 h-16 bg-gradient-to-br ${bgGradient} relative rounded-[4px] shadow-sm flex flex-col items-center justify-center overflow-hidden border border-black/10 ${className}`}
    >
       {/* Folded corner effect */}
       <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-bl from-white/50 to-black/5 rounded-bl-[4px] shadow-[-1px_1px_2px_rgba(0,0,0,0.1)] z-10" />
       
       <Icon size={24} className={`${color} drop-shadow-sm mb-2`} strokeWidth={1.5} />
       
       {/* Extension label at bottom */}
       <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-black/5 py-0.5 flex justify-center">
         <span className="text-[8px] font-bold text-black/60 tracking-wider">
           {label}
         </span>
       </div>
    </motion.div>
  );
};
