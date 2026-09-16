import type { ReactElement } from 'react';
import { PracticeView } from './PracticeView';
import { usePracticeSessionController } from './usePracticeSessionController';

/** Container entry point for the spelling practice feature. */
export function PracticePanel(): ReactElement {
  const controller = usePracticeSessionController();
  return <PracticeView {...controller} />;
}
