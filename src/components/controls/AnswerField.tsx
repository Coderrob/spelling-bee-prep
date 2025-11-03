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

export function AnswerField({
  value,
  onChange,
  disabled = false,
  label = 'Type the word',
  autoFocus = true,
}: AnswerFieldProps): ReactElement {
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
      autoComplete="off"
    />
  );
}
