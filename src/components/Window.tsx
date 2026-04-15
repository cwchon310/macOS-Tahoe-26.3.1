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
    scale: minimizeEffect === 'genie' ? 1 : 0.1,
    scaleX: minimizeEffect === 'genie' ? 0.05 : undefined,
    scaleY: minimizeEffect === 'genie' ? 0.01 : undefined,
    opacity: 0,
    filter: 'blur(10px)'
  } : { 
    y: 100, 
    scale: 0.8, 
    opacity: 0,
    filter: 'blur(10px)'
  };

  const animation = windowState.isMinimized && targetPos
    ? { 
        scale: minimizeEffect === 'genie' ? 1 : 0.1,
        scaleX: minimizeEffect === 'genie' ? 0.05 : undefined,
        scaleY: minimizeEffect === 'genie' ? 0.01 : undefined,
        opacity: 0, 
        x: targetPos.x - (windowState.isMaximized ? 0 : windowState.x) + (targetPos.width / 2) - (windowState.isMaximized ? window.innerWidth / 2 : windowState.width / 2),
        y: targetPos.y - (windowState.isMaximized ? 28 : windowState.y) + (targetPos.height / 2) - (windowState.isMaximized ? (window.innerHeight - 112) / 2 : windowState.height / 2),
        filter: 'blur(10px)',
        borderRadius: '40px',
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
        borderRadius: windowState.isMaximized ? '0px' : '12px',
        width: windowState.isMaximized ? window.innerWidth : windowState.width,
        height: windowState.isShaded ? 52 : (windowState.isMaximized ? window.innerHeight - 112 : windowState.height),
        left: windowState.isMaximized ? 0 : windowState.x,
        top: windowState.isMaximized ? 28 : windowState.y,
      };

  const transitionSettings = {
    type: 'spring',
    stiffness: 350,
    damping: 35,
    mass: 1,
    ...(minimizeEffect === 'genie' && windowState.isMinimized ? {
      type: 'tween',
      ease: [0.4, 0, 0.2, 1],
      duration: 0.55,
      scaleX: { ease: [0.7, 0, 0.3, 1], duration: 0.55 },
      scaleY: { ease: [0.1, 0, 0.9, 1], duration: 0.55 },
      opacity: { duration: 0.3, delay: 0.25 },
      x: { ease: [0.4, 0, 0.2, 1], duration: 0.55 },
      y: { ease: [0.3, 0, 0.1, 1], duration: 0.55 }, // Different ease for Y to create a slight curve
    } : {})
  };

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
      className={`absolute overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.15)] flex flex-col backdrop-blur-[60px] ${
        windowState.isMinimized ? 'pointer-events-none' : ''
      } ${isMissionControl ? 'cursor-pointer' : ''}`}
      style={{
        zIndex: isMissionControl ? 10000 + windowState.zIndex : windowState.zIndex,
        backgroundColor: 'rgba(28, 28, 30, 0.75)',
        willChange: 'transform, opacity, width, height, left, top, filter',
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
        <div className="flex gap-2 group relative z-50">
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
        className={`flex-1 overflow-hidden bg-[#1c1c1e]/80 backdrop-blur-3xl relative z-0 rounded-xl flex flex-col ${
          windowState.isShaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${isMissionControl ? 'pointer-events-none' : ''}`}
      >
        {children}
      </div>

      {/* Resize Handles */}
      {!windowState.isMaximized && !windowState.isShaded && !isMissionControl && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 cursor-nwse-resize z-50" onPointerDown={(e) => handleResize(e, 'top-left')} />
          <div className="absolute top-0 left-2 right-2 h-2 cursor-ns-resize z-50" onPointerDown={(e) => handleResize(e, 'top')} />
          <div className="absolute top-0 right-0 w-2 h-2 cursor-nesw-resize z-50" onPointerDown={(e) => handleResize(e, 'top-right')} />
          <div className="absolute top-2 bottom-2 left-0 w-2 cursor-ew-resize z-50" onPointerDown={(e) => handleResize(e, 'left')} />
          <div className="absolute top-2 bottom-2 right-0 w-2 cursor-ew-resize z-50" onPointerDown={(e) => handleResize(e, 'right')} />
          <div className="absolute bottom-0 left-0 w-2 h-2 cursor-nesw-resize z-50" onPointerDown={(e) => handleResize(e, 'bottom-left')} />
          <div className="absolute bottom-0 left-2 right-2 h-2 cursor-ns-resize z-50" onPointerDown={(e) => handleResize(e, 'bottom')} />
          <div className="absolute bottom-0 right-0 w-2 h-2 cursor-nwse-resize z-50" onPointerDown={(e) => handleResize(e, 'bottom-right')} />
        </>
      )}
    </motion.div>
  );
});
