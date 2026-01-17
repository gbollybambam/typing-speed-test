import { memo } from 'react';

export interface HistoryItem {
  wpm: number;
  accuracy: number;
  date: string;
  mode: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
}

const HistoryModal = ({ isOpen, onClose, history }: HistoryModalProps) => {
  if (!isOpen) return null;

  return (
    // Wrapper: Fixed full screen, aligns content to the RIGHT
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      
      {/* Backdrop: Dark blur, clicking it closes the drawer */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
        aria-hidden="true" 
      />

      {/* Drawer: Slides in from Right */}
      <div 
        className="
          relative z-10 w-full md:max-w-md h-full 
          bg-[var(--bg-secondary)] border-l border-[var(--text-secondary)]/20 shadow-2xl 
          flex flex-col 
          animate-in slide-in-from-right duration-300 ease-out
        "
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header (Sticky at top) */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--text-secondary)]/10 shrink-0">
          <div className="flex items-center gap-3">
             <span className="text-2xl">📜</span>
             <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">History</h2>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--text-secondary)]/10 text-[var(--text-secondary)] transition-colors text-xl"
          >
            &times;
          </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] opacity-60">
              <p className="mb-2 text-4xl">📉</p>
              <p>No tests recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {/* Header Row */}
              <div className="grid grid-cols-4 gap-4 px-4 py-2 text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider opacity-70">
                <div className="col-span-1">Date</div>
                <div className="col-span-1">Mode</div>
                <div className="col-span-1 text-right">WPM</div>
                <div className="col-span-1 text-right">Acc</div>
              </div>

              {/* Data Rows */}
              <div className="space-y-1">
                {history.slice().reverse().map((item, index) => (
                  <div 
                    key={index} 
                    className="
                      grid grid-cols-4 gap-4 px-4 py-3 
                      items-center rounded-md border border-transparent
                      hover:bg-[var(--text-secondary)]/5 hover:border-[var(--text-secondary)]/10 
                      transition-all duration-200
                    "
                  >
                    {/* Date */}
                    <div className="col-span-1 text-xs text-[var(--text-secondary)] font-medium truncate">
                      {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                    
                    {/* Mode (Cleaned up for display) */}
                    <div className="col-span-1 text-xs text-[var(--text-secondary)] truncate capitalize" title={item.mode}>
                      {item.mode.replace('timed-', '')}
                    </div>

                    {/* WPM (Highlighted) */}
                    <div className="col-span-1 text-right text-sm font-bold text-[var(--text-primary)]">
                      {item.wpm}
                    </div>

                    {/* Accuracy (Colored if perfect) */}
                    <div className={`col-span-1 text-right text-sm font-medium ${item.accuracy === 100 ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>
                      {item.accuracy}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer (Stats Summary) */}
        {history.length > 0 && (
          <div className="p-6 border-t border-[var(--text-secondary)]/10 bg-[var(--text-secondary)]/5 shrink-0">
            <div className="flex justify-between items-center text-xs text-[var(--text-secondary)] font-medium uppercase tracking-widest">
              <span>Tests Taken</span>
              <span className="text-[var(--text-primary)] font-bold text-sm">{history.length}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default memo(HistoryModal);