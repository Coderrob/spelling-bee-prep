import { forwardRef } from 'react';
import { TextField } from '@mui/material';
import { sanitizeInput } from '@/utils/security';
import type { ReactElement } from 'react';

interface AnswerFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  autoFocus?: boolean;
}

/**
 * Controlled text input that sanitizes user spelling attempts before forwarding them to state.
 *
 * @param props - Component props
 * @param props.value - Current text value
 * @param props.onChange - Change handler invoked with sanitized value
 * @param props.disabled - Disables editing when true
 * @param props.label - Accessible label for the input
 * @param props.autoFocus - Auto-focus flag forwarded to the underlying field
 * @returns Material UI text field configured for spelling inputs
 *
 * @example
 * ```tsx
 * <AnswerField value={attempt} onChange={setAttempt} />
 * ```
 */
export const AnswerField = forwardRef<HTMLInputElement, AnswerFieldProps>(
  (
    {
      value,
      onChange,
      disabled = false,
      label = 'Type the word',
      autoFocus = true,
    }: AnswerFieldProps,
    ref
  ): ReactElement => {
    /**
     * Sanitizes user input to prevent unsafe characters before updating state.
     *
     * @param event - Change event emitted by the text field
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      const sanitized = sanitizeInput(event.target.value);
      onChange(sanitized);
    };

    return (
      <TextField
        fullWidth
        label={label}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        autoFocus={autoFocus}
        inputRef={ref}
        autoComplete="off"
        slotProps={{
          input: {
            'aria-label': label,
          },
        }}
      />
    );
  }
);
AnswerField.displayName = 'AnswerField';
