import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Speech API
global.speechSynthesis = {
  speak: (utterance: SpeechSynthesisUtterance) => {
    // Simulate speech completion
    setTimeout(() => {
      if (utterance.onend) {
        utterance.onend(new Event('end') as SpeechSynthesisEvent);
      }
    }, 0);
  },
  cancel: () => {},
  pause: () => {},
  resume: () => {},
  getVoices: () => [],
  speaking: false,
  pending: false,
  paused: false,
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
} as unknown as SpeechSynthesis;

global.SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
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
  addEventListener = () => {};
  removeEventListener = () => {};
  dispatchEvent = () => false;
} as unknown as typeof SpeechSynthesisUtterance;
