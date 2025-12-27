import logoIcon from '../../assets/images/logo-small.svg';

// Simple Icons
const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const SoundOnIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
);
const SoundOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
);

interface HeaderProps {
  highScore: number;
  onOpenHistory?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

const Header = ({ highScore, onOpenHistory, isMuted, onToggleMute }: HeaderProps) => {
  return (
    <header className="flex w-full items-center justify-between mb-8 md:mb-12 relative">
      <div className="flex items-center gap-3">
        <img src={logoIcon} alt="Logo" className="w-8 h-8 md:w-10 md:h-10" />
        <h1 className="text-xl md:text-3xl font-bold tracking-tight text-white hidden sm:block font-display">
          TypeMaster
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* High Score Badge */}
        <div className="flex items-center gap-3 bg-neutral-800/50 rounded-lg py-2 px-4 border border-neutral-700/50">
           <span className="text-xs md:text-sm text-neutral-400 font-medium uppercase tracking-wider">
             Best
           </span>
           <span className="text-lg md:text-xl font-bold text-yellow-400">
             {highScore}
           </span>
           <span className="text-xs md:text-sm text-neutral-500 font-medium">
             wpm
           </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 bg-neutral-800/50 rounded-lg p-1 border border-neutral-700/50">
          {onOpenHistory && (
            <button onClick={onOpenHistory} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors" title="View History">
              <HistoryIcon />
            </button>
          )}
          {onToggleMute && (
            <button onClick={onToggleMute} className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors" title={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;