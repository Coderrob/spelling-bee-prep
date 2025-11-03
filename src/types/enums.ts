export enum GradeBand {
  K_TO_2 = 'k-2',
  THREE_TO_5 = '3-5',
  SIX_TO_8 = '6-8',
  NINE_TO_12 = '9-12',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum PracticeMode {
  RANDOM = 'random',
  DIFFICULTY = 'difficulty',
  CHALLENGES = 'challenges',
}

export enum HintType {
  DEFINITION = 'definition',
  USAGE_EXAMPLE = 'usageExample',
  ORIGIN = 'origin',
}

export enum LocaleCode {
  EN_US = 'en-US',
  ES_ES = 'es-ES',
  FR_FR = 'fr-FR',
}

export enum TtsEngine {
  WEB_SPEECH = 'web-speech',
  ESPEAK_WASM = 'espeak-wasm',
  OPEN_TTS = 'open-tts',
}
