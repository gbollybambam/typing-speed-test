import logo from '../../assets/images/logo-small.svg';
import bestIcon from '../../assets/images/icon-personal-best.svg';

interface HeaderProps {
  highScore: number;
}

const Header = ({ highScore }: HeaderProps) => {
  return (
    <header className="w-full max-w-5xl flex justify-between items-center mb-12 px-1">
      
      {/* Left: Logo */}
      <img 
        src={logo} 
        alt="Logo" 
        className="w-8 h-8 object-contain" // Adjusted size to match screenshot
      />

      {/* Right: Personal Best */}
      <div className="flex items-center gap-3">
        <img 
          src={bestIcon} 
          alt="Trophy" 
          className="w-5 h-5 object-contain" 
        />
        <div className="flex items-baseline gap-1.5 text-base">
          <span className="text-neutral-500 font-medium">
            Best:
          </span>
          <span className="text-neutral-100 font-medium">
            {highScore} WPM
          </span>
        </div>
      </div>

    </header>
  );
};

export default Header;