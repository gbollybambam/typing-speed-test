import { useState, useRef, useEffect } from 'react';
import { type Difficulty } from '../../utils/textGenerator';
import { type Mode } from '../../hooks/useTypingEngine';
import arrowIcon from '../../assets/images/icon-down-arrow.svg';

// --- INTERNAL CUSTOM SELECT COMPONENT ---
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

  const triggerClasses = `
    relative w-full flex items-center justify-between
    bg-neutral-900 border border-neutral-800 text-white text-sm font-medium
    py-3 pl-4 pr-10 rounded-xl transition-colors
    ${isOpen ? 'border-neutral-700' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-neutral-700'}
  `;

  const menuClasses = `
    absolute z-50 top-full left-0 right-0 mt-2
    bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl
    overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top p-2
  `;

  return (
    <div ref={containerRef} className="relative w-1/2">
      {/* Trigger Button */}
      <button
        onClick={(e) => { e.stopPropagation(); if (!disabled) onToggle(); }}
        className={triggerClasses}
        disabled={disabled}
        type="button"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <img
          src={arrowIcon}
          alt=""
          className={`w-2.5 h-2.5 opacity-60 transition-transform duration-200 absolute right-4 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={menuClasses}>
          <ul>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onChange(option.value); onClose(); }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors
                      ${isSelected ? 'text-white bg-neutral-800' : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'}
                    `}
                    type="button"
                  >
                    {/* Radio Button UI */}
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
                        ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-neutral-600 bg-transparent'}
                      `}
                    >
                      {isSelected && (
                        /* ✅ FIXED: Dot is now BLACK (neutral-900) to match design */
                        <div className="w-2 h-2 rounded-full bg-neutral-900" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};


// --- MAIN CONTROLS COMPONENT ---

interface ControlsProps {
  difficulty: Difficulty;
  setDifficulty: (diff: Difficulty) => void;
  mode: Mode;
  setMode: (mode: Mode) => void;
  timeOption: number;
  setTimeOption: (time: number) => void;
  status: 'idle' | 'running' | 'finished';
}

const Controls = ({
  difficulty,
  setDifficulty,
  mode,
  setMode,
  timeOption,
  setTimeOption,
  status
}: ControlsProps) => {
  const isDisabled = status === 'running';
  const [openDropdown, setOpenDropdown] = useState<'difficulty' | 'mode' | null>(null);

  const currentConfigValue = mode === 'passage' ? 'passage' : `timed-${timeOption}`;
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
    { label: 'Timed (60s)', value: 'timed-60' },
    { label: 'Timed (30s)', value: 'timed-30' },
    { label: 'Timed (120s)', value: 'timed-120' },
    { label: 'Passage', value: 'passage' },
  ];

  const handleClose = () => setOpenDropdown(null);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex gap-3 w-full max-w-5xl mb-6 px-1 relative z-30"
    >
      <CustomSelect
        value={difficulty}
        options={difficultyOptions}
        onChange={(val) => setDifficulty(val as Difficulty)}
        isOpen={openDropdown === 'difficulty'}
        onToggle={() => setOpenDropdown(openDropdown === 'difficulty' ? null : 'difficulty')}
        onClose={handleClose}
        disabled={isDisabled}
      />

      <CustomSelect
        value={currentConfigValue}
        options={modeOptions}
        onChange={handleConfigChange}
        isOpen={openDropdown === 'mode'}
        onToggle={() => setOpenDropdown(openDropdown === 'mode' ? null : 'mode')}
        onClose={handleClose}
        disabled={isDisabled}
      />
    </div>
  );
};

export default Controls;