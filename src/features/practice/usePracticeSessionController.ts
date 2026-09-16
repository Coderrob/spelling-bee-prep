import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent, RefObject } from 'react';
import { animate } from 'animejs';
import { TtsService } from '@/services/tts/TtsService';
import { useCatalogStore, type CatalogStatus } from '@/store/catalogStore';
import { usePracticeStore } from '@/store/practiceStore';
import { useProgressStore } from '@/store/progressStore';
import { useSettingsStore } from '@/store/settingsStore';
import type { HintType, PracticeAttempt, PracticeStatistics, WordEntry } from '@/types';
import { isBrowser } from '@/utils/common';
import { hasContent } from '@/utils/guards';

const ttsService = new TtsService();

function prefersReducedMotion(): boolean {
  return (
    isBrowser() &&
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export interface PracticeSessionController {
  currentWord: WordEntry | null;
  userInput: string;
  isCorrect: boolean | null;
  showHint: boolean;
  hintType: HintType | null;
  statistics: PracticeStatistics;
  history: PracticeAttempt[];
  catalogStatus: CatalogStatus;
  catalogError: string | null;
  isSubmitDisabled: boolean;
  isSpeaking: boolean;
  speechError: string | null;
  answerInputRef: RefObject<HTMLInputElement | null>;
  nextButtonRef: RefObject<HTMLButtonElement | null>;
  cardRef: RefObject<HTMLDivElement | null>;
  setUserInput: (input: string) => void;
  showHintOfType: (hintType: HintType) => void;
  startOrAdvance: () => void;
  submit: (event: FormEvent) => void;
  speak: () => Promise<void>;
  reset: () => void;
}

/** Container hook coordinating catalog, session, speech, focus, and animation effects. */
export function usePracticeSessionController(): PracticeSessionController {
  const catalogWords = useCatalogStore((state) => state.words);
  const catalogStatus = useCatalogStore((state) => state.status);
  const catalogError = useCatalogStore((state) => state.error);
  const initializeCatalog = useCatalogStore((state) => state.initialize);
  const {
    currentWord,
    userInput,
    isCorrect,
    showHint,
    hintType,
    wordsAttempted,
    wordsCorrect,
    wordsIncorrect,
    currentStreak,
    maxStreak,
    accuracy,
    setWordPool,
    setUserInput,
    toggleHint,
    nextWord,
    checkAnswer,
    resetSession,
  } = usePracticeStore();
  const history = useProgressStore((state) => state.attempts);
  const { speechRate, speechVolume } = useSettingsStore();
  const answerInputRef = useRef<HTMLInputElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const speechRequestRef = useRef(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const speakWord = useCallback(
    async (word: string): Promise<void> => {
      const request = ++speechRequestRef.current;
      setIsSpeaking(true);
      setSpeechError(null);
      try {
        await ttsService.speak(word, { rate: speechRate, volume: speechVolume });
      } catch (error) {
        if (request === speechRequestRef.current) {
          console.error('TTS error:', error);
          setSpeechError('Pronunciation is unavailable. Check audio settings and try again.');
        }
      } finally {
        if (request === speechRequestRef.current) {
          setIsSpeaking(false);
        }
      }
    },
    [speechRate, speechVolume]
  );

  const focusAnswer = useCallback((): void => {
    if (isBrowser()) {
      globalThis.requestAnimationFrame(() => {
        answerInputRef.current?.focus();
        answerInputRef.current?.select();
      });
    }
  }, []);

  useEffect(() => {
    void initializeCatalog();
  }, [initializeCatalog]);

  useEffect(() => {
    if (catalogStatus === 'ready') {
      setWordPool(catalogWords);
    }
  }, [catalogStatus, catalogWords, setWordPool]);

  useEffect(() => {
    const speechTimeout = globalThis.setTimeout(() => {
      if (currentWord) {
        void speakWord(currentWord.word);
      }
    }, 0);
    return () => {
      globalThis.clearTimeout(speechTimeout);
      speechRequestRef.current += 1;
      ttsService.cancel();
    };
  }, [currentWord, speakWord]);

  useEffect(() => {
    if (isBrowser() && cardRef.current && !prefersReducedMotion()) {
      animate(cardRef.current, {
        opacity: { from: 0.85, to: 1 },
        y: { from: 8, to: 0 },
        duration: 350,
        ease: 'outCubic',
      });
    }
  }, [currentWord]);

  useEffect(() => {
    if (isBrowser() && cardRef.current && isCorrect !== null && !prefersReducedMotion()) {
      animate(cardRef.current, {
        keyframes: [
          {
            backgroundColor: isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            duration: 400,
          },
          { backgroundColor: 'rgba(20,24,40,0)', duration: 400 },
        ],
        ease: 'inOutQuad',
      });
    }
  }, [currentWord, isCorrect]);

  useEffect(() => {
    if (isCorrect === null) {
      focusAnswer();
    } else {
      nextButtonRef.current?.focus();
    }
  }, [focusAnswer, isCorrect]);

  const startOrAdvance = useCallback((): void => {
    nextWord();
    focusAnswer();
  }, [focusAnswer, nextWord]);

  const submit = useCallback(
    (event: FormEvent): void => {
      event.preventDefault();
      if (isCorrect !== null) {
        startOrAdvance();
      } else if (hasContent(userInput)) {
        checkAnswer();
      }
    },
    [checkAnswer, isCorrect, startOrAdvance, userInput]
  );

  const speak = useCallback(async (): Promise<void> => {
    if (currentWord) {
      await speakWord(currentWord.word);
    }
  }, [currentWord, speakWord]);

  useEffect(() => {
    function handleReplayShortcut(event: KeyboardEvent): void {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.matches('input, textarea, select, button, [contenteditable="true"]');
      if (event.code === 'Space' && !isTyping && currentWord) {
        event.preventDefault();
        void speak();
      }
    }

    globalThis.addEventListener('keydown', handleReplayShortcut);
    return () => globalThis.removeEventListener('keydown', handleReplayShortcut);
  }, [currentWord, speak]);

  const reset = useCallback((): void => {
    resetSession();
    startOrAdvance();
  }, [resetSession, startOrAdvance]);

  return {
    currentWord,
    userInput,
    isCorrect,
    showHint,
    hintType,
    statistics: {
      wordsAttempted,
      wordsCorrect,
      wordsIncorrect,
      currentStreak,
      maxStreak,
      accuracy,
    },
    history,
    catalogStatus,
    catalogError,
    isSubmitDisabled: !hasContent(userInput),
    isSpeaking,
    speechError,
    answerInputRef,
    nextButtonRef,
    cardRef,
    setUserInput,
    showHintOfType: toggleHint,
    startOrAdvance,
    submit,
    speak,
    reset,
  };
}
