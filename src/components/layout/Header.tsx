import logoIcon from '../../assets/images/logo-small.svg';

// --- ICONS ---
const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
);

interface HeaderProps {
  highScore: number;
  onOpenHistory: () => void;
  onOpenSettings: () => void; // Changed from toggle props to just one open handler
}

const Header = ({ highScore, onOpenHistory, onOpenSettings }: HeaderProps) => {
  return (
    <header className="flex w-full items-center justify-between mb-8 md:mb-12 relative">
      
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <img src={logoIcon} alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)] hidden sm:block font-display">
          TypeMaster
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* High Score Badge */}
        <div className="flex items-center gap-3 bg-[var(--bg-secondary)] rounded-lg py-2 px-4 border border-[var(--text-secondary)]/20 shadow-sm transition-colors duration-300">
           <span className="text-xs md:text-sm text-[var(--text-secondary)] font-medium uppercase tracking-wider">
             Best
           </span>
           <span className="text-lg md:text-xl font-bold text-[var(--accent)]">
             {highScore}
           </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 bg-[var(--bg-secondary)] rounded-lg p-1 border border-[var(--text-secondary)]/20 shadow-sm transition-colors duration-300">
          
          <button 
            onClick={onOpenHistory} 
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-secondary)]/10 rounded-md transition-colors" 
            title="View History"
          >
            <HistoryIcon />
          </button>

          {/* New Settings Button */}
          <button 
            onClick={onOpenSettings} 
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-secondary)]/10 rounded-md transition-colors" 
            title="Settings"
          >
            <SettingsIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;