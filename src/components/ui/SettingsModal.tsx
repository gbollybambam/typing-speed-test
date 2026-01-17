import { memo } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isMuted: boolean;
  toggleMute: () => void;
  contentType: 'text' | 'code';
  setContentType: (type: 'text' | 'code') => void;
}

const OptionGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <label className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest opacity-70">
      {label}
    </label>
    <div className="grid grid-cols-2 gap-2">
      {children}
    </div>
  </div>
);

const OptionButton = ({ isActive, onClick, label }: { isActive: boolean, onClick: () => void, label: string }) => (
  <button
    onClick={onClick}
    className={`
      relative px-2 py-2 text-xs font-bold transition-all duration-200 border text-center rounded-sm uppercase tracking-wide
      ${isActive 
        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]' 
        : 'bg-transparent text-[var(--text-secondary)] border-[var(--text-secondary)]/20 hover:border-[var(--text-secondary)]/50 hover:text-[var(--text-primary)]'
      }
    `}
  >
    {label}
  </button>
);

const SettingsModal = ({ isOpen, onClose, theme, setTheme, isMuted, toggleMute, contentType, setContentType }: SettingsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center sm:p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" aria-hidden="true" />
      
      {/* Modal Content */}
      <div 
        className="w-full md:max-w-xs bg-[var(--bg-secondary)] border-t md:border border-[var(--text-secondary)]/20 rounded-t-lg md:rounded-lg shadow-2xl p-5 relative z-10 animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 ease-out" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-[var(--text-secondary)]/10 pb-3">
          <h2 className="text-sm font-bold text-[var(--text-primary)] tracking-tight uppercase">Settings</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl leading-none px-2">&times;</button>
        </div>

        {/* Options */}
        <div className="space-y-6 pb-2">
          <OptionGroup label="Mode">
            <OptionButton label="Text" isActive={contentType === 'text'} onClick={() => setContentType('text')} />
            <OptionButton label="Code" isActive={contentType === 'code'} onClick={() => setContentType('code')} />
          </OptionGroup>

          <OptionGroup label="Theme">
            <OptionButton label="Dark" isActive={theme === 'dark'} onClick={() => setTheme('dark')} />
            <OptionButton label="Light" isActive={theme === 'light'} onClick={() => setTheme('light')} />
          </OptionGroup>

          <OptionGroup label="Sound">
            <OptionButton label="On" isActive={!isMuted} onClick={toggleMute} />
            <OptionButton label="Mute" isActive={isMuted} onClick={toggleMute} />
          </OptionGroup>
        </div>
      </div>
    </div>
  );
};

export default memo(SettingsModal);