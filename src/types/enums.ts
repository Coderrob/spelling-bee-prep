export const GradeBand = {
  K_TO_2: 'k-2',
  THREE_TO_5: '3-5',
  SIX_TO_8: '6-8',
  NINE_TO_12: '9-12',
} as const;

export type GradeBand = (typeof GradeBand)[keyof typeof GradeBand];

export const Difficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const PracticeMode = {
  RANDOM: 'random',
  DIFFICULTY: 'difficulty',
  CHALLENGES: 'challenges',
} as const;

export type PracticeMode = (typeof PracticeMode)[keyof typeof PracticeMode];

export const HintType = {
  DEFINITION: 'definition',
  USAGE_EXAMPLE: 'usageExample',
  ORIGIN: 'origin',
} as const;

export type HintType = (typeof HintType)[keyof typeof HintType];

export const LocaleCode = {
  EN_US: 'en-US',
  ES_ES: 'es-ES',
  FR_FR: 'fr-FR',
} as const;

export type LocaleCode = (typeof LocaleCode)[keyof typeof LocaleCode];

export const TtsEngine = {
  WEB_SPEECH: 'web-speech',
  ESPEAK_WASM: 'espeak-wasm',
  OPEN_TTS: 'open-tts',
} as const;

export type TtsEngine = (typeof TtsEngine)[keyof typeof TtsEngine];
