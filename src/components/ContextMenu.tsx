import React from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items: { label: string; onClick?: () => void; danger?: boolean; divider?: boolean }[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, items }) => {
  return (
    <>
      <div className="fixed inset-0 z-[9999]" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <div
        className="fixed z-[10000] w-56 bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-2xl py-1 overflow-hidden"
        style={{ top: y, left: x }}
      >
        {items.map((item, index) => {
          if (item.divider) {
            return <div key={index} className="border-t border-white/10 my-1 mx-2" />;
          }
          return (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                onClose();
              }}
              className={`w-full text-left px-4 py-1.5 text-[13px] hover:bg-blue-500 transition-colors ${
                item.danger ? 'text-red-400' : 'text-white/90'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
};
