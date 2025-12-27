import logoSmall from '../../assets/images/logo-small.svg';
import logoLarge from '../../assets/images/logo-large.svg'; 
import bestIcon from '../../assets/images/icon-personal-best.svg';

interface HeaderProps {
  highScore: number;
}

const Header = ({ highScore }: HeaderProps) => {
  return (
    <header className="w-full max-w-5xl flex justify-between items-center mb-8 md:mb-12 px-1 relative z-50">
      
      {/* --- LEFT: LOGO SECTION --- */}
      <div>
        
        {/* Mobile: Small Logo (Icon only) */}
        <img 
          src={logoSmall} 
          alt="Typing Speed Test" 
          className="w-8 h-8 object-contain md:hidden" 
        />

        {/* Desktop: Large Logo (Icon + Text baked in) */}
        {/* Matches screenshot: Just the SVG file, sized appropriately */}
        <img 
          src={logoLarge} 
          alt="Typing Speed Test" 
          className="hidden md:block h-10 w-auto object-contain" 
        />

      </div>

      {/* --- RIGHT: PERSONAL BEST SECTION --- */}
      <div className="flex items-center gap-3">
        <img 
          src={bestIcon} 
          alt="Trophy" 
          className="w-5 h-5 object-contain" 
        />
        <div className="flex items-baseline gap-1.5 text-base">
          {/* Responsive Label Logic */}
          <span className="text-neutral-500 font-medium">
             <span className="md:hidden">Best:</span> {/* Mobile */}
             <span className="hidden md:inline">Personal best:</span> {/* Desktop */}
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