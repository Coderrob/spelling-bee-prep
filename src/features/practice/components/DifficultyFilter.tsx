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

import type { ReactElement } from 'react';
import {
  Box,
  Chip,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { usePracticeStore } from '@/store/practiceStore';
import { Difficulty } from '@/types';
import { formatDifficultyLabel } from './insights';

const DIFFICULTY_OPTIONS: Difficulty[] = [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD];
const SELECT_ID = 'practice-difficulty-filter';

/**
 * Multi-select control that allows learners to restrict practice to specific difficulty levels.
 *
 * @returns Form control containing the difficulty selector
 * @example
 * <DifficultyFilter />
 */
export function DifficultyFilter(): ReactElement {
  const { t } = useTranslation();

  const selectedDifficulties = usePracticeStore((state) => state.selectedDifficulties);
  const setDifficulties = usePracticeStore((state) => state.setDifficulties);

  /**
   * Updates the store with the newly selected difficulty filters.
   *
   * @param event - Selection change event from the MUI select component
   */
  function handleChange(event: SelectChangeEvent<string[]>): void {
    const value = event.target.value;
    setDifficulties(value as Difficulty[]);
  }

  const label = t('practice.filters.difficulty', 'Filter by difficulty');

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${SELECT_ID}-label`}>{label}</InputLabel>
      <Select
        labelId={`${SELECT_ID}-label`}
        id={SELECT_ID}
        multiple
        value={selectedDifficulties}
        onChange={handleChange}
        label={label}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((difficulty) => (
              <Chip key={difficulty} label={formatDifficultyLabel(difficulty)} size="small" />
            ))}
          </Box>
        )}
      >
        {DIFFICULTY_OPTIONS.map((difficulty) => (
          <MenuItem key={difficulty} value={difficulty}>
            <Checkbox checked={selectedDifficulties.includes(difficulty)} />
            <ListItemText primary={formatDifficultyLabel(difficulty)} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
