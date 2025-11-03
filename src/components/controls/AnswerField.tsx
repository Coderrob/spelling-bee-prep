/*
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { forwardRef } from 'react';
import type { ReactElement } from 'react';
import { TextField } from '@mui/material';
import { sanitizeInput } from '@/utils/security';

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
