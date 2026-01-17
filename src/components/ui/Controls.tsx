import { useState, useRef, useEffect, memo } from 'react'; // Added memo
import { type Difficulty } from '../../utils/textgenerator';
import { type Mode } from '../../hooks/useTypingEngine';
import arrowIcon from '../../assets/images/icon-down-arrow.svg'; 

// ... [Keep your existing interfaces and CustomSelect component exactly as they were] ...
// (I am omitting the interfaces/CustomSelect code here to save space, paste your previous code for them here)
interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  disabled?: boolean;
}

const CustomSelect = ({ value, options, onChange, isOpen, onToggle, onClose, disabled }: CustomSelectProps) => {
    // ... [Paste your existing CustomSelect code here] ...
    const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && isOpen) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={containerRef} className="relative w-1/2 md:hidden">
      <button 
        onClick={(e) => { e.stopPropagation(); if (!disabled) onToggle(); }} 
        className={`relative w-full flex items-center justify-between bg-neutral-900 border border-neutral-800 text-white text-sm font-medium py-3 pl-4 pr-10 rounded-xl transition-colors ${isOpen ? 'border-neutral-700' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-neutral-700'}`}
        disabled={disabled}
        type="button"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <img src={arrowIcon} alt="" className={`w-2.5 h-2.5 opacity-60 transition-transform duration-200 absolute right-4 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top p-2">
          <ul>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  onClick={(e) => { e.stopPropagation(); onChange(option.value); onClose(); }}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${option.value === value ? 'text-white bg-neutral-800' : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'}`}
                  type="button"
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${option.value === value ? 'border-blue-600 bg-blue-600' : 'border-neutral-600 bg-transparent'}`}>
                    {option.value === value && <div className="w-2 h-2 rounded-full bg-neutral-900" />}
                  </div>
                  <span>{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface ControlsProps {
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  timeOption: number;
  setTimeOption: (time: number) => void;
  status: 'idle' | 'running' | 'finished';
}

const Controls = ({ difficulty, setDifficulty, mode, setMode, timeOption, setTimeOption, status }: ControlsProps) => {
  const isDisabled = status === 'running';
  const [openDropdown, setOpenDropdown] = useState<'difficulty' | 'mode' | null>(null);

  const currentConfigValue = mode === 'passage' ? 'passage' : `timed-${timeOption}`;
  
  // Memoize this handler to prevent recreation
  const handleConfigChange = (val: string) => {
    if (val === 'passage') {
      setMode('passage');
    } else {
      setMode('timed');
      setTimeOption(Number(val.split('-')[1]));
    }
  };

  const difficultyOptions: SelectOption[] = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
  ];

  const modeOptions: SelectOption[] = [
    { label: 'Timed (15s)', value: 'timed-15' },
    { label: 'Timed (30s)', value: 'timed-30' },
    { label: 'Timed (60s)', value: 'timed-60' },
    { label: 'Timed (120s)', value: 'timed-120' },
    { label: 'Passage', value: 'passage' },
  ];

  const renderDesktopGroup = (label: string, items: { label: string, value: string, isActive: boolean, onClick: () => void }[]) => (
    <div className="flex items-center gap-2">
      <span className="text-neutral-500 font-medium text-xs hidden xl:block whitespace-nowrap">{label}</span>
      <div className="flex items-center bg-neutral-900/50 p-1 rounded-lg border border-neutral-800/50">
        {items.map((item) => (
          <button
            key={item.value}
            onClick={item.onClick}
            disabled={isDisabled}
            className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all border whitespace-nowrap ${item.isActive ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.15)]' : 'bg-transparent border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex w-full md:w-auto z-30 relative justify-end">
      <div className="flex gap-3 w-full md:hidden">
        <CustomSelect value={difficulty} options={difficultyOptions} onChange={(val) => setDifficulty(val as Difficulty)} isOpen={openDropdown === 'difficulty'} onToggle={() => setOpenDropdown(openDropdown === 'difficulty' ? null : 'difficulty')} onClose={() => setOpenDropdown(null)} disabled={isDisabled} />
        <CustomSelect value={currentConfigValue} options={modeOptions} onChange={handleConfigChange} isOpen={openDropdown === 'mode'} onToggle={() => setOpenDropdown(openDropdown === 'mode' ? null : 'mode')} onClose={() => setOpenDropdown(null)} disabled={isDisabled} />
      </div>

      <div className="hidden md:flex items-center gap-4">
        {renderDesktopGroup("Difficulty:", [
          { label: 'Easy', value: 'easy', isActive: difficulty === 'easy', onClick: () => setDifficulty('easy') },
          { label: 'Medium', value: 'medium', isActive: difficulty === 'medium', onClick: () => setDifficulty('medium') },
          { label: 'Hard', value: 'hard', isActive: difficulty === 'hard', onClick: () => setDifficulty('hard') },
        ])}
        {renderDesktopGroup("Mode:", [
          { label: '15s', value: 'timed-15', isActive: mode === 'timed' && timeOption === 15, onClick: () => handleConfigChange('timed-15') },
          { label: '30s', value: 'timed-30', isActive: mode === 'timed' && timeOption === 30, onClick: () => handleConfigChange('timed-30') },
          { label: '60s', value: 'timed-60', isActive: mode === 'timed' && timeOption === 60, onClick: () => handleConfigChange('timed-60') },
          { label: '120s', value: 'timed-120', isActive: mode === 'timed' && timeOption === 120, onClick: () => handleConfigChange('timed-120') },
          { label: 'Passage', value: 'passage', isActive: mode === 'passage', onClick: () => handleConfigChange('passage') },
        ])}
      </div>
    </div>
  );
};

// 3. Export as Memo
export default memo(Controls);