import React, { createContext, useContext, useState } from 'react';
import { AppID } from '../types';

interface DockPositionContextType {
  dockPositions: Record<AppID, { x: number; y: number; width: number; height: number }>;
  setDockPosition: (id: AppID, position: { x: number; y: number; width: number; height: number }) => void;
}

const DockPositionContext = createContext<DockPositionContextType | undefined>(undefined);

export const DockPositionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dockPositions, setDockPositions] = useState<Record<AppID, { x: number; y: number; width: number; height: number }>>({} as any);

  const setDockPosition = React.useCallback((id: AppID, position: { x: number; y: number; width: number; height: number }) => {
    setDockPositions(prev => {
      // Avoid unnecessary updates if position hasn't changed
      const current = prev[id];
      if (current && 
          current.x === position.x && 
          current.y === position.y && 
          current.width === position.width && 
          current.height === position.height) {
        return prev;
      }
      return { ...prev, [id]: position };
    });
  }, []);

  return (
    <DockPositionContext.Provider value={{ dockPositions, setDockPosition }}>
      {children}
    </DockPositionContext.Provider>
  );
};

export const useDockPosition = () => {
  const context = useContext(DockPositionContext);
  if (!context) throw new Error('useDockPosition must be used within a DockPositionProvider');
  return context;
};
