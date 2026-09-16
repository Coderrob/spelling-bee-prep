import type { ReactElement } from 'react';
import { AutoAwesome, LocalFireDepartment, Shuffle, Tune } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { usePracticeStore } from '@/store/practiceStore';
import { PracticeMode } from '@/types';

const practiceModes = [
  {
    value: PracticeMode.RANDOM,
    description: 'A balanced mix',
    icon: Shuffle,
  },
  {
    value: PracticeMode.DIFFICULTY,
    description: 'Use your filters',
    icon: Tune,
  },
  {
    value: PracticeMode.CHALLENGES,
    description: 'Stretch your skills',
    icon: LocalFireDepartment,
  },
  {
    value: PracticeMode.ADAPTIVE,
    description: 'Review words due now',
    icon: AutoAwesome,
  },
] as const;

/** Selects the strategy used to choose the next spelling word. */
export function PracticeModeSelector(): ReactElement {
  const { t } = useTranslation();
  const mode = usePracticeStore((state) => state.mode);
  const setMode = usePracticeStore((state) => state.setMode);

  return (
    <fieldset className="mode-picker">
      <legend className="mode-picker__legend">Practice style</legend>
      <div className="mode-picker__options" aria-label="Practice mode">
        {practiceModes.map(({ value, description, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            aria-pressed={mode === value}
            className={`mode-picker__option ${mode === value ? 'mode-picker__option--selected' : ''}`}
          >
            <span className="mode-picker__label">
              <Icon className="mode-picker__icon" fontSize="small" aria-hidden="true" />
              {t(`practice.modes.${value}`)}
            </span>
            <span className="mode-picker__description">{description}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
