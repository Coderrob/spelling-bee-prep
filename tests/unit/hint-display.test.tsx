import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it } from 'vitest';
import { HintDisplay } from '../../src/features/practice/components/HintDisplay';
import i18n from '../../src/i18n/config';
import { Difficulty, GradeLevel, HintType } from '../../src/types';

describe('HintDisplay', () => {
  it('masks a spelling word when a source definition repeats it', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <HintDisplay
          hintType={HintType.DEFINITION}
          currentWord={{
            id: 'g1-card',
            word: 'card',
            gradeLevel: GradeLevel.FIRST,
            difficulty: Difficulty.EASY,
            definition: 'A playing card used in a game.',
            sourceId: 'test',
          }}
        />
      </I18nextProvider>
    );

    expect(screen.getByText('A playing ___ used in a game.')).toBeVisible();
    expect(screen.queryByText(/playing card/i)).not.toBeInTheDocument();
  });
});
