import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Speech API
/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
(globalThis as any).speechSynthesis = {
  speak: (utterance: SpeechSynthesisUtterance) => {
    // Simulate speech completion
    setTimeout(() => {
      if (utterance.onend) {
        utterance.onend(new Event('end') as SpeechSynthesisEvent);
      }
    }, 0);
  },
  cancel: () => {
    // Mock implementation
  },
  pause: () => {
    // Mock implementation
  },
  resume: () => {
    // Mock implementation
  },
  getVoices: () => [],
  speaking: false,
  pending: false,
  paused: false,
  addEventListener: () => {
    // Mock implementation
  },
  removeEventListener: () => {
    // Mock implementation
  },
  dispatchEvent: () => false,
} as unknown as SpeechSynthesis;

/**
 * Mock SpeechSynthesisUtterance class
 */
(globalThis as any).SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
  text = '';
  lang = '';
  voice = null;
  volume = 1;
  rate = 1;
  pitch = 1;
  onstart: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null;
  onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null;
  onerror: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => void) | null = null;
  onpause: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null;
  onresume: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null;
  onmark: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null;
  onboundary: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null;
  addEventListener = (): void => {
    // Mock implementation
  };
  removeEventListener = (): void => {
    // Mock implementation
  };
  dispatchEvent = (): boolean => false;
} as unknown as typeof SpeechSynthesisUtterance;
/* eslint-enable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */
