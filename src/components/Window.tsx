import React, { memo } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { AppID, WindowState } from '../types';
import { useDockPosition } from '../context/DockPositionContext';
import { useSystem } from '../context/SystemContext';

interface WindowProps {
  windowState: WindowState;
  isActive: boolean;
  isMissionControl?: boolean;
  missionControlTransform?: { x: number; y: number; scale: number };
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onShade: () => void;
  onGeometryChange: (x: number, y: number, width: number, height: number) => void;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = memo(({
  windowState,
  isActive,
  isMissionControl,
  missionControlTransform,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onShade,
  onGeometryChange,
  children
}) => {
  const dragControls = useDragControls();
  const { dockPositions } = useDockPosition();
  const { minimizeEffect } = useSystem();
  const targetPos = dockPositions[windowState.id];

  const handleResize = (e: React.PointerEvent, direction: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    e.stopPropagation();
    onFocus();
    const startWidth = windowState.width;
    const startHeight = windowState.height;
    const startX = windowState.x;
    const startY = windowState.y;
    const pointerStartX = e.clientX;
    const pointerStartY = e.clientY;

    const onPointerMove = (moveEvent: PointerEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startX;
      let newY = startY;

      const deltaX = moveEvent.clientX - pointerStartX;
      const deltaY = moveEvent.clientY - pointerStartY;

      if (direction.includes('right')) newWidth = Math.max(200, startWidth + deltaX);
      if (direction.includes('bottom')) newHeight = Math.max(150, startHeight + deltaY);
      if (direction.includes('left')) {
        newWidth = Math.max(200, startWidth - deltaX);
        newX = startX + (startWidth - newWidth);
      }
      if (direction.includes('top')) {
        newHeight = Math.max(150, startHeight - deltaY);
        newY = Math.max(28, startY + (startHeight - newHeight));
        // Recalculate height if Y was clamped
        if (newY === 28) {
          newHeight = startHeight + (startY - 28);
        }
      }
      
      onGeometryChange(newX, newY, newWidth, newHeight);
    };
    
    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove as any);
      window.removeEventListener('pointerup', onPointerUp);
    };
    
    window.addEventListener('pointermove', onPointerMove as any);
    window.addEventListener('pointerup', onPointerUp);
  };

  if (!windowState.isOpen) return null;

  // Calculate initial and exit animations based on Dock position
  const dockAnimation = targetPos ? {
    x: targetPos.x - windowState.x + (targetPos.width / 2) - (windowState.width / 2),
    y: targetPos.y - windowState.y + (targetPos.height / 2) - (windowState.height / 2),
    scale: 0.15,
    opacity: 0,
    filter: 'blur(8px)'
  } : { 
    y: 100, 
    scale: 0.8, 
    opacity: 0,
    filter: 'blur(10px)'
  };

  const animation = windowState.isMinimized && targetPos
    ? { 
        scale: minimizeEffect === 'genie' ? 0.1 : 0.1,
        scaleX: minimizeEffect === 'genie' ? 0.05 : undefined,
        scaleY: minimizeEffect === 'genie' ? 0.01 : undefined,
        opacity: 0, 
        x: targetPos.x - (windowState.isMaximized ? 0 : windowState.x) + (targetPos.width / 2) - (windowState.isMaximized ? window.innerWidth / 2 : windowState.width / 2),
        y: targetPos.y - (windowState.isMaximized ? 28 : windowState.y) + (targetPos.height / 2) - (windowState.isMaximized ? (window.innerHeight - 112) / 2 : windowState.height / 2),
        filter: 'blur(10px)',
        borderRadius: '40px',
        clipPath: minimizeEffect === 'genie' 
          ? 'polygon(20% 0%, 80% 0%, 55% 100%, 45% 100%)' 
          : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
      }
    : isMissionControl && missionControlTransform
    ? {
        scale: missionControlTransform.scale,
        scaleX: missionControlTransform.scale,
        scaleY: missionControlTransform.scale,
        opacity: 1,
        x: missionControlTransform.x,
        y: missionControlTransform.y,
        filter: 'blur(0px)',
        borderRadius: '12px',
      }
    : { 
        scale: 1, 
        scaleX: 1, 
        scaleY: 1, 
        opacity: 1, 
        x: 0, 
        y: 0, 
        filter: 'blur(0px)',
        borderRadius: windowState.isMaximized ? '0px' : (windowState.isShaded ? '12px' : '12px'),
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        width: windowState.isMaximized ? window.innerWidth : windowState.width,
        height: windowState.isShaded ? 52 : (windowState.isMaximized ? window.innerHeight - 112 : windowState.height),
        left: windowState.isMaximized ? 0 : windowState.x,
        top: windowState.isMaximized ? 28 : windowState.y,
        boxShadow: windowState.isShaded 
          ? '0 10px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)' 
          : '0 30px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.15)',
      };

  const transitionSettings = {
    type: 'spring',
    stiffness: 285.71, // macOS Native Spring Stiffness
    damping: 25, // Adjusted for browser feel
    mass: 1,
    ...(minimizeEffect === 'genie' && windowState.isMinimized ? {
      type: 'tween',
      ease: [0.4, 0, 0.2, 1],
      duration: 0.65,
      scaleX: { ease: [0.7, 0, 0.3, 1], duration: 0.65 },
      scaleY: { ease: [0.1, 0, 0.9, 1], duration: 0.65 },
      opacity: { duration: 0.4, delay: 0.25 },
      x: { ease: [0.4, 0, 0.2, 1], duration: 0.65 },
      y: { ease: [0.3, 0, 0.1, 1], duration: 0.65 },
      clipPath: { ease: [0.4, 0, 0.2, 1], duration: 0.65 },
    } : {})
  };

  const transformOrigin = targetPos 
    ? `${targetPos.x - (windowState.isMaximized ? 0 : windowState.x) + targetPos.width / 2}px ${targetPos.y - (windowState.isMaximized ? 28 : windowState.y) + targetPos.height / 2}px`
    : 'center';

  return (
    <motion.div
      drag={!windowState.isMaximized && !windowState.isMinimized && !isMissionControl}
      dragControls={dragControls}
      dragConstraints={{ top: 28 - windowState.y }}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const newX = windowState.x + info.offset.x;
        const newY = Math.max(28, windowState.y + info.offset.y);
        onGeometryChange(
          newX,
          newY,
          windowState.width,
          windowState.height
        );
      }}
      initial={dockAnimation}
      animate={animation}
      exit={dockAnimation}
      transition={transitionSettings as any}
      className={`absolute overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.15)] flex flex-col backdrop-blur-[60px] liquid-glass-dark ${
        windowState.isMinimized ? 'pointer-events-none' : ''
      } ${isMissionControl ? 'cursor-pointer' : ''}`}
      style={{
        zIndex: isMissionControl ? 10000 + windowState.zIndex : windowState.zIndex,
        backgroundColor: 'rgba(28, 28, 30, 0.65)',
        willChange: 'transform, opacity, width, height, left, top, filter',
        transformOrigin,
      }}
      onPointerDown={(e) => {
        if (isMissionControl) {
          e.stopPropagation();
          onFocus();
        } else {
          onFocus();
        }
      }}
    >
      {/* Traffic Lights & Drag Area Overlay */}
      <div 
        className={`absolute top-0 left-0 right-0 h-[52px] flex items-center px-4 z-50 select-none ${isMissionControl ? 'pointer-events-none' : 'cursor-default active:cursor-grabbing'}`}
        onDoubleClick={onShade}
        onPointerDown={(e) => {
          if (!isMissionControl) dragControls.start(e);
        }}
      >
        <div className="flex gap-2 group relative z-50" onDoubleClick={(e) => e.stopPropagation()}>
          <motion.button 
            whileHover={isActive ? { scale: 1.1 } : {}}
            whileTap={isActive ? { scale: 0.9 } : {}}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className={`w-3 h-3 rounded-full border border-black/10 flex items-center justify-center transition-colors relative overflow-hidden ${
              isActive ? 'bg-[#ff5f56] text-[#4d0000]' : 'bg-white/10 text-transparent'
            }`}
          >
            <svg className={`w-2 h-2 opacity-0 ${isActive ? 'group-hover:opacity-100' : ''} transition-opacity`} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 4l6 6m0-6l-6 6" />
            </svg>
          </motion.button>
          <motion.button 
            whileHover={isActive ? { scale: 1.1 } : {}}
            whileTap={isActive ? { scale: 0.9 } : {}}
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className={`w-3 h-3 rounded-full border border-black/10 flex items-center justify-center transition-colors relative overflow-hidden ${
              isActive ? 'bg-[#ffbd2e] text-[#995700]' : 'bg-white/10 text-transparent'
            }`}
          >
            <svg className={`w-2 h-2 opacity-0 ${isActive ? 'group-hover:opacity-100' : ''} transition-opacity`} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 7h8" />
            </svg>
          </motion.button>
          <motion.button 
            whileHover={isActive ? { scale: 1.1 } : {}}
            whileTap={isActive ? { scale: 0.9 } : {}}
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            className={`w-3 h-3 rounded-full border border-black/10 flex items-center justify-center transition-colors relative overflow-hidden ${
              isActive ? 'bg-[#27c93f] text-[#006500]' : 'bg-white/10 text-transparent'
            }`}
          >
            <svg className={`w-2 h-2 opacity-0 ${isActive ? 'group-hover:opacity-100' : ''} transition-opacity`} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4.5 9.5L2 12m0 0v-3m0 3h3M9.5 4.5L12 2m0 0v3m0-3H9" />
            </svg>
          </motion.button>
        </div>
        
        <div className={`flex-1 text-center text-[13px] font-semibold tracking-wide pointer-events-none pr-16 transition-colors ${
          isActive ? 'text-white/80' : 'text-white/30'
        }`}>
          {windowState.title}
        </div>
      </div>

      {/* Content */}
      <div 
        className={`flex-1 overflow-hidden bg-[#1c1c1e]/60 backdrop-blur-3xl relative z-0 rounded-xl flex flex-col ${
          windowState.isShaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${isMissionControl ? 'pointer-events-none' : ''}`}
      >
        {children}
      </div>

      {/* Mission Control Close Button */}
      <AnimatePresence>
        {isMissionControl && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute -top-3 -left-3 w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/30 transition-all z-[60] border border-white/10 shadow-lg"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Mission Control Title */}
      <AnimatePresence>
        {isMissionControl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold whitespace-nowrap shadow-xl border border-white/10"
          >
            {windowState.title}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resize Handles */}
      {!windowState.isMaximized && !windowState.isShaded && !isMissionControl && (
        <>
          <div className="absolute top-0 left-0 w-3 h-3 cursor-nwse-resize z-50 hover:bg-blue-500/10 transition-colors" onPointerDown={(e) => handleResize(e, 'top-left')} />
          <div className="absolute top-0 left-3 right-3 h-1 cursor-ns-resize z-50 hover:bg-blue-500/10 transition-colors" onPointerDown={(e) => handleResize(e, 'top')} />
          <div className="absolute top-0 right-0 w-3 h-3 cursor-nesw-resize z-50 hover:bg-blue-500/10 transition-colors" onPointerDown={(e) => handleResize(e, 'top-right')} />
          <div className="absolute top-3 bottom-3 left-0 w-1 cursor-ew-resize z-50 hover:bg-blue-500/10 transition-colors" onPointerDown={(e) => handleResize(e, 'left')} />
          <div className="absolute top-3 bottom-3 right-0 w-1 cursor-ew-resize z-50 hover:bg-blue-500/10 transition-colors" onPointerDown={(e) => handleResize(e, 'right')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-nesw-resize z-50 hover:bg-blue-500/10 transition-colors" onPointerDown={(e) => handleResize(e, 'bottom-left')} />
          <div className="absolute bottom-0 left-3 right-3 h-1 cursor-ns-resize z-50 hover:bg-blue-500/10 transition-colors" onPointerDown={(e) => handleResize(e, 'bottom')} />
          <div className="absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-50 hover:bg-blue-500/10 transition-colors" onPointerDown={(e) => handleResize(e, 'bottom-right')} />
        </>
      )}
    </motion.div>
  );
});
