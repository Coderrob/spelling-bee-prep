/*
 * Copyright 2025 Robert Lindley
 * Licensed under the Apache License, Version 2.0.
 */

import type { ReactElement } from 'react';
import { FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import { useCatalogStore } from '@/store/catalogStore';
import { GradeLevel } from '@/types';

function formatGrade(grade: GradeLevel): string {
  return grade === GradeLevel.KINDERGARTEN ? 'Kindergarten' : `Grade ${grade}`;
}

/** Selects the curriculum grade whose word pack should be practiced. */
export function GradeSelector(): ReactElement {
  const selectedGrade = useCatalogStore((state) => state.selectedGrade);
  const selectGrade = useCatalogStore((state) => state.selectGrade);

  function handleChange(event: SelectChangeEvent<GradeLevel>): void {
    void selectGrade(event.target.value);
  }

  return (
    <FormControl fullWidth size="small" className="practice-control">
      <InputLabel id="practice-grade-label">Grade level</InputLabel>
      <Select
        labelId="practice-grade-label"
        id="practice-grade"
        value={selectedGrade}
        label="Grade level"
        onChange={handleChange}
      >
        {Object.values(GradeLevel).map((grade) => (
          <MenuItem key={grade} value={grade}>
            {formatGrade(grade)}
          </MenuItem>
        ))}
      </Select>
      <p className="practice-control__helper">Words matched to this grade</p>
    </FormControl>
  );
}
